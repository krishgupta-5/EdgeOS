'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatPanel from '../components/ChatPanel';
import SidebarRail from '../components/SidebarRail';
import { useParams } from 'next/navigation';

const agentNames: Record<string, string> = {
    '1': 'External Meeting Prep Ag...',
    '2': 'Market Research',
    '3': 'Email Drafter',
    '4': 'Lead Enrichment',
};

export default function ChatSession() {
    const [activeAgentId, setActiveAgentId] = useState('1');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const params = useParams();
    const sessionId = params.sessionId as string;

    return (
        <div
            className="glass-panel"
            style={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                borderRadius: 0,
            }}
        >
            <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
                <Sidebar
                    activeAgentId={activeAgentId}
                    onSelectAgent={setActiveAgentId}
                    isOpen={isSidebarOpen}
                />

                <SidebarRail
                    onToggleMainSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isMainSidebarOpen={isSidebarOpen}
                />

                <ChatPanel
                    agentName={agentNames[activeAgentId]}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                    sessionId={sessionId}
                />
            </div>
        </div>
    );
}
