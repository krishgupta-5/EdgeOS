'use client';

import React from 'react';

interface SidebarRailProps {
  onToggleMainSidebar: () => void;
  isMainSidebarOpen: boolean;
}

export default function SidebarRail({ onToggleMainSidebar, isMainSidebarOpen }: SidebarRailProps) {
  return (
    <div 
      style={{
        width: 'var(--rail-width)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0',
        zIndex: 50,
        gap: '20px',
        background: 'transparent',
        borderRight: '1px solid var(--border-subtle)',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        borderRadius: 0,
      }}
    >
      {/* Top Logo / Toggle */}
      <button 
        onClick={onToggleMainSidebar}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: isMainSidebarOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'var(--transition-smooth)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isMainSidebarOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent'; }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
      </button>

      {/* Action Icons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {/* Empty div to maintain spacing */}
      </div>

      {/* Bottom Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {/* Only show logout button when sidebar is closed */}
        {!isMainSidebarOpen && (
          <button 
            title="Log out"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--accent-primary)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}