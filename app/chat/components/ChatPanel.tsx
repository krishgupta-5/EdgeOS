'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tools?: string[];
  file?: {
    name: string;
    language: string;
    content: string;
  };
  options?: string[];
}

const initialMessages: Message[] = [];

interface ChatPanelProps {
  agentName: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function ChatPanel({ agentName, onToggleSidebar, isSidebarOpen = true }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [markdownMode, setMarkdownMode] = useState<Record<string, 'code' | 'preview'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentStepRef = useRef<'config' | 'docker' | 'md' | 'db' | 'pipeline' | 'done'>('config');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideInput) setInput('');
    setIsTyping(true);

    if (textareaRef.current && !overrideInput) {
      textareaRef.current.style.height = '44px';
    }

    // Simulate AI response
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase();
      const isContinue = lowerText.includes('continue') || lowerText.includes('generation');
      const isImprove = lowerText.includes('improve');

      const yamlContent = `# Pipeline initialization
name: "External Meeting Prep"
version: 1.2
active: true
schedule:
  time: "08:00"
  timezone: "EST"
  days:
    - "Monday"
    - "Wednesday"
notifications:
  slack:
    enabled: true
    channel: "#meeting-prep"
    send_to_self: false`;

      const dockerContent = `version: "3.8"

services:
  inference:
    image: "ultralytics/ultralytics:latest-jetson"
    restart: "always"
    ports:
      - "8080:8080"
    environment:
      - "ENV=production"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: "30s"
      timeout: "10s"
      retries: 3
    deploy:
      resources:
        reservations:
          devices:
            - driver: "nvidia"
              count: 1
              capabilities: ["gpu"]
    networks:
      - "edge-net"

  rtsp-server:
    image: "aler9/rtsp-simple-server:latest"
    restart: "always"
    ports:
      - "8554:8554"
    environment:
      - "RTSP_PROTOCOLS=tcp"
    networks:
      - "edge-net"

  mqtt-broker:
    image: "eclipse-mosquitto:2"
    restart: "always"
    ports:
      - "1883:1883"
    environment:
      - "MQTT_ALLOW_ANONYMOUS=true"
    networks:
      - "edge-net"

  database:
    image: "postgres:15-alpine"
    restart: "always"
    ports:
      - "5432:5432"
    environment:
      - "POSTGRES_DB=edgeai"
      - "POSTGRES_USER=admin"
      - "POSTGRES_PASSWORD=secret"
    volumes:
      - "db-data:/var/lib/postgresql/data"
    networks:
      - "edge-net"

networks:
  edge-net:
    driver: "host"

volumes:
  db-data:`;

      const markdownContent = `# Edge AI Deployment Details

## Overview
This configuration initializes the intelligent inference pipeline utilizing the ultralytics/ultralytics-jetson container suite.

## Services Installed
- inference: GPU-accelerated vision processing logic.
- rtsp-server: Handles the distribution of high-bandwidth video streams.
- mqtt-broker: High frequency lightweight message passing.
- database: Persistent PostgreSQL storage.

## Next Steps
1. Review the generated configuration settings.
2. Ensure you have the NVIDIA Container Toolkit properly installed.
3. Apply the settings by running \`docker-compose up -d\` in your terminal.
`;

      const pipelineNodesData = [
        { id: "ingest-video", type: "INPUT", title: "Ingest Camera Feed", color: "#cccccc", icon: "video" },
        { id: "preprocess-frames", type: "PROCESS", title: "Preprocess Video Frames", color: "#bbbbbb", icon: "refresh" },
        { id: "detect-persons", type: "INFERENCE", title: "Detect Persons", color: "#eeeeee", icon: "target", sub: "person-detector-yolo" },
        { id: "track-and-count", type: "PROCESS", title: "Track and Count Footfall", color: "#bbbbbb", icon: "refresh" },
        { id: "store-footfall-data", type: "STORE", title: "Store Footfall Data", color: "#999999", icon: "database" },
        { id: "notify-dashboard", type: "NOTIFY", title: "Notify Real-time Dashboard", color: "#dddddd", icon: "bell" }
      ];
      const pipelineContent = JSON.stringify(pipelineNodesData);

      let aiMsg: Message;

      if (isContinue) {
        if (currentStepRef.current === 'config') {
          currentStepRef.current = 'docker';
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Excellent! I've generated the infrastructure setup based on your requirements. Here is the `docker-compose.yaml` to deploy your edge AI services.\n\nWould you like me to continue the generation of files (such as a detailed markdown documentation file), or would you like to improve this Docker deployment more?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'docker-compose.yaml', language: 'yaml', content: dockerContent },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'docker') {
          currentStepRef.current = 'md';
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Perfect! I have compiled the final project documentation for your repository. Here is your `.md` overview file. \n\nWould you like me to continue the generation of files (such as a database structural diagram), or improve this documentation further?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'PROJECT_OVERVIEW.md', language: 'markdown', content: markdownContent },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'md') {
          currentStepRef.current = 'db';
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I have also generated the database structural diagram based on the backend components we discussed. Here is the Database Design graph:\n\nWould you like me to continue the generation of files (such as an execution pipeline flow chart), or iterate on this database design further?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'db_design.png', language: 'image', content: '/db-design.png' },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'db') {
          currentStepRef.current = 'pipeline';
          aiMsg = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Excellent. I have drafted the system's execution pipeline logic. Here is the visual architectural flow diagram. All files have been successfully generated for this workflow!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'pipeline.yaml', language: 'pipeline', content: pipelineContent }
          };
        } else {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "All files have been successfully generated for this workflow! If you need anything else, just let me know.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      } else if (isImprove) {
        if (currentStepRef.current === 'config') {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "I'd be happy to refine this further! What specific areas would you like to improve? For example, we can adjust the scheduling patterns, add more robust notification conditions, or add a fallback database.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'config.yaml', language: 'yaml', content: yamlContent },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'docker') {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "Absolutely. Let's refine the infrastructure deployment. Do you need additional volume mounts, custom internal networks, or extra environment variables mapped?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'docker-compose.yaml', language: 'yaml', content: dockerContent },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'md') {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "Is there anything specific you would like me to rewrite or add in the documentation?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'PROJECT_OVERVIEW.md', language: 'markdown', content: markdownContent },
            options: ['Continue generation of files', 'Improve more']
          };
        } else if (currentStepRef.current === 'db') {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "What specific relationships, tables, or fields would you like to adjust in the Database Design?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'db_design.png', language: 'image', content: '/db-design.png' },
            options: ['Continue generation of files', 'Improve more']
          };
        } else {
          aiMsg = {
            id: (Date.now() + 1).toString(), role: 'assistant',
            content: "Here is the refined execution pipeline. Let me know if you need any additional adjustments.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: { name: 'pipeline.yaml', language: 'pipeline', content: pipelineContent }
          };
        }
      } else {
        // Default: Initial generation + prompt for choice
        currentStepRef.current = 'config';
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Got it! I'll update the workflow configuration. The Slack notification settings have been saved successfully.\n\nWould you like me to continue the generation of files (such as the docker-compose deployment file) for this environment, or would you like to improve these configurations more?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          file: { name: 'config.yaml', language: 'yaml', content: yamlContent },
          options: ['Continue generation of files', 'Improve more']
        };
      }

      setMessages(prev => [...prev, aiMsg]);

      setIsTyping(false);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = '44px';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const renderInputArea = () => (
    <div
      className="glass-panel"
      style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        transition: 'var(--transition-smooth)',
      }}
      onFocus={e => { 
        e.currentTarget.style.borderColor = 'var(--accent-light)'; 
        e.currentTarget.style.boxShadow = '0 0 25px var(--accent-glow)'; 
      }}
      onBlur={e => { 
        e.currentTarget.style.borderColor = 'var(--border-subtle)'; 
        e.currentTarget.style.boxShadow = 'var(--shadow-premium)'; 
      }}
    >
      <button
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          marginBottom: '6px',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-light)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          (e.currentTarget as HTMLButtonElement).style.background = 'none';
        }}
        title="Upload file (Coming soon)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything"
        rows={1}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          resize: 'none',
          lineHeight: '1.5',
          height: '44px',
          maxHeight: '140px',
          overflowY: 'auto',
          paddingTop: '11px',
        }}
      />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingBottom: '6px' }}>
        {/* Voice Microphone Icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>

        {/* Headphone/Waveform Icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5v14M7 5v14M2 10v4M22 10v4M14.5 7.5v9M9.5 7.5v9" />
          </svg>
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: input.trim() ? '#fff' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: input.trim() ? '#000' : 'rgba(255, 255, 255, 0.3)',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="app-chat"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        overflow: 'hidden',
        minWidth: 0,
        position: 'relative',
      }}
    >
      {/* Low opacity subtle background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.015, /* Extremely low opacity */
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Chat Header */}
      <div
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'transparent',
          flexShrink: 0,
          borderBottom: 'none',
          zIndex: 10,
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <button 
            style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: 'var(--text-primary)', 
              display: 'flex', 
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'var(--transition-smooth)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            Edge-OS
          </button>
        </div>



        {/* Right Side Icons */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Share
          </button>

          <button 
            style={{
              padding: '8px 16px',
              background: 'var(--accent-primary)',
              color: '#000',
              border: 'none',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Log in
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 5, padding: '0 20px', width: '100%' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em', opacity: 0.9 }}>
            Ready when you are.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px', fontWeight: 400 }}>
            What can I help you with?
          </p>

          <div style={{ width: '100%', maxWidth: '750px', position: 'relative' }}>
            {renderInputArea()}

            {/* Quick Action Chips */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Design analysis</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Review component structure</div>
                </div>
              </button>

              <button
                className="glass-panel" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Select materials</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Generate tech stack</div>
                </div>
              </button>

              <button 
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.03)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Calculation of cost</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimate compute needs</div>
                </div>
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '24px' }}>
              By messaging Edge-OS, an AI chatbot, you agree to our Terms and have read our Privacy Policy.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: 5,
            }}
          >
            <div
              style={{
                maxWidth: '850px',
                width: '100%',
                margin: '0 auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                flex: 1,
              }}
            >

            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className="animate-fade-in-up"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                {msg.tools && (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {msg.tools.map(tool => (
                      <span
                        key={tool}
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          color: 'var(--accent-light)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '20px',
                          padding: '2px 8px',
                        }}
                      >
                        🔧 {tool}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="glass-panel"
                  style={{
                    maxWidth: '88%',
                    padding: '12px 15px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                    background: msg.role === 'user' ? 'rgba(255, 255, 255, 0.1)' : undefined,
                    borderColor: msg.role === 'user' ? 'var(--accent-light)' : undefined,
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    lineHeight: '1.65',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}

                  {/* YAML File Rendering */}
                  {msg.file && (
                    <div
                      className="glass-panel"
                      style={{
                        marginTop: '16px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        padding: '8px 14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e1e1e9', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
                            {msg.file.name}
                          </span>
                          {msg.file.language === 'markdown' && (
                            <div style={{ display: 'flex', gap: '4px', marginLeft: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '3px' }}>
                              <button
                                onClick={() => setMarkdownMode(prev => ({ ...prev, [msg.id]: 'code' }))}
                                style={{
                                  background: markdownMode[msg.id] === 'code' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                  border: markdownMode[msg.id] === 'code' ? '1px solid rgba(255, 255, 255, 0.20)' : '1px solid transparent',
                                  color: markdownMode[msg.id] === 'code' ? '#fff' : 'var(--text-muted)',
                                  fontSize: '11px', padding: '3px 10px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600
                                }}
                              >Code</button>
                              <button
                                onClick={() => setMarkdownMode(prev => ({ ...prev, [msg.id]: 'preview' }))}
                                style={{
                                  background: markdownMode[msg.id] !== 'code' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                  border: markdownMode[msg.id] !== 'code' ? '1px solid rgba(255, 255, 255, 0.20)' : '1px solid transparent',
                                  color: markdownMode[msg.id] !== 'code' ? '#fff' : 'var(--text-muted)',
                                  fontSize: '11px', padding: '3px 10px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600
                                }}
                              >Preview</button>
                            </div>
                          )}
                        </div>
                        {msg.file.language !== 'image' && msg.file.language !== 'pipeline' && (
                          <button
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#fff',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              cursor: 'pointer',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              transition: 'all 0.2s',
                              fontWeight: 600,
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                            }}
                            onClick={() => navigator.clipboard.writeText(msg.file!.content)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy code
                          </button>
                        )}
                      </div>
                      <div style={{ padding: msg.file.language === 'pipeline' ? '24px' : '16px', overflowX: 'auto', background: '#111111' }}>
                        {msg.file.language === 'image' ? (
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={msg.file.content} alt={msg.file.name} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                          </div>
                        ) : msg.file.language === 'pipeline' ? (
                          <div style={{ fontFamily: 'Inter, sans-serif' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                              <div style={{ padding: '10px 16px', border: '1px solid rgba(124, 58, 237, 0.4)', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '9px', color: '#a78bfa', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '4px' }}>PIPELINE</div>
                                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>retail-footfall-tracking</div>
                              </div>
                              <div style={{ padding: '10px 16px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '9px', color: '#34d399', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '4px' }}>TRIGGER</div>
                                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>continuous</div>
                              </div>
                              <div style={{ padding: '10px 16px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '4px' }}>VERSION</div>
                                <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>1.0.0</div>
                              </div>
                            </div>

                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }}></div>
                              DATA FLOW
                              <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }}></div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
                              {(msg.file.content.includes('[') ? JSON.parse(msg.file.content) : []).map((node: any, index: number, arr: any[]) => (
                                <React.Fragment key={node.id}>
                                  <div style={{
                                    padding: '16px 20px',
                                    border: '1px solid ' + node.color + '60',
                                    borderRadius: '12px',
                                    background: node.color + '08',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    minWidth: '260px',
                                    position: 'relative',
                                    boxShadow: `0 0 20px -10px ${node.color}40`,
                                    transition: 'transform 0.2s',
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = node.color + '12'; }}
                                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = node.color + '08'; }}
                                  >
                                    <div style={{ 
                                      width: '36px', 
                                      height: '36px', 
                                      borderRadius: '10px', 
                                      background: node.color + '20', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      color: node.color
                                    }}>
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        {node.icon === 'video' && <><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></>}
                                        {node.icon === 'refresh' && <><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></>}
                                        {node.icon === 'target' && <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></>}
                                        {node.icon === 'database' && <><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></>}
                                        {node.icon === 'bell' && <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></>}
                                      </svg>
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '10px', color: node.color, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.9 }}>
                                        {node.id} <span style={{ opacity: 0.5, marginLeft: '6px' }}>• {node.type}</span>
                                      </div>
                                      <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>
                                        {node.title}
                                      </div>
                                      {node.sub && (
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{node.sub}</div>
                                      )}
                                    </div>
                                  </div>
                                  {index < arr.length - 1 && (
                                    <div style={{ color: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center' }}>
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                      </svg>
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            <div style={{ padding: '14px 16px', background: '#050505', border: '1px solid #1f2937', borderRadius: '6px', fontFamily: '"Fira Code", monospace', fontSize: '12px', color: '#9ca3af' }}>
                              <span style={{ color: '#6b7280' }}>flow: </span>
                              {(msg.file.content.includes('[') ? JSON.parse(msg.file.content) : []).map((n: any) => n.id).join(' -> ')}
                            </div>
                          </div>
                        ) : (
                          <pre style={{ margin: 0, fontSize: '13px', fontFamily: '"Fira Code", monospace', lineHeight: '1.6', whiteSpace: msg.file.language === 'markdown' && markdownMode[msg.id] !== 'code' ? 'pre-wrap' : 'pre' }}>
                            {msg.file.language === 'markdown' ? (
                              markdownMode[msg.id] === 'code' ? (
                                // Raw code mode
                                msg.file.content.split('\n').map((line, i) => (
                                  <div key={i} style={{ color: '#e1e1e9', minHeight: '19px' }}>{line}</div>
                                ))
                              ) : (
                                // Preview mode
                                msg.file.content.split('\n').map((line, i) => {
                                  const tLine = line.trim();
                                  if (tLine.startsWith('# ')) return <div key={i} style={{ color: '#ffffff', fontSize: '1.4em', fontWeight: 'bold', marginTop: '14px', marginBottom: '8px' }}>{tLine.substring(2)}</div>;
                                  if (tLine.startsWith('## ')) return <div key={i} style={{ color: '#a5d6ff', fontSize: '1.15em', fontWeight: 'bold', marginTop: '12px', marginBottom: '6px' }}>{tLine.substring(3)}</div>;
                                  if (tLine.startsWith('- ')) return <div key={i} style={{ color: '#e1e1e9', marginLeft: '14px', marginBottom: '4px' }}><span style={{ color: '#ffffff', marginRight: '6px' }}>•</span>{tLine.substring(2)}</div>;
                                  if (tLine.startsWith('1.') || tLine.startsWith('2.') || tLine.startsWith('3.')) return <div key={i} style={{ color: '#e1e1e9', marginLeft: '14px', marginBottom: '4px' }}><span style={{ color: '#ffffff', marginRight: '6px', fontWeight: 'bold' }}>{tLine.substring(0, 2)}</span>{tLine.substring(2)}</div>;
                                  return <div key={i} style={{ color: '#e1e1e9', marginBottom: '6px', lineHeight: '1.5', minHeight: '19px' }}>{line}</div>;
                                })
                              )
                            ) : (
                              msg.file.content.split('\n').map((line, i) => {
                                const trimmedLine = line.trim();
                                const indentMatch = line.match(/^\s*/);
                                const indent = indentMatch ? indentMatch[0] : '';

                                // 1. Comments
                                if (trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
                                  return <div key={i}><span style={{ whiteSpace: 'pre' }}>{indent}</span><span style={{ color: '#8b949e', fontStyle: 'italic' }}>{trimmedLine}</span></div>;
                                }

                                // 2. Keyword detection & Enhanced Tokens (Vibrant Green Focus)
                                const keywords = ['import', 'from', 'const', 'let', 'var', 'export', 'default', 'function', 'return', 'type', 'interface', 'if', 'else', 'for', 'while', 'def', 'class', 'async', 'await', 'true', 'false'];
                                const types = ['string', 'number', 'boolean', 'any', 'void', 'React', 'useState', 'useEffect'];
                                
                                // Tokenizer regex that captures words, spaces, and punctuations
                                const tokens = line.split(/(\s+|[:{}()[\],;."']|(?<=")|(?='))/);
                                
                                return (
                                  <div key={i} style={{ minHeight: '19px' }}>
                                    {[...tokens].map((token, j) => {
                                      if (!token) return null;
                                      
                                      const trimmed = token.trim();
                                      
                                      // Keywords (Neon Green - User Request)
                                      if (keywords.includes(trimmed)) {
                                        return <span key={j} style={{ color: '#50fa7b', fontWeight: 600 }}>{token}</span>;
                                      }

                                      // Types (Bright Cyan)
                                      if (types.includes(trimmed)) {
                                        return <span key={j} style={{ color: '#8be9fd', fontStyle: 'italic' }}>{token}</span>;
                                      }
                                      
                                      // Numbers (Vibrant Orange)
                                      if (!isNaN(Number(trimmed)) && trimmed !== '' && !token.includes('"') && !token.includes("'")) {
                                        return <span key={j} style={{ color: '#ffb86c' }}>{token}</span>;
                                      }

                                      // Strings (Vibrant Yellow)
                                      if (token.startsWith('"') || token.startsWith("'") || token.endsWith('"') || token.endsWith("'")) {
                                        return <span key={j} style={{ color: '#f1fa8c' }}>{token}</span>;
                                      }

                                      // Function calls (Neon Green / Emerald)
                                      const nextToken = tokens[j+1]?.trim() || '';
                                      if (/^[a-zA-Z_]\w*$/.test(trimmed) && (nextToken === '(')) {
                                        return <span key={j} style={{ color: '#50fa7b', fontWeight: 500 }}>{token}</span>;
                                      }

                                      // Property Keys (Vibrant Purple)
                                      const nextActualToken = tokens.slice(j+1).find(t => t.trim() !== '') || '';
                                      if (/^[a-zA-Z_]\w*$/.test(trimmed) && nextActualToken === ':') {
                                        return <span key={j} style={{ color: '#bd93f9' }}>{token}</span>;
                                      }

                                      // Bracing/Operators (Vibrant Pink/Magenta)
                                      if ([':', '{', '}', '(', ')', '[', ']', '=', '+', '-', '*', '/', ';', ','].includes(trimmed)) {
                                        return <span key={j} style={{ color: '#ff79c6' }}>{token}</span>;
                                      }

                                      // Standard text (Silver/White)
                                      return <span key={j} style={{ color: '#f8f8f2' }}>{token}</span>;
                                    })}
                                  </div>
                                );
                              })
                            )}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Options Rendering */}
                {msg.options && msg.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {msg.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(option)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#cccccc',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.3)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '4px 14px 14px 14px',
                    background: 'rgba(20, 20, 20, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="typing-dot"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent-light)',
                        display: 'block',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area Sticky Bottom */}
          <div
            style={{
              padding: '0 20px 20px',
              flexShrink: 0,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div style={{ maxWidth: '750px', width: '100%', margin: '0 auto' }}>
              {renderInputArea()}
              <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Edge-OS can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AgentIconBtn({ emoji, label, onClick }: { emoji: string; label: string; onClick?: () => void }) {
  return (
    <button
      title={label}
      onClick={onClick}
      style={{
        width: '30px',
        height: '30px',
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: '7px',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124, 58, 237, 0.12)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
      }}
    >
      {emoji}
    </button>
  );
}