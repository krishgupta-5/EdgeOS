// Temporary in-memory store for development until Firebase billing is resolved
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  userId: string;
  createdAt: Date;
}

interface Artifact {
  id: string;
  type: string;
  content: string;
  userId: string;
  createdAt: Date;
}

interface Session {
  userId: string;
  updatedAt: Date;
}

class MemoryStore {
  private messages = new Map<string, Message[]>();
  private artifacts = new Map<string, Artifact[]>();
  private sessions = new Map<string, Session>();

  // Message operations
  async addMessage(sessionId: string, message: Omit<Message, 'id' | 'createdAt'>): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);
    const fullMessage: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    
    const sessionMessages = this.messages.get(sessionId) || [];
    sessionMessages.push(fullMessage);
    this.messages.set(sessionId, sessionMessages);
    
    return id;
  }

  async getMessages(sessionId: string, userId: string): Promise<Message[]> {
    const sessionMessages = this.messages.get(sessionId) || [];
    return sessionMessages.filter(msg => msg.userId === userId);
  }

  // Artifact operations
  async addArtifact(sessionId: string, artifact: Omit<Artifact, 'id' | 'createdAt'>): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);
    const fullArtifact: Artifact = {
      ...artifact,
      id,
      createdAt: new Date(),
    };
    
    const sessionArtifacts = this.artifacts.get(sessionId) || [];
    sessionArtifacts.push(fullArtifact);
    this.artifacts.set(sessionId, sessionArtifacts);
    
    return id;
  }

  async getArtifacts(sessionId: string, userId: string): Promise<Artifact[]> {
    const sessionArtifacts = this.artifacts.get(sessionId) || [];
    return sessionArtifacts.filter(artifact => artifact.userId === userId);
  }

  // Session operations
  async updateSession(sessionId: string, session: Partial<Session>): Promise<void> {
    const existing = this.sessions.get(sessionId) || { userId: '', updatedAt: new Date() };
    this.sessions.set(sessionId, { ...existing, ...session, updatedAt: new Date() });
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessions.get(sessionId) || null;
  }

  async getUserSessions(userId: string): Promise<{ sessionId: string; updatedAt: Date; messageCount: number; lastMessage?: string }[]> {
    const userSessions = [];
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        const messages = this.messages.get(sessionId) || [];
        const userMessages = messages.filter(msg => msg.userId === userId);
        const lastUserMessage = userMessages
          .filter(msg => msg.role === 'user')
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
        
        userSessions.push({
          sessionId,
          updatedAt: session.updatedAt,
          messageCount: userMessages.length,
          lastMessage: lastUserMessage?.content
        });
      }
    }
    
    // Sort by most recently updated
    return userSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Clear all data (for testing)
  clear(): void {
    this.messages.clear();
    this.artifacts.clear();
    this.sessions.clear();
  }
}

export const memoryStore = new MemoryStore();
