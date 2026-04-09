'use client';

import React, { useState } from 'react';

type Tab = 'configure' | 'activity';

interface Step {
  id: number;
  text: string;
  sub?: string;
  done?: boolean;
}

const configSteps: Step[] = [
  { id: 1, text: 'Every morning at 8am, check my calendar for today\'s meetings', sub: 'Google Calendar: Find Events', done: true },
  { id: 2, text: 'Identify meetings that have external participants (participants not from my organization)', done: true },
  { id: 3, text: 'Search the web for information about the person (LinkedIn profile, company background, recent activities)', done: true },
  { id: 4, text: 'Search the web for information about the person (LinkedIn profile, company background, recent activities)', done: true },
  { id: 5, text: 'Gather relevant details like their role, company and any recent activities' },
  { id: 6, text: 'Slack: Send Direct Message (📱) Send me a Slack message with a summary of each external participant including:', sub: '• Their name and company\n• Their role/title\n• Any relevant background information found\n• Which meeting they\'ll be attending' },
];

const tools = [
  { id: '1', name: 'Copilot', icon: '✦', color: '#ffffff' },
  { id: '2', name: 'Google Calendar', icon: '📅', color: '#dddddd' },
  { id: '3', name: 'Slack', icon: '💬', color: '#cccccc' },
  { id: '4', name: 'Web Search', icon: '🔍', color: '#bbbbbb' },
  { id: '5', name: 'Read Website', icon: '🌐', color: '#bbbbbb' },
  { id: '6', name: 'File Reader', icon: '📁', color: '#bbbbbb' },
];

const activityLog = [
  { id: '1', time: '8:00 AM', event: 'Workflow triggered', type: 'trigger', detail: 'Schedule: Every day at 8am' },
  { id: '2', time: '8:00 AM', event: 'Fetching calendar events', type: 'running', detail: 'Found 4 meetings with external participants' },
  { id: '3', time: '8:01 AM', event: 'Researching participants', type: 'running', detail: 'Processing participant data...' },
  { id: '4', time: '8:03 AM', event: 'Sending Slack summary', type: 'success', detail: 'Message delivered to #general' },
  { id: '5', time: 'Yesterday', event: 'Workflow completed', type: 'success', detail: 'All steps completed successfully' },
];

interface ConfigPanelProps {
  agentName: string;
}

export default function ConfigPanel({ agentName }: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('configure');
  const [editingTrigger, setEditingTrigger] = useState(false);

  return (
    <div
      className="glass-panel"
      style={{
        width: '420px',
        minWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderLeft: '1px solid var(--border-subtle)',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        borderRadius: '0 24px 24px 0',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          background: 'transparent',
          borderBottom: 'none',
        }}
      >
        {/* Agent name in breadcrumb */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>←</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {agentName}
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-input)',
            borderRadius: '10px',
            padding: '4px',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
          }}
        >
          {(['configure', 'activity'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                background: activeTab === tab ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'var(--transition-smooth)',
                boxShadow: activeTab === tab ? '0 4px 12px var(--accent-glow)' : 'none',
              }}
            >
              {tab === 'configure' ? '⚙️ Configure' : '⚡ Activity'}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {activeTab === 'configure' ? (
          <>
            {/* Trigger Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trigger</span>
                <button
                  onClick={() => setEditingTrigger(!editingTrigger)}
                  style={{
                    padding: '4px 10px',
                    background: 'transparent',
                    border: '1px solid var(--border-mid)',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-mid)'; }}
                >
                  ✏️ Edit trigger
                </button>
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '16px' }}>📅</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Schedule by Hunt AI: Every Day</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px rgba(16,185,129,0.7)',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            {/* Instructions Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Instructions to follow</span>
                <button
                  style={{
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid var(--border-mid)',
                    borderRadius: '6px',
                    color: 'var(--accent-light)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  ＋ Add tools
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {configSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className="animate-fade-in-up"
                    style={{
                      padding: '10px 14px',
                      background: step.done ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)',
                      border: '1px solid',
                      borderColor: step.done ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-subtle)',
                      borderRadius: '10px',
                      animationDelay: `${i * 0.05}s`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card-hover)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-mid)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = step.done ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'; (e.currentTarget as HTMLDivElement).style.borderColor = step.done ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-subtle)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: step.done ? '#444444' : 'rgba(255, 255, 255, 0.15)',
                          border: step.done ? 'none' : '1px solid var(--border-mid)',
                          color: step.done ? '#fff' : 'var(--text-muted)',
                          fontSize: '9px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        {step.done ? '✓' : step.id}
                      </span>
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.text}</p>
                        {step.sub && (
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                            {step.sub}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Connected Tools</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {tools.map(tool => (
                  <div
                    key={tool.id}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-light)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-card)'; }}
                  >
                    <span>{tool.icon}</span> {tool.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Activity Tab */
          <div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing last 24 hours of activity</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '20px',
                  bottom: '20px',
                  width: '1px',
                  background: 'linear-gradient(to bottom, var(--accent-primary), transparent)',
                  opacity: 0.3,
                }}
              />
              {activityLog.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: item.type === 'success' ? 'rgba(16,185,129,0.2)' : item.type === 'trigger' ? 'rgba(124,58,237,0.3)' : 'rgba(245,158,11,0.2)',
                      border: '2px solid',
                      borderColor: item.type === 'success' ? '#10b981' : item.type === 'trigger' ? 'var(--accent-primary)' : '#f59e0b',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                    }}
                  >
                    {item.type === 'success' ? '✓' : item.type === 'trigger' ? '⚡' : '⟳'}
                  </div>
                  <div style={{ flex: 1, paddingTop: '1px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.event}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Run Button */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px' }}>✦</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Copilot</span>
        </div>
        <button
          style={{
            padding: '10px 24px',
            background: 'var(--accent-gradient)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px var(--accent-glow)',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={e => { 
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 30px var(--accent-glow)'; 
          }}
          onMouseLeave={e => { 
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px var(--accent-glow)'; 
          }}
        >
          ▶ Agent preview
        </button>
      </div>
    </div>
  );
}