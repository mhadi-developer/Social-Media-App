'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Edit3,
  Search,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Paperclip,
  Smile,
  Send,
  X,
  Heart,
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [activeThreadMobile, setActiveThreadMobile] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    // Handle message submit logic here
    setMessageText('');
  };

  return (
    <>
      {/* SUB-COMPONENT: GLASS CHAT VIEW */}
      <div className="ChatView" id="chat-view">
        {/* Left Threads Pane */}
        <section
          className={`ThreadList ${activeThreadMobile ? 'mobile-hidden' : ''}`}
          id="thread-list-pane"
        >
          <div className="ThreadList__header">
            <div className="ThreadList__title-row">
              <h2 className="ThreadList__title">Messages</h2>
              <Edit3
                style={{
                  width: 18,
                  height: 18,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              />
            </div>
            <div className="ThreadList__search">
              <Search className="ThreadList__search-icon" />
              <input
                type="text"
                placeholder="Search chats..."
                className="ThreadList__search-input"
              />
            </div>
          </div>

          <div className="ThreadList__threads">
            {/* Thread 1 */}
            <div
              className="Thread active"
              onClick={() => setActiveThreadMobile(true)}
            >
              <div className="Thread__avatar-container">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                  alt="Sophia Chen"
                  width={40}
                  height={40}
                  className="Thread__avatar"
                />
                <span className="Thread__status-dot" />
              </div>
              <div className="Thread__info">
                <div className="Thread__name-row">
                  <span className="Thread__name">Sophia Chen</span>
                  <span className="Thread__time">12:32 PM</span>
                </div>
                <div className="Thread__message-row">
                  <span className="Thread__last-message">
                    Sounds good! Let's meet at 5pm.
                  </span>
                  <span className="Thread__unread-badge">2</span>
                </div>
              </div>
            </div>

            {/* Thread 2 */}
            <div
              className="Thread"
              onClick={() => setActiveThreadMobile(true)}
            >
              <div className="Thread__avatar-container">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                  alt="Marcus Vance"
                  width={40}
                  height={40}
                  className="Thread__avatar"
                />
                <span className="Thread__status-dot" />
              </div>
              <div className="Thread__info">
                <div className="Thread__name-row">
                  <span className="Thread__name">Marcus Vance</span>
                  <span className="Thread__time">10:15 AM</span>
                </div>
                <div className="Thread__message-row">
                  <span className="Thread__last-message">
                    Did you see the setup photos?
                  </span>
                </div>
              </div>
            </div>

            {/* Thread 3 */}
            <div className="Thread">
              <div className="Thread__avatar-container">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Alex Rivera"
                  width={40}
                  height={40}
                  className="Thread__avatar"
                />
              </div>
              <div className="Thread__info">
                <div className="Thread__name-row">
                  <span className="Thread__name">Alex Rivera</span>
                  <span className="Thread__time">Yesterday</span>
                </div>
                <div className="Thread__message-row">
                  <span className="Thread__last-message">
                    Can we schedule the design sync?
                  </span>
                  <span className="Thread__unread-badge">1</span>
                </div>
              </div>
            </div>

            {/* Thread 4 */}
            <div className="Thread">
              <div className="Thread__avatar-container">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80"
                  alt="Elena Rostova"
                  width={40}
                  height={40}
                  className="Thread__avatar"
                />
                <span className="Thread__status-dot" />
              </div>
              <div className="Thread__info">
                <div className="Thread__name-row">
                  <span className="Thread__name">Elena Rostova</span>
                  <span className="Thread__time">Yesterday</span>
                </div>
                <div className="Thread__message-row">
                  <span className="Thread__last-message">
                    Loved your post! So inspiring.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Message Stream */}
        <section
          className={`ChatPanel ${activeThreadMobile ? 'mobile-active' : ''}`}
          id="chat-panel-pane"
        >
          <div className="ChatPanel__header">
            <div className="ChatPanel__contact">
              <button
                type="button"
                onClick={() => setActiveThreadMobile(false)}
                className="ChatPanel__action-btn"
                id="mobile-back-btn"
                style={{
                  display: activeThreadMobile ? 'inline-flex' : 'none',
                  marginRight: '0.5rem',
                  padding: 4,
                }}
              >
                <ArrowLeft style={{ width: 18, height: 18 }} />
              </button>
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                alt="Sophia Chen"
                width={40}
                height={40}
                className="ChatPanel__contact-avatar"
              />
              <div className="ChatPanel__contact-meta">
                <span className="ChatPanel__contact-name">Sophia Chen</span>
                <span className="ChatPanel__contact-status">online</span>
              </div>
            </div>

            <div className="ChatPanel__actions">
              <button className="ChatPanel__action-btn">
                <Phone className="desktop-icon" />
              </button>
              <button className="ChatPanel__action-btn">
                <Video />
              </button>
              <button className="ChatPanel__action-btn">
                <Info />
              </button>
            </div>
          </div>

          <div className="MessageStream" id="message-stream">
            <div className="Message received">
              <div className="Message__bubble">
                Hey Sarah! Are we still on for the Tokyo design discussion? I have
                some mockups to show you.
              </div>
              <span className="Message__time">12:28 PM</span>
            </div>

            <div className="Message sent">
              <div className="Message__bubble">
                Hey Sophia! Yes, absolutely. I'm finishing up a few components
                right now. What time works for you?
              </div>
              <span className="Message__time">12:30 PM</span>
            </div>

            <div className="Message received">
              <div className="Message__bubble">
                Sounds good! Let's meet at 5pm. I'll book a room at the tech hub
                in Roppongi Hills or we can jump on a video room here.
              </div>
              <span className="Message__time">12:32 PM</span>
            </div>
          </div>

          <div className="ChatInput">
            <form className="ChatInput__form" onSubmit={handleSendMessage}>
              <button type="button" className="ChatInput__btn-attachment">
                <Paperclip />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="ChatInput__input"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="button" className="ChatInput__btn-attachment">
                <Smile />
              </button>
              <button type="submit" className="ChatInput__btn-send">
                <span>Send</span>
                <Send />
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* BENTO PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="ProfileModal" id="profile-modal">
          <div className="BentoProfile">
            <button
              type="button"
              className="BentoProfile__close"
              onClick={() => setIsProfileModalOpen(false)}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>

            {/* Bento dashboard grid */}
            <div className="BentoProfile__grid">
              {/* Identity Cell */}
              <div className="BentoCell BentoCell--identity">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Sarah Connor"
                  width={60}
                  height={60}
                  className="BentoCell__avatar"
                />
                <div className="BentoCell__identity-info">
                  <span className="BentoCell__name">Sarah Connor</span>
                  <span className="BentoCell__username">@sarah_c</span>
                </div>
              </div>

              {/* Stats Cell */}
              <div className="BentoCell BentoCell--stats">
                <div className="BentoCell__stat">
                  <span className="BentoCell__stat-num">142</span>
                  <span className="BentoCell__stat-label">Posts</span>
                </div>
                <div className="BentoCell__stat">
                  <span className="BentoCell__stat-num">12.8k</span>
                  <span className="BentoCell__stat-label">Followers</span>
                </div>
                <div className="BentoCell__stat">
                  <span className="BentoCell__stat-num">482</span>
                  <span className="BentoCell__stat-label">Following</span>
                </div>
              </div>

              {/* Bio Cell */}
              <div className="BentoCell BentoCell--bio">
                <p>
                  Lead Product Designer &amp; Frontend Developer. Building
                  interfaces that feel alive. Exploring dark aesthetics, neon
                  typography, and clean grids. Based in SF ☕️✨
                </p>
              </div>

              {/* Action Edit Cell */}
              <div className="BentoCell BentoCell--action">
                <button type="button" className="BentoCell__btn">
                  Edit Profile Dashboard
                </button>
              </div>
            </div>

            {/* Photo grid */}
            <div className="BentoProfile__gallery">
              {[
                { src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80', likes: '450' },
                { src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80', likes: '312' },
                { src: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80', likes: '682' },
                { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80', likes: '1.1k' },
                { src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80', likes: '580' },
                { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80', likes: '925' },
              ].map((item, idx) => (
                <div className="GalleryItem" key={idx}>
                  <Image
                    src={item.src}
                    alt=""
                    width={500}
                    height={500}
                    className="GalleryItem__img"
                  />
                  <div className="GalleryItem__overlay">
                    <Heart style={{ width: 14, height: 14, fill: 'white' }} />{' '}
                    {item.likes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      <div className="Toast" id="toast-notif">
        <Info style={{ color: 'var(--accent-primary)', width: 16, height: 16 }} />
        <span id="toast-text">Success! Action completed.</span>
      </div>
    </>
  );
};
