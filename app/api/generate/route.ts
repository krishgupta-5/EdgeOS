import { NextResponse } from "next/server";
import YAML from "yaml";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ParsedYaml {
  system?: { type?: string; use_case?: string };
  hardware?: {
    camera?: boolean;
    device?: string;
    memory?: string;
    accelerator?: string;
    os?: string;
  };
  models?: Array<{
    name?: string;
    task?: string;
    framework?: string;
    precision?: string;
  }>;
}

interface GenerateResult {
  yaml: string;       // edge-config.yaml   → system + hardware + models ONLY
  docker: string;     // docker-compose.yaml → services + networks + deployment
  pipeline: string;   // pipeline.yaml       → steps + flow DAG
  recommendedDevice: string | null;
  pipelineFlow: string;
}

// ─────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────
const cache = new Map<string, GenerateResult>();

// ─────────────────────────────────────────────
// PROMPT 1 — edge-config.yaml
// Hardware spec only: system + hardware + models
// ─────────────────────────────────────────────
const EDGE_CONFIG_PROMPT = `
You are a senior edge-AI hardware architect.
Generate ONLY the hardware specification config for an edge AI device.
This file describes WHAT hardware runs the system — NOT how services are deployed.

Output ONLY valid YAML. No markdown fences, no backticks, no explanation.

════════════════════════════
SCHEMA (all fields required)
════════════════════════════

system:
  type:        <kebab-case, e.g. retail-analytics>
  use_case:    <kebab-case, e.g. real-time-shelf-monitoring>
  version:     "1.0.0"

hardware:
  camera:      <true | false>
  device:      <see DEVICE RULES>
  memory:      <4gb | 8gb | 16gb | 32gb>
  accelerator: <cpu | gpu | npu>
  os:          <linux | jetpack | raspbian>
  storage:     <16gb | 32gb | 64gb | 128gb>
  connectivity: <wifi | ethernet | lte>

models:
  - name:       <exact model id, e.g. yolov8n>
    task:       <detection | classification | segmentation | tracking | nlp | asr | anomaly-detection>
    framework:  <onnx | tflite | tensorrt | openvino | pytorch>
    precision:  <fp32 | fp16 | int8>
    input_size: <e.g. 640x640 | 224x224>
    fps_target: <integer, e.g. 30>

════════════════════════════
DEVICE RULES
════════════════════════════
lightweight / IoT / audio / NLP  → raspberry-pi-4   (accelerator: cpu)
financial / analytics / NLP      → intel-nuc-openvino (accelerator: npu)
video AI ≤30 FPS                 → jetson-nano       (accelerator: gpu)
video AI >30 FPS / multi-model   → jetson-orin       (accelerator: gpu)
industrial / ONNX                → intel-nuc-openvino (accelerator: npu)
heavy / cloud offload            → gpu-server        (accelerator: gpu)

RULES:
- Output ONLY system + hardware + models sections
- NO services, NO pipeline, NO deployment — those belong in other files
- All string values: kebab-case only
- memory: exactly one of 4gb | 8gb | 16gb | 32gb
`;

// ─────────────────────────────────────────────
// PROMPT 2 — docker-compose.yaml
// Runtime deployment: services + networks + volumes
// ─────────────────────────────────────────────
const DOCKER_COMPOSE_PROMPT = `
You are a senior DevOps engineer specialising in edge AI deployments.
Generate ONLY a production-ready docker-compose.yaml for the given use case and device.

Output ONLY valid docker-compose YAML starting with: version: "3.8"
No markdown fences, no backticks, no explanation.

════════════════════════════
REQUIREMENTS
════════════════════════════

1. Include 2-4 real, publicly available Docker services appropriate for the use case
2. Every service must have: image, restart, ports, environment, networks
3. Add GPU deploy block ONLY for jetson or gpu-server devices
4. Include a named network at the bottom (driver: bridge or host)
5. Add a volumes section if any service needs persistence (e.g. database, grafana)
6. Add healthcheck to inference/main service

════════════════════════════
REAL IMAGE REFERENCE
════════════════════════════
YOLOv8 on Jetson:    ultralytics/ultralytics:latest-jetson
YOLOv8 general:      ultralytics/ultralytics:latest
OpenVINO / NUC:      openvino/ubuntu20_runtime:latest
TensorRT:            nvcr.io/nvidia/tensorrt:23.10-py3
ONNX Runtime:        mcr.microsoft.com/onnxruntime/server:latest
RTSP stream:         aler9/rtsp-simple-server:latest
FFmpeg:              linuxserver/ffmpeg:latest
MQTT broker:         eclipse-mosquitto:2
Redis:               redis:7-alpine
Grafana:             grafana/grafana:latest
Node-RED:            nodered/node-red:latest
Whisper ASR:         onerahmet/openai-whisper-asr-webservice:latest
PostgreSQL:          postgres:15-alpine
FastAPI server:      tiangolo/uvicorn-gunicorn-fastapi:python3.11

GPU deploy block (only for jetson/gpu-server):
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

RULES:
- Output ONLY valid docker-compose YAML
- Start with: version: "3.8"
- Use real image names from the reference above
- NO system/hardware/models/pipeline sections — those are in other files
`;

// ─────────────────────────────────────────────
// PROMPT 3 — pipeline.yaml
// Data flow DAG: steps + dependencies + flow
// ─────────────────────────────────────────────
const PIPELINE_PROMPT = `
You are a senior ML pipeline architect.
Generate ONLY the data pipeline definition for the given edge AI use case.

This file defines HOW data flows through the system — input → processing → output.
It is separate from hardware config and docker deployment.

Output ONLY valid YAML. No markdown fences, no backticks, no explanation.

════════════════════════════
SCHEMA (all fields required)
════════════════════════════

pipeline:
  name:    <kebab-case pipeline name>
  version: "1.0.0"
  trigger: <continuous | scheduled | event-driven>

  steps:
    - id:       <short-id, e.g. ingest>
      name:     <Human Readable Name>
      type:     <input | process | inference | output | store | notify>
      depends:  []
      config:
        source:   <e.g. rtsp-camera | microphone | database | api>
        timeout:  <seconds, e.g. 30>

    - id:       <short-id>
      name:     <Human Readable Name>
      type:     <input | process | inference | output | store | notify>
      depends:  [<previous-id>]
      config:
        model:    <model name if inference step>
        timeout:  <seconds>

  flow: "<id1> -> <id2> -> <id3>"

  on_error:
    strategy: <retry | skip | alert>
    max_retries: 3

RULES:
- Output ONLY the pipeline section
- Minimum 3 steps, maximum 6 steps
- Every step needs id, name, type, depends, config
- depends: [] for the first/root step only
- flow must be a single arrow-chain string
- All ids: kebab-case only
- NO hardware, NO services, NO docker content
`;

// ─────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────
function isValidEdgeConfig(yaml: string): boolean {
  try {
    const p = YAML.parse(yaml) as ParsedYaml;
    return (
      !!p?.system?.type &&
      !!p?.hardware?.device &&
      !!p?.hardware?.accelerator &&
      Array.isArray(p?.models) && p.models.length > 0 &&
      p.models[0]?.name != null &&
      // Must NOT contain deployment concerns
      !yaml.includes("services:") &&
      !yaml.includes("pipeline:")
    );
  } catch { return false; }
}

function isValidDockerCompose(yaml: string): boolean {
  try {
    const p = YAML.parse(yaml) as Record<string, unknown>;
    return (
      yaml.includes("version:") &&
      !!p?.services &&
      typeof p.services === "object" &&
      Object.keys(p.services as object).length >= 2
    );
  } catch { return false; }
}

function isValidPipeline(yaml: string): boolean {
  try {
    const p = YAML.parse(yaml) as { pipeline?: { steps?: unknown[]; flow?: string } };
    return (
      !!p?.pipeline?.steps &&
      Array.isArray(p.pipeline.steps) &&
      p.pipeline.steps.length >= 3 &&
      typeof p.pipeline?.flow === "string"
    );
  } catch { return false; }
}

// ─────────────────────────────────────────────
// Gemini caller
// ─────────────────────────────────────────────
async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  retryNote = ""
): Promise<string | null> {
  const text = retryNote
    ? `${systemPrompt}\n\nNOTE: ${retryNote}\n\nUSER REQUEST:\n${userPrompt}`
    : `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.85,
            maxOutputTokens: 1200,
          },
        }),
      }
    );
    if (!r.ok) return null;
    const d = await r.json();
    const raw: string = d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return raw.replace(/```yaml\s*/gi, "").replace(/```\s*/g, "").trim();
  } catch { return null; }
}

// ─────────────────────────────────────────────
// Call with one automatic retry on validation fail
// ─────────────────────────────────────────────
async function callWithRetry(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  validator: (yaml: string) => boolean,
  retryNote: string
): Promise<string | null> {
  const first = await callGemini(apiKey, systemPrompt, userPrompt);
  if (first && validator(first)) return first;

  console.warn("First call invalid, retrying...");
  const second = await callGemini(apiKey, systemPrompt, userPrompt, retryNote);
  if (second && validator(second)) return second;

  return null;
}

// ─────────────────────────────────────────────
// Docker Compose builder (used as fallback)
// ─────────────────────────────────────────────
function buildFallbackDocker(device: string | null, isGPU: boolean, useCase: string): string {
  const p = useCase.toLowerCase();
  const needsCamera = p.includes("video") || p.includes("retail") || p.includes("traffic") || p.includes("camera");
  const needsDB = p.includes("financ") || p.includes("analytic") || p.includes("expense") || p.includes("track");
  const needsDashboard = p.includes("monitor") || p.includes("traffic") || p.includes("dashboard");

  const inferenceImage = device?.includes("jetson")
    ? "ultralytics/ultralytics:latest-jetson"
    : device?.includes("openvino")
    ? "openvino/ubuntu20_runtime:latest"
    : "mcr.microsoft.com/onnxruntime/server:latest";

  const gpuBlock = isGPU
    ? `    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]`
    : "";

  const cameraService = needsCamera ? `
  rtsp-server:
    image: aler9/rtsp-simple-server:latest
    restart: always
    ports:
      - "8554:8554"
    environment:
      - RTSP_PROTOCOLS=tcp
    networks:
      - edge-net
` : "";

  const dbService = needsDB ? `
  database:
    image: postgres:15-alpine
    restart: always
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=edgeai
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - edge-net
` : "";

  const dashboardService = needsDashboard ? `
  dashboard:
    image: grafana/grafana:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - edge-net
` : "";

  const volumes = needsDB ? `\nvolumes:\n  db-data:` : "";

  return `version: "3.8"

services:
  inference:
    image: ${inferenceImage}
    restart: always
    ports:
      - "8080:8080"
    environment:
      - ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
${gpuBlock}
    networks:
      - edge-net
${cameraService}
  mqtt-broker:
    image: eclipse-mosquitto:2
    restart: always
    ports:
      - "1883:1883"
    environment:
      - MQTT_ALLOW_ANONYMOUS=true
    networks:
      - edge-net
${dbService}${dashboardService}
networks:
  edge-net:
    driver: ${device?.includes("jetson") ? "host" : "bridge"}
${volumes}`;
}

// ─────────────────────────────────────────────
// Pipeline builder (fallback)
// ─────────────────────────────────────────────
function buildFallbackPipeline(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("retail") || p.includes("shelf") || p.includes("store")) {
    return `pipeline:
  name: retail-detection-pipeline
  version: "1.0.0"
  trigger: continuous

  steps:
    - id: ingest
      name: Video Ingestion
      type: input
      depends: []
      config:
        source: rtsp-camera
        timeout: 5

    - id: detect
      name: Customer Detection
      type: inference
      depends: [ingest]
      config:
        model: yolov8n
        timeout: 100

    - id: store
      name: Store Results
      type: store
      depends: [detect]
      config:
        source: postgres-db
        timeout: 10

    - id: notify
      name: Publish MQTT Alert
      type: notify
      depends: [store]
      config:
        source: mqtt-broker
        timeout: 5

  flow: "ingest -> detect -> store -> notify"

  on_error:
    strategy: retry
    max_retries: 3`;
  }

  if (p.includes("traffic") || p.includes("vehicle") || p.includes("road")) {
    return `pipeline:
  name: traffic-monitoring-pipeline
  version: "1.0.0"
  trigger: continuous

  steps:
    - id: ingest
      name: Video Ingestion
      type: input
      depends: []
      config:
        source: rtsp-camera
        timeout: 5

    - id: detect
      name: Vehicle Detection
      type: inference
      depends: [ingest]
      config:
        model: yolov8m
        timeout: 80

    - id: track
      name: Object Tracking
      type: process
      depends: [detect]
      config:
        model: bytetrack
        timeout: 50

    - id: visualise
      name: Dashboard Update
      type: output
      depends: [track]
      config:
        source: grafana-api
        timeout: 20

  flow: "ingest -> detect -> track -> visualise"

  on_error:
    strategy: retry
    max_retries: 3`;
  }

  if (p.includes("financ") || p.includes("expense") || p.includes("analytic")) {
    return `pipeline:
  name: financial-analytics-pipeline
  version: "1.0.0"
  trigger: event-driven

  steps:
    - id: ingest
      name: Data Ingestion
      type: input
      depends: []
      config:
        source: api
        timeout: 10

    - id: categorize
      name: NLP Categorization
      type: inference
      depends: [ingest]
      config:
        model: bert-base-uncased
        timeout: 200

    - id: store
      name: Database Storage
      type: store
      depends: [categorize]
      config:
        source: postgres-db
        timeout: 15

    - id: predict
      name: Spending Prediction
      type: inference
      depends: [store]
      config:
        model: timeseries-forecast
        timeout: 300

  flow: "ingest -> categorize -> store -> predict"

  on_error:
    strategy: alert
    max_retries: 3`;
  }

  // Default
  return `pipeline:
  name: edge-ai-pipeline
  version: "1.0.0"
  trigger: continuous

  steps:
    - id: ingest
      name: Data Ingestion
      type: input
      depends: []
      config:
        source: sensor
        timeout: 10

    - id: process
      name: Model Inference
      type: inference
      depends: [ingest]
      config:
        model: lightweight-model
        timeout: 100

    - id: publish
      name: Publish Results
      type: output
      depends: [process]
      config:
        source: mqtt-broker
        timeout: 5

  flow: "ingest -> process -> publish"

  on_error:
    strategy: retry
    max_retries: 3`;
}

// ─────────────────────────────────────────────
// Demo responses
// ─────────────────────────────────────────────
function demoResponse(prompt: string): ReturnType<typeof NextResponse.json> {
  const p = prompt.toLowerCase();

  // Retail
  if (p.includes("retail") || p.includes("shelf") || p.includes("store")) {
    return NextResponse.json({
      yaml: `system:
  type: retail-analytics
  use_case: real-time-customer-detection
  version: "1.0.0"

hardware:
  camera: true
  device: jetson-nano
  memory: 8gb
  accelerator: gpu
  os: jetpack
  storage: 32gb
  connectivity: ethernet

models:
  - name: yolov8n
    task: detection
    framework: tensorrt
    precision: int8
    input_size: 640x640
    fps_target: 30`,

      docker: `version: "3.8"

services:
  rtsp-server:
    image: aler9/rtsp-simple-server:latest
    restart: always
    ports:
      - "8554:8554"
    environment:
      - RTSP_PROTOCOLS=tcp
    networks:
      - edge-net

  inference:
    image: ultralytics/ultralytics:latest-jetson
    restart: always
    ports:
      - "8080:8080"
    environment:
      - MODEL=yolov8n.pt
      - DEVICE=cuda
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - edge-net

  mqtt-broker:
    image: eclipse-mosquitto:2
    restart: always
    ports:
      - "1883:1883"
    environment:
      - MQTT_ALLOW_ANONYMOUS=true
    networks:
      - edge-net

networks:
  edge-net:
    driver: host`,

      pipeline: `pipeline:
  name: retail-detection-pipeline
  version: "1.0.0"
  trigger: continuous

  steps:
    - id: ingest
      name: Video Ingestion
      type: input
      depends: []
      config:
        source: rtsp-camera
        timeout: 5

    - id: detect
      name: Customer Detection
      type: inference
      depends: [ingest]
      config:
        model: yolov8n
        timeout: 100

    - id: store
      name: Store Results
      type: store
      depends: [detect]
      config:
        source: redis
        timeout: 10

    - id: notify
      name: Publish MQTT Alert
      type: notify
      depends: [store]
      config:
        source: mqtt-broker
        timeout: 5

  flow: "ingest -> detect -> store -> notify"

  on_error:
    strategy: retry
    max_retries: 3`,

      recommendedDevice: "jetson-nano",
      pipelineFlow: "ingest -> detect -> store -> notify",
    });
  }

  // Traffic
  if (p.includes("traffic") || p.includes("vehicle") || p.includes("road")) {
    return NextResponse.json({
      yaml: `system:
  type: traffic-monitoring
  use_case: vehicle-detection-and-tracking
  version: "1.0.0"

hardware:
  camera: true
  device: jetson-orin
  memory: 16gb
  accelerator: gpu
  os: jetpack
  storage: 64gb
  connectivity: ethernet

models:
  - name: yolov8m
    task: detection
    framework: tensorrt
    precision: fp16
    input_size: 640x640
    fps_target: 60
  - name: bytetrack
    task: tracking
    framework: onnx
    precision: fp32
    input_size: 640x640
    fps_target: 60`,

      docker: `version: "3.8"

services:
  rtsp-server:
    image: aler9/rtsp-simple-server:latest
    restart: always
    ports:
      - "8554:8554"
    environment:
      - RTSP_PROTOCOLS=tcp
    networks:
      - edge-net

  inference:
    image: ultralytics/ultralytics:latest-jetson
    restart: always
    ports:
      - "8080:8080"
    environment:
      - MODEL=yolov8m.pt
      - TRACKER=bytetrack.yaml
      - DEVICE=cuda
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - edge-net

  mqtt-broker:
    image: eclipse-mosquitto:2
    restart: always
    ports:
      - "1883:1883"
    environment:
      - MQTT_ALLOW_ANONYMOUS=true
    networks:
      - edge-net

  dashboard:
    image: grafana/grafana:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - edge-net

networks:
  edge-net:
    driver: host`,

      pipeline: `pipeline:
  name: traffic-monitoring-pipeline
  version: "1.0.0"
  trigger: continuous

  steps:
    - id: ingest
      name: Video Ingestion
      type: input
      depends: []
      config:
        source: rtsp-camera
        timeout: 5

    - id: detect
      name: Vehicle Detection
      type: inference
      depends: [ingest]
      config:
        model: yolov8m
        timeout: 80

    - id: track
      name: Object Tracking
      type: process
      depends: [detect]
      config:
        model: bytetrack
        timeout: 50

    - id: visualise
      name: Dashboard Update
      type: output
      depends: [track]
      config:
        source: grafana-api
        timeout: 20

  flow: "ingest -> detect -> track -> visualise"

  on_error:
    strategy: retry
    max_retries: 3`,

      recommendedDevice: "jetson-orin",
      pipelineFlow: "ingest -> detect -> track -> visualise",
    });
  }

  // Default
  return NextResponse.json({
    yaml: `system:
  type: edge-ai
  use_case: generic-inference-pipeline
  version: "1.0.0"

hardware:
  camera: true
  device: raspberry-pi-4
  memory: 4gb
  accelerator: cpu
  os: raspbian
  storage: 16gb
  connectivity: wifi

models:
  - name: mobilenet-v2
    task: classification
    framework: tflite
    precision: int8
    input_size: 224x224
    fps_target: 15`,

    docker: buildFallbackDocker("raspberry-pi-4", false, prompt),
    pipeline: buildFallbackPipeline(prompt),
    recommendedDevice: "raspberry-pi-4",
    pipelineFlow: "ingest -> process -> publish",
  });
}

// ─────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────
export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const cacheKey = prompt.trim().toLowerCase();
  if (cache.has(cacheKey)) return NextResponse.json(cache.get(cacheKey));

  if (!process.env.GEMINI_API_KEY) return demoResponse(prompt);

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // ── Fire all 3 prompts in parallel ──
    const [edgeConfigRaw, dockerRaw, pipelineRaw] = await Promise.all([
      callWithRetry(
        apiKey,
        EDGE_CONFIG_PROMPT,
        prompt,
        isValidEdgeConfig,
        "Output ONLY system + hardware + models. No services, no pipeline, no deployment sections."
      ),
      callWithRetry(
        apiKey,
        DOCKER_COMPOSE_PROMPT,
        prompt,
        isValidDockerCompose,
        "Start with version: \"3.8\" and include at least 2 real services with proper images."
      ),
      callWithRetry(
        apiKey,
        PIPELINE_PROMPT,
        prompt,
        isValidPipeline,
        "Output ONLY the pipeline section with at least 3 steps and a flow string."
      ),
    ]);

    // ── Parse edge config for device info ──
    let recommendedDevice: string | null = null;
    let pipelineFlow = "";
    let isGPU = false;

    if (edgeConfigRaw) {
      try {
        const parsed = YAML.parse(edgeConfigRaw) as ParsedYaml;
        recommendedDevice = parsed?.hardware?.device ?? null;
        const accelerator = parsed?.hardware?.accelerator ?? "cpu";
        isGPU = accelerator === "gpu" || recommendedDevice?.includes("jetson") || recommendedDevice === "gpu-server";
      } catch { /* use defaults */ }
    }

    if (pipelineRaw) {
      try {
        const parsed = YAML.parse(pipelineRaw) as { pipeline?: { flow?: string } };
        pipelineFlow = parsed?.pipeline?.flow ?? "";
      } catch { /* use default */ }
    }

    // demoResponse returns NextResponse — extract yaml without .then()
    let fallbackYaml = "";
    if (!edgeConfigRaw) {
      const demoJson = await demoResponse(prompt).json() as GenerateResult;
      fallbackYaml = demoJson.yaml ?? "";
    }

    const result: GenerateResult = {
      yaml:     edgeConfigRaw ?? fallbackYaml,
      docker:   dockerRaw    ?? buildFallbackDocker(recommendedDevice, isGPU, prompt),
      pipeline: pipelineRaw  ?? buildFallbackPipeline(prompt),
      recommendedDevice,
      pipelineFlow,
    };

    cache.set(cacheKey, result);
    return NextResponse.json(result);

  } catch (err) {
    console.error("Unexpected error:", err);
    return demoResponse(prompt);
  }
}