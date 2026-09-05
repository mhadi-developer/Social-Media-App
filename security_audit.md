# Security Audit Report — Inventory Management System
**Date:** 2026-09-03 | **Auditor:** Antigravity AI Security Review  
**Scope:** `Backend2/` (Node.js/Express + Prisma) · `Frontend2/` (React/Vite)

---

## 1. Executive Summary

| Severity | Count |
|---|---|
| 🔴 **Critical** | 2 |
| 🟠 **High** | 5 |
| 🟡 **Medium** | 6 |
| 🔵 **Low / Info** | 4 |

> [!CAUTION]
> Two critical findings require immediate remediation before any production deployment:
> hardcoded fallback encryption secret shared between frontend and backend, and
> complete absence of security headers (`helmet`).

---

## 2. Detailed Findings

---

### 🔴 CRITICAL-1 — Hardcoded Fallback Encryption Secret (Shared Frontend/Backend)

**Files:**
- [`authController.js:14`](file:///h:/projects/Inventory-Mangment/Backend2/src/controllers/authController.js#L14)
- [`AuthProvider.jsx:44`](file:///h:/projects/Inventory-Mangment/Frontend2/src/context/AuthProvider.jsx#L44)

**Pattern found:**
```js
// Backend
const secretKey = process.env.USER_PAYLOAD_SECRET || "a-very-secret-key-1234567890123";

// Frontend
const secretKey = import.meta.env.VITE_USER_PAYLOAD_SECRET || "a-very-secret-key-1234567890123";
```

**Risk:** If `USER_PAYLOAD_SECRET` is missing from `.env`, the fallback `"a-very-secret-key-1234567890123"` is used in **both** backend and frontend. An attacker who reads any bundled JS file can recover this key and forge valid encrypted user payloads, bypassing the entire auth chain. CryptoJS AES (used here) in CBC mode is also **not authenticated encryption** — it is malleable without the HMAC wrapper.

**Fix:**
```js
// Backend — authController.js line 14
const secretKey = process.env.USER_PAYLOAD_SECRET;
if (!secretKey) throw new Error('USER_PAYLOAD_SECRET is not set');

// Frontend — AuthProvider.jsx line 44
const secretKey = import.meta.env.VITE_USER_PAYLOAD_SECRET;
if (!secretKey) {
    window.location.href = import.meta.env.VITE_TMS_URL;
    return;
}
```
Also add a startup assertion in `server.js`:
```js
['JWT_SECRET_KEY', 'USER_PAYLOAD_SECRET', 'IMS_AES_HEX', 'IMS_HMAC_HEX'].forEach(k => {
    if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
});
```

---

### 🔴 CRITICAL-2 — No Security Headers (`helmet` missing entirely)

**File:** [`server.js`](file:///h:/projects/Inventory-Mangment/Backend2/src/server.js)

**Risk:** The Express server sends **no** security response headers. Any browser accessing the API is unprotected from:
- Clickjacking (`X-Frame-Options` missing)
- MIME sniffing (`X-Content-Type-Options` missing)
- XSS via content injection (`Content-Security-Policy` missing)
- Downgrade attacks (`Strict-Transport-Security` missing)

**Fix:**
```bash
npm install helmet
```
```js
// server.js — add after imports
import helmet from 'helmet';

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'"],
            styleSrc:   ["'self'"],
            imgSrc:     ["'self'", "data:"],
            connectSrc: ["'self'"],
            frameSrc:   ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

---

### 🟠 HIGH-1 — `err.message` Leaked in ALL 500 Responses

**Files:** Every controller (`itemsController.js`, `categoriesController.js`, `suppliersController.js`, `tendersController.js`, `directoratesController.js`, `server.js:69`, `middleware/tmsToken.js:66`, `middleware/imsToken.js:45`)

**Example (itemsController.js:93):**
```js
return res.status(500).json({ error: err.message });
```

**Risk:** Prisma, Node.js, and crypto error messages routinely include internal table names, column names, file paths, and SQL fragments. This is direct information disclosure. Example: a Prisma `P2002` unique constraint error message reveals the column name that caused the conflict.

**Fix — create a safe error helper:**
```js
// src/utils/apiError.js
const isDev = process.env.NODE_ENV !== 'production';

export function sendError(res, err, status = 500) {
    console.error(err); // log full error server-side only
    return res.status(status).json({
        error: isDev ? err.message : 'An internal error occurred',
    });
}
```
Replace all `res.status(500).json({ error: err.message })` calls with `sendError(res, err)`.

---

### 🟠 HIGH-2 — Cookie Logging (Full Cookie Dump to Console)

**File:** [`middleware/tmsToken.js:24`](file:///h:/projects/Inventory-Mangment/Backend2/src/middleware/tmsToken.js#L24)

```js
console.log(req.cookies);  // Line 24 — dumps ALL cookies on every request
```

**Risk:** Every single authenticated request logs all cookies (including `IMS-Auth-Token`, `IMS_SESSION_TOKEN`) to the server console / stdout. In any environment with log aggregation (Papertrail, Cloudwatch, etc.) these tokens are stored in plaintext, dramatically expanding the blast radius of a log breach.

**Fix:** Remove the `console.log(req.cookies)` line entirely. If debugging is needed, use a conditional:
```js
if (process.env.DEBUG_AUTH === 'true') {
    console.log('[tmsToken] cookies present:', Object.keys(req.cookies));
}
```

---

### 🟠 HIGH-3 — No Rate Limiting on ANY Endpoint

**File:** [`server.js`](file:///h:/projects/Inventory-Mangment/Backend2/src/server.js)

**Risk:** All API routes are completely open to brute-force and DoS. Specifically:
- `/api/get/login/user` — can be called in rapid succession to probe token validity
- `/api/reports/inventory/export` — generates Excel workbooks; unlimited calls could exhaust memory/CPU
- All `DELETE` endpoints — no throttle on destructive operations

**Fix:**
```bash
npm install express-rate-limit
```
```js
// server.js
import rateLimit from 'express-rate-limit';

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

const exportLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5, // max 5 exports per minute
    message: { error: 'Export rate limit exceeded.' },
});

app.use(globalLimiter);
app.use('/api/reports/inventory/export', exportLimiter);
```

---

### 🟠 HIGH-4 — Session Token Cookie Missing `Secure` Flag in Non-Production

**File:** [`middleware/tmsToken.js:57`](file:///h:/projects/Inventory-Mangment/Backend2/src/middleware/tmsToken.js#L57)

```js
secure: process.env.NODE_ENV === "production",
```

**Risk:** The `IMS_SESSION_TOKEN` cookie is issued **without** the `Secure` flag in development. If developers test against a staging server over HTTP (not HTTPS), the session token is transmitted in cleartext. Staging environments often have the same credentials as production.

**Fix:** Also enforce `SameSite: 'strict'` instead of `'lax'` to prevent CSRF:
```js
res.cookie("IMS_SESSION_TOKEN", sessionToken, {
    httpOnly: true,
    sameSite: "strict",   // was 'lax'
    path: "/",
    secure: true,         // always — enforce HTTPS at infra level
    maxAge: 30 * 60 * 1000
});
```

---

### 🟠 HIGH-5 — `imsToken` Middleware Falls Back to `decryptIMSAuthToken` on JWT Failure (Silent Algorithm Confusion)

**File:** [`middleware/imsToken.js:29-32`](file:///h:/projects/Inventory-Mangment/Backend2/src/middleware/imsToken.js#L29)

```js
try {
    claims = jwt.verify(token, process.env.JWT_SECRET_KEY);
} catch (jwtErr) {
    claims = decryptIMSAuthToken(token); // fallback on ANY jwt failure
}
```

**Risk:** If `jwt.verify` throws (expired, wrong algorithm, tampered), the code silently falls back to the legacy IMS decryption path. An attacker who can craft a token that fails JWT verification but passes the IMS decryption (e.g., a custom-built token) may bypass the more strict JWT validation entirely. This is a classic **algorithm confusion / fallback bypass** pattern.

**Fix:** Separate the two auth paths based on token type, not on exception:
```js
// Detect IMS_SESSION_TOKEN vs raw IMS-Auth-Token by presence in specific cookie
const sessionToken = req.cookies?.IMS_SESSION_TOKEN;
const rawToken     = req.cookies?.['IMS-Auth-Token'] || req.cookies?.['IMS_AUTH_TOKEN'];

if (sessionToken) {
    claims = jwt.verify(sessionToken, process.env.JWT_SECRET_KEY); // throws on failure — don't catch
} else if (rawToken) {
    claims = decryptIMSAuthToken(rawToken);
} else {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
}
```

---

### 🟡 MEDIUM-1 — No Server-Side Schema Validation (No Zod/Joi)

**Files:** All controllers (items, suppliers, tenders, categories, directorates)

**Risk:** Input validation is limited to presence checks (e.g., `if (!item_name)`) with no type, length, or format enforcement. Examples of gaps:

| Endpoint | Field | Gap |
|---|---|---|
| `POST /items` | `fiscal_year` | Accepts any string — no date format enforcement |
| `POST /items` | `acquisition_type` | Accepts any value — should be `"1"` or `"2"` only |
| `POST /categories` | `name` | No max length — DB may truncate silently |
| `GET /reports/export` | `from`, `to` | `new Date(req.query.from)` — no format validation, `Invalid Date` propagates |
| `GET /reports/export` | `status` | Accepts any string passed directly to Prisma `where` |

**Fix — add Zod to the backend:**
```bash
npm install zod
```
```js
// Example for POST /items
import { z } from 'zod';

const itemSchema = z.object({
    category_id:      z.coerce.number().int().positive(),
    item_name:        z.string().trim().min(1).max(255),
    directorate_id:   z.coerce.number().int().positive(),
    serial_number:    z.string().max(100).optional().nullable(),
    fiscal_year:      z.string().regex(/^\d{4}-\d{4}$/).optional().nullable(),
    acquisition_type: z.enum(["1", "2"]).optional(),
    // ...
});

export async function store(req, res) {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(422).json({ errors: parsed.error.flatten() });
    }
    // use parsed.data from here on
}
```

---

### 🟡 MEDIUM-2 — `username` in Report Log Trusts Client-Supplied Query Parameter

**File:** [`reportController.js:316-317`](file:///h:/projects/Inventory-Mangment/Backend2/src/controllers/reportController.js#L316)

```js
const requestedUsername = String(req.query.username || '').trim();
const username = user?.user_name || user?.username || user?.name || (requestedUsername !== '' ? requestedUsername : 'Guest');
```

**Risk:** The audit log can have its `username` field spoofed. If `user?.user_name` is null/undefined (shouldn't happen, but possible on edge cases), the client-supplied `?username=` parameter is logged as the actor. This undermines the integrity of the audit trail.

**Fix:** Always derive username from the verified JWT only:
```js
const username = user?.user_name || user?.username || user?.name || 'Unknown';
// Remove requestedUsername entirely from the log
```

---

### 🟡 MEDIUM-3 — `GET /api/get/tms-user` Returns Raw JWT Claims to Client

**File:** [`authController.js:25-31`](file:///h:/projects/Inventory-Mangment/Backend2/src/controllers/authController.js#L25)

```js
export function getTmsUser(req, res) {
    return res.json({
        success: true,
        user: req.loginUser,  // full decoded JWT payload
    });
}
```

**Risk:** This endpoint returns the entire decoded JWT payload including internal claims (`iat`, `exp`, `department_name`, `ss_role_title`, etc.) to any authenticated client. While not immediately exploitable, it exposes internal data model and role structure which aids enumeration.

**Fix:** Return only the fields the frontend actually needs:
```js
export function getTmsUser(req, res) {
    const { user_name, ss_role_title, department_name } = req.loginUser || {};
    return res.json({ success: true, user: { user_name, ss_role_title, department_name } });
}
```

---

### 🟡 MEDIUM-4 — `suppliersController` and `tendersController` Missing Directorate Admin IDOR Guards on Write Endpoints

**Files:**
- [`suppliersController.js:138-162`](file:///h:/projects/Inventory-Mangment/Backend2/src/controllers/suppliersController.js#L138) — `update` and `destroy`
- [`tendersController.js`](file:///h:/projects/Inventory-Mangment/Backend2/src/controllers/tendersController.js) — `update` and `destroy`

**Risk:** While `GET /suppliers` correctly filters by `tender.directorate`, `PUT /suppliers/:id` and `DELETE /suppliers/:id` have no ownership check. A Directorate Admin could modify or delete a supplier belonging to a different directorate by guessing the numeric `id`.

**Fix (example for suppliersController update):**
```js
export async function update(req, res) {
    const existing = await prisma.supplier.findUnique({
        where:   { id: Number(req.params.id) },
        include: { tender: true },
    });
    if (!existing) return res.status(404).json({ message: 'Supplier not found' });

    // IDOR guard
    const role = req.user?.ss_role_title;
    const dept = req.user?.department_name;
    if (role === ROLES.DIR_ADMIN && dept && existing.tender?.directorate !== dept) {
        return res.status(403).json({ message: 'Forbidden: Supplier not in your directorate' });
    }
    // ... rest of update
}
```

---

### 🟡 MEDIUM-5 — CORS: `allowedOrigins` Falls Back to Empty Allow-All on Missing `.env`

**File:** [`server.js:26-35`](file:///h:/projects/Inventory-Mangment/Backend2/src/server.js#L26)

```js
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // ...
}
```

**Risk:** If `ALLOWED_ORIGINS` is not set, `allowedOrigins` is an empty array. The check `allowedOrigins.includes(origin)` fails, so CORS is blocked for all cross-origin requests — this is actually safe but breaks the app silently. However the `!origin` branch still allows curl/Postman with no origin header, meaning the API is reachable without CORS protection.

**Fix:** Add an env assertion (covered in CRITICAL-1 fix) and log the origins on startup:
```js
if (!allowedOrigins.length) throw new Error('ALLOWED_ORIGINS must be set');
console.log('[CORS] Allowed origins:', allowedOrigins);
```

---

### 🟡 MEDIUM-6 — Vulnerable npm Dependencies

**From `npm audit` results:**

| Package | Severity | CVE/Advisory | Fix |
|---|---|---|---|
| `qs` (via express) | Moderate | GHSA-x5fp-wj9c-mxmx, GHSA-4mjr-xmp4-gh2g | `npm update express` |
| `express` 4.22.2 | Moderate | via qs | `npm update express` |
| `body-parser` | Moderate | via qs | resolved by updating express |
| `exceljs` | Moderate | via `uuid` | `npm audit fix` or pin to 3.4.0 |
| `brace-expansion` (frontend) | High | GHSA-mh99-v99m-4gvg — OOM DoS | `npm audit fix` |
| `browserslist` (frontend) | High | GHSA-c83g-rgw3-j3cx — OOM | `npm audit fix` |
| `nanoid` (frontend) | High | (see audit) | `npm audit fix` |

**Fix commands:**
```bash
# Backend
cd Backend2
npm update express
npm audit fix

# Frontend
cd Frontend2
npm audit fix
```

---

### 🔵 LOW-1 — `decryption.js` Error Logged with Full Stack (Crypto Error Exposure)

**File:** [`services/decryption.js:51`](file:///h:/projects/Inventory-Mangment/Backend2/src/services/decryption.js#L51)

```js
console.error("decryption error:", error);
```

**Risk:** Crypto library errors can include IV values, key details, or buffer contents. Low risk but worth scrubbing.

**Fix:**
```js
console.error("decryption error:", error.code || error.constructor.name);
```

---

### 🔵 LOW-2 — `import { log } from "node:console"` — Unused Import

**File:** [`middleware/tmsToken.js:3`](file:///h:/projects/Inventory-Mangment/Backend2/src/middleware/tmsToken.js#L3)

```js
import { log } from "node:console"; // never used
```

Remove. Dead code increases attack surface and review overhead.

---

### 🔵 LOW-3 — No `semgrep` or ESLint Security Plugin in CI

**Observed:** No `.eslintrc` security plugin, no `.semgrep.yml`, no CI pipeline config found.

**Fix:** Install and configure:
```bash
npm install --save-dev eslint-plugin-security
# .eslintrc.js
plugins: ['security'],
extends: ['plugin:security/recommended']
```
For semgrep (not installed):
```bash
# Install: pip install semgrep
semgrep --config p/owasp-top-ten --config p/security-audit Backend2/src/
```

---

### 🔵 LOW-4 — `SameSite: 'lax'` on Session Cookie Allows CSRF on Top-Level Navigation

**File:** [`middleware/tmsToken.js:55`](file:///h:/projects/Inventory-Mangment/Backend2/src/middleware/tmsToken.js#L55)

`SameSite: 'lax'` allows cookies to be sent on top-level GET navigations from external sites. For a cookie-authenticated API, `'strict'` is safer. Covered in HIGH-4 fix.

---

## 3. OWASP Top 10 Coverage Summary

| # | Category | Status | Finding |
|---|---|---|---|
| A01 | Broken Access Control | ⚠️ Partial | Suppliers/Tenders write endpoints lack Directorate Admin IDOR guard (MEDIUM-4) |
| A02 | Cryptographic Failures | 🔴 Critical | Hardcoded fallback secret (CRITICAL-1); `SameSite: lax` (HIGH-4) |
| A03 | Injection | ✅ Good | All DB access via Prisma ORM parameterized queries. No raw SQL found. |
| A04 | Insecure Design | 🟠 High | No rate limiting anywhere (HIGH-3) |
| A05 | Security Misconfiguration | 🔴 Critical | No helmet/security headers (CRITICAL-2); cookie logging (HIGH-2) |
| A06 | Vulnerable Components | 🟠 High | Multiple moderate/high npm advisories (MEDIUM-6) |
| A07 | Auth Failures | 🟠 High | imsToken fallback bypass risk (HIGH-5) |
| A08 | Software Integrity | ⚠️ Unknown | No CI/CD pipeline files found in scope — cannot assess |
| A09 | Logging & Monitoring | 🟡 Medium | Full cookie dump to console (HIGH-2); audit log spoofable (MEDIUM-2) |
| A10 | SSRF | ✅ Good | No user-supplied URL fetching found |

---

## 4. API Route Map (for DAST / ZAP Scanner)

### Unauthenticated Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/up` | Health check — expose publicly |

### Authenticated (IMS token required)
| Method | Path | Roles Allowed |
|---|---|---|
| GET | `/api/get/login/user` | All (token validated) |
| GET | `/api/get/tms-user` | All (token validated) |
| GET | `/api/dashboard/stats` | All roles |
| GET | `/api/items` | All roles |
| POST | `/api/items` | Sub Admin, Dir Admin |
| GET | `/api/items/:id` | All roles (IDOR scoped) |
| PUT | `/api/items/:id` | Sub Admin, Dir Admin |
| DELETE | `/api/items/:id` | Sub Admin, Dir Admin |
| GET | `/api/categories` | All roles |
| POST | `/api/categories` | Sub Admin |
| PUT | `/api/categories/:id` | Sub Admin |
| DELETE | `/api/categories/:id` | Sub Admin |
| GET | `/api/directorates` | All roles |
| GET | `/api/directorates/:id` | All roles |
| POST | `/api/directorates` | Sub Admin |
| PUT | `/api/directorates/:id` | Sub Admin |
| DELETE | `/api/directorates/:id` | Sub Admin |
| GET | `/api/tenders` | All roles |
| POST | `/api/tenders` | Sub Admin, Dir Admin |
| DELETE | `/api/tenders/:id` | Sub Admin, Dir Admin |
| GET | `/api/suppliers` | All roles |
| POST | `/api/suppliers` | Sub Admin, Dir Admin |
| PUT | `/api/suppliers/:id` | Sub Admin, Dir Admin ⚠️ No IDOR guard |
| DELETE | `/api/suppliers/:id` | Sub Admin, Dir Admin ⚠️ No IDOR guard |
| GET | `/api/reports/inventory/export` | Super Admin, Sub Admin, Dir Admin |
| GET | `/api/reports/inventory/logs` | Super Admin, Sub Admin, Dir Admin |
| GET | `/api/directorates/item-summary` | All roles |

---

## 5. Prioritized Remediation Checklist

```
IMMEDIATE (before production):
[ ] CRITICAL-1  Remove hardcoded fallback secret + add env assertions at startup
[ ] CRITICAL-2  Install and configure helmet with explicit CSP, HSTS, X-Frame-Options
[ ] HIGH-1      Create sendError() helper — stop leaking err.message in 500 responses
[ ] HIGH-2      Remove console.log(req.cookies) from tmsToken middleware
[ ] HIGH-3      Install express-rate-limit — apply global + per-export limiter
[ ] HIGH-4      Change IMS_SESSION_TOKEN cookie to SameSite: strict, Secure: always
[ ] HIGH-5      Split imsToken auth path — no exception-based fallback

SHORT TERM (within 1 sprint):
[ ] MEDIUM-1    Add Zod schema validation to all POST/PUT controllers
[ ] MEDIUM-2    Remove client-supplied username from audit log
[ ] MEDIUM-3    Restrict /get/tms-user response to minimal fields only
[ ] MEDIUM-4    Add Directorate Admin IDOR guard to suppliers/tenders write endpoints
[ ] MEDIUM-5    Assert ALLOWED_ORIGINS is set on startup
[ ] MEDIUM-6    Run npm audit fix in both Backend2/ and Frontend2/

MAINTENANCE:
[ ] LOW-1       Scrub crypto error logging
[ ] LOW-2       Remove unused import in tmsToken.js
[ ] LOW-3       Add eslint-plugin-security + semgrep to CI pipeline
[ ] LOW-4       Covered by HIGH-4 fix
```

---

## 6. Tools Not Available / Install Commands

| Tool | Status | Install |
|---|---|---|
| `semgrep` | ❌ Not installed | `pip install semgrep` then `semgrep --config p/owasp-top-ten Backend2/src/` |
| `eslint-plugin-security` | ❌ Not configured | `npm i -D eslint-plugin-security` |
| OWASP ZAP | ❌ Requires running server | Download from `zaproxy.org`, run `zap-baseline.py -t http://localhost:8002` |
| `composer audit` | N/A | No PHP/Laravel code in scope (Backend2 is Node only) |

> **Say "apply fixes" to have me automatically implement the remediation code changes.**
