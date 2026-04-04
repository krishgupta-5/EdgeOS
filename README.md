# Web-Based AI-Assisted OS Image Builder for Intel Edge AI Suites

A sophisticated web application that leverages artificial intelligence to generate customized OS configurations and deployment setups for Intel Edge AI hardware. This tool simplifies the complex process of creating edge AI deployments by providing intelligent recommendations and automated configuration generation.

## 🚀 Features

- **AI-Powered Configuration**: Uses Google's Gemini AI to generate hardware-optimized configurations
- **Multi-Device Support**: Supports various Intel Edge AI devices including Jetson, Intel NUC, and Raspberry Pi
- **Template Library**: Pre-built templates for common edge AI use cases
- **Real-time Generation**: Instant YAML and Docker Compose file generation
- **Pipeline Designer**: Automated ML pipeline creation with drag-and-drop interface
- **Device Recommendations**: Intelligent hardware suggestions based on use case requirements

## 🏗️ Architecture

The application generates three key configuration files:

1. **edge-config.yaml** - Hardware and system specifications
2. **docker-compose.yaml** - Container deployment configuration  
3. **pipeline.yaml** - Data processing pipeline definition

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.2.0 with React 19.2.4
- **Styling**: Tailwind CSS 4.0
- **AI Integration**: Google Gemini 2.5 Flash API
- **Language**: TypeScript
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (optional - demo mode available without API key)

## 🚀 Getting Started

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
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   # GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Using Templates
1. Browse the template gallery on the main page
2. Select a template that matches your use case (Retail Analytics, Traffic Monitoring, etc.)
3. View the generated configurations in the workspace

### AI Assistant Chat
1. Use the AI Architect Copilot chat interface
2. Describe your edge AI use case in natural language
3. The AI will generate optimized configurations for your specific needs

### Generated Files
- **Left Panel**: AI chat interface for custom requests
- **Right Panel**: Generated YAML configurations with syntax highlighting
- **Target Device**: Recommended hardware displayed prominently

## 📁 Project Structure

```
├── app/
│   ├── api/generate/     # API route for AI generation
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/
│   ├── Header.tsx        # Application header
│   ├── TemplateGrid.tsx  # Template gallery
│   ├── YamlViewer.tsx    # Code display component
│   └── ChatBox.tsx       # AI chat interface
├── public/               # Static assets
└── lib/                  # Utility functions
```

## 🔧 Configuration

### Supported Devices
- **Raspberry Pi 4**: Lightweight IoT and audio applications
- **Intel NUC**: Financial analytics and industrial applications
- **Jetson Nano**: Video AI ≤30 FPS
- **Jetson Orin**: Video AI >30 FPS and multi-model deployments
- **GPU Server**: Heavy workloads and cloud offloading

### Supported Use Cases
- Retail Analytics
- Traffic Monitoring
- Financial Analytics
- Industrial IoT
- Audio Processing
- NLP Applications
- Anomaly Detection

## 🐳 Docker Integration

The application generates production-ready Docker Compose files including:
- Optimized inference containers (TensorRT, ONNX Runtime)
- RTSP streaming servers for video applications
- MQTT brokers for IoT communications
- Grafana dashboards for monitoring
- PostgreSQL/Redis for data persistence

## 🤖 AI Features

The AI assistant can:
- Analyze use case requirements
- Recommend optimal hardware configurations
- Generate device-specific optimizations
- Create multi-step ML pipelines
- Provide deployment best practices

## 📊 Pipeline Generation

Automatically generates ML pipelines with:
- **Input**: Data ingestion (RTSP, API, sensors)
- **Processing**: Model inference and data transformation
- **Output**: Results storage and notifications
- **Error Handling**: Retry mechanisms and alerting

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t ai-os-builder .
docker run -p 3000:3000 ai-os-builder
```

## 🧪 Testing

The application includes demo mode functionality that works without API keys:
- Pre-configured responses for common use cases
- Fallback configuration generators
- Validation and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Google Summer of Code (GSOC) program.

## 🔗 Related Resources

- [Intel Edge AI Suites](https://www.intel.com/content/www/us/en/developer/topic-technology/edge-ai/overview.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🆘 Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your Gemini API key is properly set in `.env.local`
2. **Build Errors**: Clear the `.next` folder and reinstall dependencies
3. **Port Conflicts**: Change the port in `package.json` if 3000 is occupied

### Demo Mode
If no API key is provided, the application runs in demo mode with pre-configured templates and responses.
