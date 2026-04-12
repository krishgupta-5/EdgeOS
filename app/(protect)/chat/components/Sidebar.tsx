'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Settings, User, DollarSign, LogOut, MessageSquare, PanelLeft, Edit, Search, LogIn } from 'lucide-react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { resetSessionId } from '@/app/api/generate/Sessionid';

interface SidebarProps {
  activeAgentId?: string;
  onSelectAgent?: (id: string) => void;
  isOpen: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ activeAgentId, onSelectAgent, isOpen, onToggle }: SidebarProps) {
  const { user } = useUser();
  const [userSessions, setUserSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress ?? 'Account';

  useEffect(() => {
    if (isOpen && user) {
      fetchUserSessions();
    }
  }, [isOpen, user]);

  const fetchUserSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setUserSessions(data.sessions || []);
      } else {
        console.error('Failed to fetch sessions:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    // Generate new session ID and navigate to it
    const newSessionId = resetSessionId();
    window.location.href = `/chat/${newSessionId}`;
  };
  return (
    <aside
      className="app-sidebar"
      style={{
        width: isOpen ? '260px' : '0px',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        background: '#000000',
        borderRight: '1px solid #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        fontFamily: '"Geist", sans-serif', // Default to Geist for lists
        zIndex: 50,
      }}
    >
      {/* Top Header */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '16px 20px',
          borderBottom: '1px solid #1A1A1A' 
        }}
      >
        <button onClick={onToggle} 
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0, display: 'flex', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#EAEAEA'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <PanelLeft size={16} strokeWidth={2} />
        </button>
        
        <div style={{ 
          color: '#EAEAEA', 
          fontSize: '12px', 
          fontWeight: 600, 
          letterSpacing: '1px', 
          fontFamily: '"Geist Mono", monospace' 
        }}>
          EDGE-OS.CHAT
        </div>
        
        <button onClick={onToggle} 
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 0, display: 'flex', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#EAEAEA'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <Edit size={16} strokeWidth={2} />
        </button>
      </div>

      {/* New Session Button Area */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1A1A1A' }}>
        <button
          onClick={handleNewChat}
          style={{
            width: '100%',
            padding: '12px 0',
            background: '#000000',
            border: '1px solid #222',
            borderRadius: '2px', // Sharp minimal corners
            color: '#EAEAEA', 
            fontSize: '11px',
            fontFamily: '"Geist Mono", monospace',
            fontWeight: 600,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#EAEAEA';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.borderColor = '#EAEAEA';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#000000';
            e.currentTarget.style.color = '#EAEAEA';
            e.currentTarget.style.borderColor = '#222';
          }}
        >
          [ NEW SESSION ]
        </button>
      </div>

      {/* Search Input */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A1A1A' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: '#666',
            background: '#0A0A0A',
            border: '1px solid #222',
            padding: '8px 12px',
            borderRadius: '2px'
          }}
        >
          <Search size={14} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search logs..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#EAEAEA',
              fontSize: '12px',
              width: '100%',
              fontFamily: '"Geist Mono", monospace',
            }}
            onFocus={e => e.currentTarget.style.outline = 'none'}
          />
        </div>
      </div>

      {/* Threads List Area (Scrollable state) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
        <div style={{ 
          fontSize: '10px', 
          color: '#666', 
          fontFamily: '"Geist Mono", monospace', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          marginBottom: '12px',
          paddingLeft: '8px' 
        }}>
          Recent Activity
        </div>
        
        {/* Render HistoryItem components here when you have data */}
        {/* <HistoryItem title="Auth Flow Implementation" active /> */}
        {/* <HistoryItem title="Database Schema Refactor" /> */}
      </div>

      {/* Bottom Login Area */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1A1A1A', background: '#000' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: '"Geist Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            padding: 0
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#EAEAEA'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <Plus size={18} strokeWidth={2} />
          New Chat
        </button>
      </div>

      {/* Scrollable History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading history...
          </div>
        ) : userSessions.length > 0 ? (
          <>
            <div style={{ fontSize: '10px', color: '#666', fontFamily: '"Geist Mono", monospace', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '8px' }}>Recent Chats</div>
            {userSessions.map((session) => (
              <HistoryItem
                key={session.sessionId}
                sessionId={session.sessionId}
                title={session.lastMessage || `Chat with ${session.messageCount} messages`}
                timestamp={session.updatedAt}
              />
            ))}
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <div style={{ fontSize: '13px' }}>No chat history yet</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>Start a new conversation to see it here</div>
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div style={{ 
        padding: '12px', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px' 
      }}>
        <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"Geist Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              padding: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
        >
          <DollarSign size={18} strokeWidth={2} />
          Plans & Pricing
        </button>
        
        <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"Geist Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              padding: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
        >
          <Settings size={18} strokeWidth={2} />
          Settings
        </button>

        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: '"Geist Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            padding: 0,
            marginTop: '8px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <User size={18} strokeWidth={2} />
          {displayName}
        </button>

        <SignOutButton>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"Geist Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              padding: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,60,60,0.08)';
              e.currentTarget.style.color = '#ff6b6b';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={18} strokeWidth={2} />
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}

// Sub-component for history items to keep code clean
function HistoryItem({ 
  sessionId, 
  title, 
  timestamp, 
  active = false 
}: { 
  sessionId: string; 
  title: string; 
  timestamp: Date | string; 
  active?: boolean 
}) {
  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return dateObj.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  return (
    <button
      style={{
        width: '100%',
        padding: '10px 12px',
        marginBottom: '4px',
        background: active ? '#0A0A0A' : 'transparent',
        border: '1px solid',
        borderColor: active ? '#222' : 'transparent',
        borderRadius: '2px',
        color: active ? '#EAEAEA' : '#888',
        fontSize: '13px',
        fontFamily: '"Geist", sans-serif',
        textAlign: 'left',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = '#0A0A0A';
          e.currentTarget.style.color = '#EAEAEA';
          e.currentTarget.style.borderColor = '#1A1A1A';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#888';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
      onClick={() => {
        // Navigate to session URL
        window.location.href = `/chat/${sessionId}`;
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div>{truncateText(title)}</div>
        <div style={{ fontSize: '11px', opacity: 0.7 }}>
          {formatDate(timestamp)}
        </div>
      </div>
    </button>
  );
}
