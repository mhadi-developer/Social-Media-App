"use client"
import React from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  X,
  Info,
} from 'lucide-react';
import { useAuth } from "@/context/AuthProvider";

export const HomePage: React.FC = () => {
  const { user , loading} = useAuth();
  console.log(user)
  
  return (
    <>
      <div className="FeedView" id="feed-view">
        <div className="FeedView__header">
          <h1 className="FeedView__title"> Hello {
                user?.firstName 
            }</h1>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              padding: '0.2rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <span
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              className="Sidebar__nav-item-text"
            >
              Featured
            </span>
            <span
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'var(--bg-card-hover)',
              }}
              className="Sidebar__nav-item-text"
            >
              Latest
            </span>
          </div>
        </div>

        {/* Bento Post 1 */}
        <article className="BentoPost">
          <div className="BentoPost__media-pane">
            <div className="BentoPost__author-badge">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                alt="Sophia Chen"
                width={32}
                height={32}
                className="BentoPost__author-avatar"
              />
              <span className="BentoPost__author-name">Sophia Chen</span>
            </div>

            <Image
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
              alt="Synthwave aesthetic"
              width={800}
              height={600}
              className="BentoPost__image"
            />
            <Heart
              className="BentoPost__doubletap-heart"
              style={{ fill: 'white', color: 'white' }}
            />

            <div className="BentoPost__media-actions">
              <div className="BentoPost__media-actions-left">
                <button className="BentoPost__action-btn bento-post__heart">
                  <Heart />
                </button>
                <button className="BentoPost__action-btn">
                  <MessageCircle />
                </button>
                <button className="BentoPost__action-btn">
                  <Send />
                </button>
              </div>
              <button className="BentoPost__action-btn">
                <Bookmark />
              </button>
            </div>
          </div>

          <div className="BentoPost__details-pane">
            <div className="BentoPost__details-header">
              <div className="BentoPost__likes">
                <span className="likes-count">1,248</span> likes
              </div>
              <p className="BentoPost__caption">
                <b>sophia_c</b> Chasing neon dreams in the heart of Tokyo. This city never sleeps! 🌌📸 #tokyo #neon #cyberpunk
              </p>
            </div>

            <div className="BentoPost__comments-stream">
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">marcus_v</span>this grading is clean!
                </div>
              </div>
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">elena_r</span>Roppongi? Let&apos;s sync!
                </div>
              </div>
            </div>

            <div className="BentoPost__inputbar">
              <input
                type="text"
                placeholder="Add a comment..."
                className="BentoPost__input"
              />
              <button className="BentoPost__submit">Post</button>
            </div>
          </div>
        </article>

          <article className="BentoPost">
          <div className="BentoPost__media-pane">
            <div className="BentoPost__author-badge">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                alt="Sophia Chen"
                width={32}
                height={32}
                className="BentoPost__author-avatar"
              />
              <span className="BentoPost__author-name">Sophia Chen</span>
            </div>

            <Image
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
              alt="Synthwave aesthetic"
              width={800}
              height={600}
              className="BentoPost__image"
            />
            <Heart
              className="BentoPost__doubletap-heart"
              style={{ fill: 'white', color: 'white' }}
            />

            <div className="BentoPost__media-actions">
              <div className="BentoPost__media-actions-left">
                <button className="BentoPost__action-btn bento-post__heart">
                  <Heart />
                </button>
                <button className="BentoPost__action-btn">
                  <MessageCircle />
                </button>
                <button className="BentoPost__action-btn">
                  <Send />
                </button>
              </div>
              <button className="BentoPost__action-btn">
                <Bookmark />
              </button>
            </div>
          </div>

          <div className="BentoPost__details-pane">
            <div className="BentoPost__details-header">
              <div className="BentoPost__likes">
                <span className="likes-count">1,248</span> likes
              </div>
              <p className="BentoPost__caption">
                <b>sophia_c</b> Chasing neon dreams in the heart of Tokyo. This city never sleeps! 🌌📸 #tokyo #neon #cyberpunk
              </p>
            </div>

            <div className="BentoPost__comments-stream">
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">marcus_v</span>this grading is clean!
                </div>
              </div>
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">elena_r</span>Roppongi? Let&apos;s sync!
                </div>
              </div>
            </div>

            <div className="BentoPost__inputbar">
              <input
                type="text"
                placeholder="Add a comment..."
                className="BentoPost__input"
              />
              <button className="BentoPost__submit">Post</button>
            </div>
          </div>
        </article>


          <article className="BentoPost">
          <div className="BentoPost__media-pane">
            <div className="BentoPost__author-badge">
              <Image
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                alt="Sophia Chen"
                width={32}
                height={32}
                className="BentoPost__author-avatar"
              />
              <span className="BentoPost__author-name">Sophia Chen</span>
            </div>

            <Image
              src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
              alt="Synthwave aesthetic"
              width={800}
              height={600}
              className="BentoPost__image"
            />
            <Heart
              className="BentoPost__doubletap-heart"
              style={{ fill: 'white', color: 'white' }}
            />

            <div className="BentoPost__media-actions">
              <div className="BentoPost__media-actions-left">
                <button className="BentoPost__action-btn bento-post__heart">
                  <Heart />
                </button>
                <button className="BentoPost__action-btn">
                  <MessageCircle />
                </button>
                <button className="BentoPost__action-btn">
                  <Send />
                </button>
              </div>
              <button className="BentoPost__action-btn">
                <Bookmark />
              </button>
            </div>
          </div>

          <div className="BentoPost__details-pane">
            <div className="BentoPost__details-header">
              <div className="BentoPost__likes">
                <span className="likes-count">1,248</span> likes
              </div>
              <p className="BentoPost__caption">
                <b>sophia_c</b> Chasing neon dreams in the heart of Tokyo. This city never sleeps! 🌌📸 #tokyo #neon #cyberpunk
              </p>
            </div>

            <div className="BentoPost__comments-stream">
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">marcus_v</span>this grading is clean!
                </div>
              </div>
              <div className="BentoPost__comment">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80"
                  alt=""
                  width={28}
                  height={28}
                  className="BentoPost__comment-avatar"
                />
                <div className="BentoPost__comment-content">
                  <span className="BentoPost__comment-author">elena_r</span>Roppongi? Let&apos;s sync!
                </div>
              </div>
            </div>

            <div className="BentoPost__inputbar">
              <input
                type="text"
                placeholder="Add a comment..."
                className="BentoPost__input"
              />
              <button className="BentoPost__submit">Post</button>
            </div>
          </div>
        </article>
      </div>

      {/* Profile Modal */}
      <div className="ProfileModal" id="profile-modal">
        <div className="BentoProfile">
          <button className="BentoProfile__close" id="close-modal">
            <X style={{ width: '14px', height: '14px' }} />
          </button>
          <div className="BentoProfile__grid">
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
            <div className="BentoCell BentoCell--bio">
              <p>
                Lead Product Designer &amp; Frontend Developer. Building interfaces that feel alive. Based in SF ☕️✨
              </p>
            </div>
            <div className="BentoCell BentoCell--action">
              <button className="BentoCell__btn" id="edit-profile-btn">
                Edit Profile Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className="Toast" id="toast-notif">
        <Info style={{ color: 'var(--accent-primary)', width: '16px', height: '16px' }} />
        <span id="toast-text">Success! Action completed.</span>
      </div>
    </>
  );
};

export default HomePage;