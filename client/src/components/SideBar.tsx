import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Zap,
  Home,
  MessageSquare,
  Phone,
  Users,
  PlusCircle,
  User,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
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
          <Link href="/" className="Sidebar__nav-item" id="nav-home">
            <div className="Sidebar__nav-item-left">
              <Home className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Home</span>
            </div>
          </Link>
          <Link href="/chat" className="Sidebar__nav-item" id="nav-chats">
            <div className="Sidebar__nav-item-left">
              <MessageSquare className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Explore/Chats</span>
            </div>
            <span className="Sidebar__nav-badge">4</span>
          </Link>
          <Link href="/calls" className="Sidebar__nav-item" id="nav-calls">
            <div className="Sidebar__nav-item-left">
              <Phone className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Calls</span>
            </div>
          </Link>
          <Link href="/requests" className="Sidebar__nav-item" id="nav-requests">
            <div className="Sidebar__nav-item-left">
              <Users className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Requests</span>
            </div>
            <span
              className="Sidebar__nav-badge"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              2
            </span>
          </Link>
          <Link href="/create" className="Sidebar__nav-item" id="nav-create-post">
            <div className="Sidebar__nav-item-left">
              <PlusCircle className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Create Post</span>
            </div>
          </Link>
          <Link href="/profile" className="Sidebar__nav-item" id="nav-profile">
            <div className="Sidebar__nav-item-left">
              <User className="desktop-icon" />
              <span className="Sidebar__nav-item-text">Profile</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* User Card */}
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
            <span className="Sidebar__profile-name">Sarah Connor</span>
            <span className="Sidebar__profile-username">@sarah_c</span>
          </div>
        </div>
        <ChevronRight />
      </div>
    </aside>
  );
};