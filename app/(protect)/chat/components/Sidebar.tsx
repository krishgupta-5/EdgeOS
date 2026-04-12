'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Settings, User, DollarSign, LogOut, MessageSquare } from 'lucide-react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { resetSessionId } from '@/app/api/generate/Sessionid';

interface SidebarProps {
  activeAgentId: string;
  onSelectAgent: (id: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ activeAgentId, onSelectAgent, isOpen }: SidebarProps) {
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

  // Shared styles for bottom navigation buttons
  const navButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    fontSize: '13.5px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    padding: '20px 12px 8px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <aside
      className="app-sidebar"
      style={{
        width: isOpen ? '260px' : '0px',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        background: 'rgba(10, 10, 10, 0.4)', // Subtle dark glass
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
      }}
    >
      {/* Action Header */}
      <div style={{ padding: '20px 16px 12px' }}>
        <button
          onClick={handleNewChat}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'transparent', // Removed background
            border: '1px solid rgba(255, 255, 255, 0.15)', // Added subtle outline
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
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
            <div style={sectionLabelStyle}>Recent Chats</div>
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
            style={navButtonStyle}
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
            style={navButtonStyle}
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
            ...navButtonStyle,
            marginTop: '8px',
            color: 'var(--text-secondary)',
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
              ...navButtonStyle,
              color: 'var(--text-muted)',
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
        marginBottom: '2px',
        background: active ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontSize: '13px',
        textAlign: 'left',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
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