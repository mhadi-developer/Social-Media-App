"use client";

import { useState } from "react";
import {
  Activity,
  BarChart2,
  Bookmark,
  Calendar,
  Circle,
  Eye,
  FileText,
  Grid3X3,
  Hash,
  Heart,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  PlayCircle,
  Send,
  Settings,
  Share2,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

const avatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

const posts = [
  {
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80",
    likes: "1.1k",
    comments: "48",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80",
    likes: "892",
    comments: "32",
  },
  {
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80",
    likes: "682",
    comments: "21",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80",
    likes: "1.4k",
    comments: "67",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80",
    likes: "580",
    comments: "14",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80",
    likes: "925",
    comments: "39",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80",
    likes: "2.1k",
    comments: "88",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80",
    likes: "432",
    comments: "11",
  },
  {
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80",
    likes: "749",
    comments: "29",
  },
];

const highlights = [
  {
    label: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=100&q=80",
  },
  {
    label: "Design",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=100&q=80",
  },
  {
    label: "Code",
    seen: true,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=100&q=80",
  },
  {
    label: "Setup",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80",
  },
  {
    label: "Gaming",
    seen: true,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80",
  },
];

const mutualAvatars = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=60&q=80",
];

const engagementBars = [
  "EngBar--m",
  "EngBar--l",
  "EngBar--h",
  "EngBar--m",
  "EngBar--t",
  "EngBar--h",
  "EngBar--m",
];

export  function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Posts");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard may not be available in every browser/context.
    }
  };

  return (
    <main className="CenterCanvas">
      <div className="ProfilePage">
        {/* Cover */}
        <div className="ProfileCover" />

        {/* Identity */}
        <section className="ProfileIdentity">
          <div className="ProfileIdentity__left">
            <div className="ProfileIdentity__avatar-wrap">
              <img
                src={avatar}
                alt="Sarah Connor"
                className="ProfileIdentity__avatar"
              />

              <span className="ProfileIdentity__online" />
            </div>

            <div className="ProfileIdentity__info">
              <div className="ProfileIdentity__name">
                Sarah Connor
              </div>

              <div className="ProfileIdentity__handle">
                @sarah_c &nbsp;·&nbsp; San Francisco, CA
              </div>

              <div className="ProfileIdentity__badges">
                <span className="Badge Badge--verified">
                  ✦ Verified
                </span>

                <span className="Badge Badge--role">
                  Product Designer
                </span>

                <span className="Badge Badge--role">
                  Frontend Dev
                </span>
              </div>
            </div>
          </div>

          <div className="ProfileIdentity__actions">
            <button className="Btn Btn--ghost">
              <Settings size={13} />
              Edit Profile
            </button>

            <button
              className="Btn Btn--primary"
              onClick={handleShare}
            >
              <Share2 size={13} />
              Share
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="StatsBar">
          <div className="StatItem">
            <span className="StatItem__num">142</span>
            <span className="StatItem__label">Posts</span>
            <span className="StatItem__trend">
              ↑ +3 this week
            </span>
          </div>

          <div className="StatItem">
            <span className="StatItem__num">12.8k</span>
            <span className="StatItem__label">Followers</span>
            <span className="StatItem__trend">
              ↑ +248 this month
            </span>
          </div>

          <div className="StatItem">
            <span className="StatItem__num">482</span>
            <span className="StatItem__label">Following</span>
            <span className="StatItem__trend">&nbsp;</span>
          </div>

          <div className="StatItem">
            <span className="StatItem__num">94.2k</span>
            <span className="StatItem__label">Likes</span>
            <span className="StatItem__trend">
              ↑ +1.2k this week
            </span>
          </div>
        </section>

        {/* Body */}
        <div className="ProfileBody">
          {/* LEFT CONTENT */}
          <div className="ProfileMain">
            {/* Activity Overview */}
            <div className="SectionTitle">
              <BarChart2
                size={15}
                color="var(--accent-primary)"
              />
              Activity Overview
            </div>

            <div className="ActivityGrid">
              <ActivityCard
                icon={<Heart size={15} />}
                iconClass="ACard__icon--pink"
                value="94.2k"
                label="Total Likes"
              />

              <ActivityCard
                icon={<MessageCircle size={15} />}
                iconClass="ACard__icon--blue"
                value="3,817"
                label="Comments"
              />

              <ActivityCard
                icon={<Send size={15} />}
                iconClass="ACard__icon--purple"
                value="6,203"
                label="Shares"
              />

              <ActivityCard
                icon={<Bookmark size={15} />}
                iconClass="ACard__icon--orange"
                value="11.4k"
                label="Saves"
              />

              <ActivityCard
                icon={<Eye size={15} />}
                iconClass="ACard__icon--green"
                value="2.1M"
                label="Profile Views"
              />

              <ActivityCard
                icon={<TrendingUp size={15} />}
                iconClass="ACard__icon--red"
                value="7.4%"
                label="Engagement"
              />
            </div>

            {/* Weekly Engagement */}
            <div
              className="SideCard"
              style={{ marginBottom: "1.25rem" }}
            >
              <div className="SectionTitle">
                <Activity
                  size={15}
                  color="var(--accent-primary)"
                />
                Weekly Engagement
              </div>

              <p
                style={{
                  fontSize: ".7rem",
                  color: "var(--text-secondary)",
                  marginBottom: ".6rem",
                }}
              >
                Last 7 days — likes, comments & shares
              </p>

              <div className="EngChart">
                {engagementBars.map((bar, index) => (
                  <div
                    key={index}
                    className={`EngBar ${bar}`}
                  />
                ))}
              </div>

              <div className="EngLabels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="TabBar">
              <button
                className={`Tab ${
                  activeTab === "Posts" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Posts")}
              >
                <Grid3X3 size={12} />
                Posts
              </button>

              <button
                className={`Tab ${
                  activeTab === "Reels" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Reels")}
              >
                <PlayCircle size={12} />
                Reels
              </button>

              <button
                className={`Tab ${
                  activeTab === "Tagged" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Tagged")}
              >
                <Tag size={12} />
                Tagged
              </button>
            </div>

            {/* Posts Grid */}
            {activeTab === "Posts" && (
              <div className="PostGrid">
                {posts.map((post, index) => (
                  <div className="PGItem" key={index}>
                    <img
                      src={post.image}
                      alt={`Post ${index + 1}`}
                    />

                    <div className="PGOverlay">
                      <span className="PGStat">
                        <Heart
                          size={12}
                          fill="#fff"
                        />
                        {post.likes}
                      </span>

                      <span className="PGStat">
                        <MessageCircle size={12} />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Reels" && (
              <div className="SideCard">
                <p className="BioText">
                  No reels available yet.
                </p>
              </div>
            )}

            {activeTab === "Tagged" && (
              <div className="SideCard">
                <p className="BioText">
                  No tagged posts available yet.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT PROFILE INFO */}
          <aside className="ProfileSidebar">
            {/* About */}
            <div className="SideCard">
              <div className="SectionTitle">
                <FileText
                  size={14}
                  color="var(--accent-primary)"
                />
                About
              </div>

              <p className="BioText">
                Lead <b>Product Designer</b> & Frontend Developer.
                <br />
                Building interfaces that feel alive — dark
                aesthetics, neon typography, clean grids.
                <br />
                <br />
                At <b>@NeonLabs</b> · Previously <b>@Figma</b>
              </p>

              <div className="BioLinks">
                <a href="#" className="BioLink">
                  <LinkIcon
                    size={12}
                    color="var(--accent-primary)"
                  />
                  sarah-connor.design
                </a>

                <a href="#" className="BioLink">
                  <MapPin
                    size={12}
                    color="var(--accent-primary)"
                  />
                  San Francisco, CA
                </a>

                <a href="#" className="BioLink">
                  <Calendar
                    size={12}
                    color="var(--accent-primary)"
                  />
                  Joined August 2022
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div className="SideCard">
              <div className="SectionTitle">
                <Circle
                  size={14}
                  color="var(--accent-primary)"
                />
                Highlights
              </div>

              <div className="Highlights">
                {highlights.map((highlight) => (
                  <div
                    className="Highlight"
                    key={highlight.label}
                  >
                    <div
                      className={`Highlight__ring ${
                        highlight.seen
                          ? "Highlight__ring--seen"
                          : ""
                      }`}
                    >
                      <div className="Highlight__inner">
                        <img
                          src={highlight.image}
                          alt={highlight.label}
                        />
                      </div>
                    </div>

                    <span className="Highlight__label">
                      {highlight.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mutual Connections */}
            <div className="SideCard">
              <div className="SectionTitle">
                <Users
                  size={14}
                  color="var(--accent-primary)"
                />
                Mutual Connections
              </div>

              <div className="MutualAvatars">
                {mutualAvatars.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Mutual connection ${index + 1}`}
                  />
                ))}

                <div className="MutualAvatars__more">
                  +84
                </div>
              </div>

              <p className="MutualText">
                Followed by{" "}
                <b style={{ color: "var(--text-primary)" }}>
                  sophia_c
                </b>
                ,{" "}
                <b style={{ color: "var(--text-primary)" }}>
                  marcus_v
                </b>{" "}
                and{" "}
                <b style={{ color: "var(--text-primary)" }}>
                  84 others
                </b>{" "}
                you follow.
              </p>
            </div>

            {/* Hashtags */}
            <div className="SideCard">
              <div className="SectionTitle">
                <Hash
                  size={14}
                  color="var(--accent-primary)"
                />
                Top Hashtags
              </div>

              <div className="Chips">
                <span
                  className="Chip"
                  style={{
                    background: "rgba(225,48,108,.12)",
                    color: "var(--accent-primary)",
                  }}
                >
                  #uiux
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(131,58,180,.12)",
                    color: "var(--text-muted)",
                  }}
                >
                  #darkmode
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(64,93,230,.12)",
                    color: "#405DE6",
                  }}
                >
                  #tokyo
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(247,119,55,.12)",
                    color: "var(--text-secondary)",
                  }}
                >
                  #wfh
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(16,185,129,.12)",
                    color: "var(--green-online)",
                  }}
                >
                  #code
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(225,48,108,.12)",
                    color: "var(--accent-primary)",
                  }}
                >
                  #figma
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(255,255,255,.06)",
                    color: "var(--text-secondary)",
                  }}
                >
                  #neon
                </span>

                <span
                  className="Chip"
                  style={{
                    background: "rgba(255,255,255,.06)",
                    color: "var(--text-secondary)",
                  }}
                >
                  #minimalist
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

type ActivityCardProps = {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
};

function ActivityCard({
  icon,
  iconClass,
  value,
  label,
}: ActivityCardProps) {
  return (
    <div className="ACard">
      <div className={`ACard__icon ${iconClass}`}>
        {icon}
      </div>

      <div className="ACard__value">{value}</div>

      <div className="ACard__label">{label}</div>
    </div>
  );
}