import React from 'react';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import { Sidebar } from '@/components/SideBar';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';

export const metadata = {
  title: 'Conflux - Social Chat App',
  description: 'Conflux: Bento Glass Hybrid Social Chat Interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Ambient background for all pages */}
        <div className="AmbientBackground">
          <div className="AmbientBackground__blob AmbientBackground__blob--1" />
          <div className="AmbientBackground__blob AmbientBackground__blob--2" />
        </div>

        {/* Mobile Header for all pages */}
        <header className="MobileHeader">
          <div className="Sidebar__logo-container" style={{ display: 'flex', marginBottom: 0 }}>
            <div className="Sidebar__logo-icon" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
              <Zap style={{ width: '16px', height: '16px' }} className="desktop-icon" />
            </div>
            <span className="Sidebar__logo-text" style={{ fontSize: '1.1rem' }}>
              Conflux
            </span>
          </div>

          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Avatar"
              width={30}
              height={30}
              className="Sidebar__profile-avatar"
              style={{ width: '30px', height: '30px' }}
            />
          </div>
        </header>

        {/* Main App Layout Grid */}
        <div className="AppContainer">
           <AuthProvider>
          <Sidebar />
            <main className="CenterCanvas">{children}</main>
            </AuthProvider>
        </div>
      </body>
    </html>
  );
}