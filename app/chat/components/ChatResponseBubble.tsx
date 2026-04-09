import React from 'react';

// --- Building Blocks ---

// Avatar Component
export const Avatar = ({ initials }: { initials: string }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-card-hover)] text-sm font-semibold text-[var(--text-primary)] shrink-0 border border-[var(--border-subtle)]">
    {initials}
  </div>
);

// Section Header component
export const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-100 text-[1.1rem] mt-6 mb-3 tracking-wide">
    {children}
  </h3>
);

// Purple Link Component
export const PurpleLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-[var(--accent-light)] hover:text-[var(--text-primary)] transition-colors underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

// Lists
export const NestedList = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-2 space-y-2">
    {children}
  </ul>
);

export const NestedListItem = ({ children }: { children: React.ReactNode }) => (
  // Using a custom faint bullet icon representation
  <li className="pl-6 relative before:content-[''] before:absolute before:left-[10px] before:top-[8px] before:w-[4px] before:h-[4px] before:bg-[#4a4d60] before:rounded-full text-[#e1e1e9]/80 text-sm">
    {children}
  </li>
);

export const MainList = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-4 space-y-5">
    {children}
  </ul>
);

export const AttendeeListItem = ({ initials, name, children }: { initials: string; name: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex items-start gap-4">
    <Avatar initials={initials} />
    <div className="flex-1">
      <div className="font-semibold text-white text-base mb-1">{name}</div>
      {children}
    </div>
  </li>
);


// --- Main Container ---

interface ChatResponseProps {
  confirmationText?: string;
  children: React.ReactNode;
}

export const ChatResponseContainer = ({ confirmationText, children }: ChatResponseProps) => {
  return (
    <div className="bg-[var(--bg-chat)] backdrop-blur-[var(--glass-blur)] text-[var(--text-primary)] p-6 md:p-8 rounded-2xl max-w-4xl w-full shadow-[var(--shadow-premium)] leading-relaxed border border-[var(--border-subtle)] mx-auto">
      {/* Contextual Confirmation */}
      {confirmationText && (
        <p className="mb-4 text-[var(--text-primary)] opacity-90 text-[15px]">
          {confirmationText}
        </p>
      )}
      
      {/* Main Content Area */}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};


// --- Example Usage matching your prompt exactly --- 

export const ChatResponseDemo = () => {
  return (
    <ChatResponseContainer 
      confirmationText="I have set up the #external-meeting-prep channel and pulled the latest data on the key attendees for your upcoming sync."
    >
      {/* Structured Hierarchy */}
      <SectionHeader>Meeting Details:</SectionHeader>
      <ul className="space-y-1 text-sm text-[#e1e1e9]/90 mb-6">
        <li><strong>Topic:</strong> Q3 Strategic Partnership Integration</li>
        <li><strong>Time:</strong> 2:00 PM EST</li>
        <li><strong>Status:</strong> Confirmed</li>
      </ul>

      <SectionHeader>External Attendees:</SectionHeader>
      
      <MainList>
        {/* Tiered Information and Visuals */}
        <AttendeeListItem 
          initials="MB" 
          name={<>Michael B. - <PurpleLink href="#">LinkedIn Profile</PurpleLink></>}
        >
          <NestedList>
            <NestedListItem><strong>Bio:</strong> VP of Integration at TechCorp. Leads their enterprise API strategy.</NestedListItem>
            <NestedListItem><strong>Recent Activity:</strong> Recently published an article on seamless data pipelines in cloud environments.</NestedListItem>
          </NestedList>
        </AttendeeListItem>
        
        <AttendeeListItem 
          initials="DK" 
          name={<>David K. - <PurpleLink href="#">LinkedIn Profile</PurpleLink></>}
        >
          <NestedList>
            <NestedListItem><strong>Bio:</strong> Lead Technical Director at TechCorp. Key decision-maker for infrastructure choices.</NestedListItem>
            <NestedListItem><strong>Recent Activity:</strong> Mentioned scaling challenges in their Q2 earning calls; highly focused on reliability.</NestedListItem>
          </NestedList>
        </AttendeeListItem>
      </MainList>

      <SectionHeader>Suggested Talking Points:</SectionHeader>
      
      {/* Clear Actionable Insights */}
      <NestedList>
        <NestedListItem>
          Highlight our new API architecture improvements, referencing Michael's recent article to show alignment in cloud data pipeline strategies.
        </NestedListItem>
        <NestedListItem>
          Address David's concerns directly by presenting our 99.99% uptime SLAs and fault-tolerant infrastructure setup.
        </NestedListItem>
        <NestedListItem>
          Propose a phased rollout to mitigate any immediate integration risks on their side.
        </NestedListItem>
      </NestedList>
      
    </ChatResponseContainer>
  );
};

export default ChatResponseDemo;