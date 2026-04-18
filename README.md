# EDGE-OS // CORE

A unified, AI-native environment that consolidates architecture design, code generation, and cloud deployment into a single, seamless terminal experience. EDGE-OS serves as an AI Architect Copilot, instantly generating complete, production-ready blueprints for web applications, SaaS platforms, and backend APIs.

## Features

- **AI-Powered Architecture Co-Pilot**: Uses advanced LLMs (Groq / Google Gemini) to generate comprehensive software architectures.
- **YAML Generation**: Instantly generates Docker Compose files, CI/CD pipelines, and core system configurations.
- **Comprehensive Documentation**: Automatically drafts structural Markdown documentation outlining the problem statement, architecture patterns, tech stack, and testing features.
- **Folder Structure generation**: Generates ASCII trees mapping out the folder and file structures for different frameworks (Node.js, Go, Python, etc.).
- **API Design**: Pre-defines your core API endpoints, authorization groups, and payload shapes.
- **Testing Plans**: Generates unit, integration, and End-to-End testing strategies dynamically based on your software stack.
- **Database ERD Diagramming**: Integrates with n8n and Kroki to visualize Entity-Relationship Diagrams directly within the interface.
- **Persistent Sessions**: Chat history, sessions, and artifacts are safely preserved using Firebase.
- **Authentication**: Seamless flow and user management handled by Clerk.
- **Token Quota System**: Rate-limiting and LLM token budgets managed dynamically across user sessions.

## Tech Stack

- **Frontend**: Next.js 16.2.0 (App Router), React 19.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Database & Storage**: Firebase
- **Authentication**: Clerk
- **AI Integrations**: Groq API / Google Gemini API
- **Diagramming Workflow**: n8n, Kroki, Mermaid.js
- **Package Manager**: npm / yarn

## Prerequisites

- Node.js 18+ 
- Clerk API Keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- Firebase Admin Configuration
- Groq / Google Gemini API Keys

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-os-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file and add your configuration details regarding Clerk, Firebase, and AI API Keys.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Structure

The application follows the Next.js App Router pattern:

```
├── app/
│   ├── (auth)/             # Clerk-based authentication routes
│   ├── api/                # Backend API services
│   │   ├── auth/           # Clerk webhook endpoints
│   │   ├── chat-history/   # Retrieval of Firebase chat histories
│   │   ├── generate/       # Multi-agent LLM abstraction handling artifact creation
│   │   ├── sessions/       # Load, list, and export sessions
│   │   └── token-quota/    # Rate limit and quota validations
│   ├── chat/               # The AI architectural workspace
│   ├── pricing/            # Subscription plans and billing details
│   ├── settings/           # User configurations and AI parameter toggles
│   ├── privacy/            # Privacy Policy
│   ├── terms/              # Terms of Service
│   ├── globals.css         # Global tailwind imports and base styles
│   ├── layout.tsx          # Root Application Layout
│   └── page.tsx            # EDGE-OS landing page
├── components/             # Reusable UI configurations
├── lib/                    # Core utilities (Firebase Admin, Memory Store, etc)
└── package.json            # Scripts & dependencies
```

## Generated Artifacts

When engaging with the EDGE-OS AI Architect Copilot, it manages the creation of multiple critical artifacts:
- **System Config**: High-level specification mapping frontend, backend, DBs, Auth, and CI/CD.
- **Docker Compose**: Ready-to-go `docker-compose.yaml` configured strictly to the inferred stack.
- **Pipeline**: CI/CD and multi-step execution flows defined via YAML.
- **Markdown Docs**: Ready-to-share standard project documentation for your target codebase.
- **Folder Structure**: A well-structured foundational file mapping.
- **API Design**: Core structural mappings of expected endpoints and CRUD boundaries.
- **Testing Plan**: A comprehensive outline of UI flow assertions and unit testing dependencies targeting the exact stack inferred.
- **DB Schema**: Entity Relationship Diagrams modeled dynamically to match the backend choices.

## Deployment

The application naturally ships as a container or as standard Next.js build elements.

### Standard Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t edge-os-core .
docker run -p 3000:3000 edge-os-core
```

## Troubleshooting

- **Authentication Errors**: Check that the Next.js Clerk environment variables match the ones present in your dashboard.
- **Generation Timeouts**: The LLM abstractions use a structured cache and time out optimally. If timeout issues occur frequently, check the selected AI backend health or fallback rules.
- **Database Synchronization**: Ensure the Firebase Admin configuration file represents the exact service account created within your Firebase instance.
