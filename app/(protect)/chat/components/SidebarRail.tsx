'use client';

import React, { useState } from 'react';
import { PanelLeft, Search, User, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface SidebarRailProps {
  onToggleMainSidebar: () => void;
  isMainSidebarOpen: boolean;
}

export default function SidebarRail({ onToggleMainSidebar, isMainSidebarOpen }: SidebarRailProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useUser();
  // Shared icon button style for a unified look
  const railButtonStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div 
      style={{
        width: 'var(--rail-width)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        zIndex: 60,
        gap: '20px',
        background: 'rgba(10, 10, 10, 0.4)', // Matches main sidebar glass
        backdropFilter: 'blur(20px)',
        top: '64px', // Align with main sidebar
        position: 'sticky',
      }}
    >
      {/* Top Toggle Button */}
      <button 
        onClick={onToggleMainSidebar}
        title={isMainSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        style={{
          ...railButtonStyle,
          color: isMainSidebarOpen ? '#fff' : 'var(--text-secondary)',
          background: isMainSidebarOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isMainSidebarOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent';
          e.currentTarget.style.color = isMainSidebarOpen ? '#fff' : 'var(--text-secondary)';
        }}
      >
        <PanelLeft size={22} strokeWidth={2} />
      </button>

      {/* Spacer for middle icons if you add them later */}
      <div style={{ flex: 1 }} />

      {/* Bottom Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '24px', 
        marginBottom: '20px', 
        paddingBottom: '10px' 
      }}>
                
        {/* Subtle Search/Action Icon */}
        {!isMainSidebarOpen && (
           <button 
             title="Search"
             style={{ 
               ...railButtonStyle, 
               opacity: 0.6,
               transition: 'all 0.2s ease'
             }}
             onMouseEnter={e => {
               e.currentTarget.style.opacity = '1';
               e.currentTarget.style.transform = 'scale(1.1)';
             }}
             onMouseLeave={e => {
               e.currentTarget.style.opacity = '0.6';
               e.currentTarget.style.transform = 'scale(1)';
             }}
           >
             <Search size={20} strokeWidth={2} />
           </button>
        )}
        
        {/* Profile Icon - Only visible when Rail is the primary interaction point */}
        {!isMainSidebarOpen && (
          <button 
            title="Profile"
            onClick={() => setShowProfile(true)}
            style={{
              ...railButtonStyle,
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px', 
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <User size={20} strokeWidth={2} />
          </button>
        )}
      </div>
      
      {/* Profile Modal */}
      {showProfile && user && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => setShowProfile(false)}
        >
          <div 
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              minWidth: '320px',
              maxWidth: '400px',
              marginLeft: '380px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: '600' }}>Profile</h3>
              <button
                onClick={() => setShowProfile(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '20px',
                fontWeight: '600',
              }}>
                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddresses[0]?.emailAddress}
                </div>
                {user.firstName && user.emailAddresses[0] && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {user.emailAddresses[0].emailAddress}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>User ID</span>
                <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Last Sign In</span>
                <span style={{ color: '#fff', fontSize: '14px' }}>
                  {new Date(user.lastSignInAt!).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}