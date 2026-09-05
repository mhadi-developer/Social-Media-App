'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthProvider";
import {
  Zap,
  Home,
  MessageSquare,
  Phone,
  Users,
  PlusCircle,
  User,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

type NavBadge = {
  count: number;
  /** Use the accent-primary pink instead of the default gradient badge */
  accent?: boolean;
};

type NavItem = {
  href: string;
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: NavBadge;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', id: 'nav-home', label: 'Home', icon: Home },
  {
    href: '/chat',
    id: 'nav-chats',
    label: 'Explore/Chats',
    icon: MessageSquare,
    badge: { count: 4 },
  },
  { href: '/calls', id: 'nav-calls', label: 'Calls', icon: Phone },
  {
    href: '/requests',
    id: 'nav-requests',
    label: 'Requests',
    icon: Users,
    badge: { count: 2, accent: true },
  },
  { href: '/post/create', id: 'nav-create-post', label: 'Create Post', icon: PlusCircle },
  { href: '/profile', id: 'nav-profile', label: 'Profile', icon: User },
];

/** Home only matches the exact root path; every other tab also matches its sub-routes. */
function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const Sidebar: React.FC = () => {
  const {user} = useAuth();
  console.log(user);
  const pathname = usePathname();

  return (
    <aside className="Sidebar">
      <div>
        <div className="Sidebar__logo-container">
          <div className="Sidebar__logo-icon">
            <Zap />
          </div>
          <span className="Sidebar__logo-text">Conflux</span>
        </div>

        <nav className="Sidebar__nav">
          {NAV_ITEMS.map(({ href, id, label, icon: Icon, badge }) => {
            const active = isActivePath(pathname || '/', href);

            return (
              <Link
                key={id}
                href={href}
                id={id}
                className={`Sidebar__nav-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="Sidebar__nav-item-left">
                  {/* Full lucide icon + label, shown on desktop */}
                  <Icon className="desktop-icon" />
                  {/* Compact icon-only version for the mobile bottom bar;
                      sizing/coloring (muted → active gradient) is handled in CSS */}
                  <Icon className="mobile-icon" size={20} strokeWidth={2} aria-hidden="true" />
                  <span className="Sidebar__nav-item-text">{label}</span>
                </div>

                {badge && (
                  <span
                    className="Sidebar__nav-badge"
                    style={badge.accent ? { backgroundColor: 'var(--accent-primary)' } : undefined}
                  >
                    {badge.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Card */}

      {
        user?.email? (
          <div className="Sidebar__profile-card" id="profile-card">
        <div className="Sidebar__profile-info">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Sarah Connor"
            width={40}
            height={40}
            className="Sidebar__profile-avatar"
          />
          <div className="Sidebar__profile-meta">
            <span className="Sidebar__profile-name">{`${user?.firstName}  ${user?.lastName}`}</span>
            <span className="Sidebar__profile-username">@sarah_c</span>
          </div>
        </div>
        <ChevronRight />
      </div>
        ):(<div>
           <Link href={'/login'} className="sidebar-navigate-to-login-button">Sign In</Link>
        </div>)
      }
      
    </aside>
  );
};