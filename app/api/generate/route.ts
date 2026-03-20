import { NextResponse } from "next/server";
import YAML from "yaml";

// 🧠 Simple in-memory cache
const cache = new Map();

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // 🔥 CACHE (avoid API calls)
  if (cache.has(prompt)) {
    return NextResponse.json(cache.get(prompt));
  }

  try {
    // 🔥 DEMO MODE (works without API)
    if (!process.env.GEMINI_API_KEY) {
      return demoResponse(prompt);
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an expert edge AI system architect.

Generate production-ready YAML.

RULES:
- Only YAML
- No explanation
- No backticks
- Use real devices

DEVICE RULES:
- lightweight → raspberry-pi-4
- video AI → jetson-nano or jetson-orin
- heavy → gpu-server

FORMAT RULES:
- lowercase only
- kebab-case only
- memory: 4gb, 8gb, 16gb
- accelerator: cpu or gpu

FORMAT:

system:
  type:
  use_case:

hardware:
  camera: true/false
  device:
  memory:
  accelerator:

models:
  - name:
    task:

services:
  - name:
    purpose:

pipeline:
  - step1 -> step2

USER:
${prompt}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    // 🚨 RATE LIMIT HANDLING
    if (res.status === 429) {
      return demoResponse(prompt);
    }

    const data = await res.json();

    let text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleanText = text
      .replace(/```yaml/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanText) {
      return demoResponse(prompt);
    }

    // 🔥 SAFE SPLIT (remove accidental docker)
    let yamlPart = cleanText;
    let dockerPart = "";

    const versionIndex = cleanText.indexOf("\nversion:");

    if (versionIndex !== -1) {
      yamlPart = cleanText.slice(0, versionIndex).trim();
      dockerPart = cleanText.slice(versionIndex + 1).trim();
    }

    // ✅ Parse YAML
    let recommendedDevice = null;

    try {
      const parsed = YAML.parse(yamlPart);
      recommendedDevice = parsed?.hardware?.device || null;
    } catch (e) {
      console.error("YAML parse error", e);
    }

    // ✅ GPU logic
    const isGPU =
      recommendedDevice?.includes("jetson") ||
      recommendedDevice === "gpu-server";

    // ✅ Docker fallback
    const dockerConfig = `
version: "3.8"

services:
  inference:
    image: openvino/yolov8
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [${isGPU ? "gpu" : "cpu"}]

  video:
    image: ffmpeg-stream
`;

    const result = {
      yaml: yamlPart,
      docker: dockerPart || dockerConfig,
      recommendedDevice,
    };

    // 🧠 Save to cache
    cache.set(prompt, result);

    return NextResponse.json(result);

  } catch (err) {
    console.error(err);
    return demoResponse(prompt);
  }
}

//
// 🔥 DEMO RESPONSES (VERY IMPORTANT)
//
function demoResponse(prompt: string) {

  // 🛒 RETAIL
  if (prompt.toLowerCase().includes("retail")) {
    return NextResponse.json({
      yaml: `system:
  type: retail-ai
  use_case: customer-detection

hardware:
  camera: true
  device: jetson-nano
  memory: 8gb
  accelerator: gpu

models:
  - name: yolov8n
    task: object-detection

services:
  - name: video-ingestion
    purpose: capture-stream
  - name: inference
    purpose: detect-customers

pipeline:
  - video-ingestion -> inference`,
      docker: demoDocker(true),
      recommendedDevice: "jetson-nano",
    });
  }

  // 🚗 TRAFFIC
  if (prompt.toLowerCase().includes("traffic")) {
    return NextResponse.json({
      yaml: `system:
  type: traffic-monitoring
  use_case: vehicle-detection-tracking

hardware:
  camera: true
  device: jetson-orin
  memory: 16gb
  accelerator: gpu

models:
  - name: yolov8
    task: vehicle-detection
  - name: deepsort
    task: object-tracking

services:
  - name: video-ingestion
    purpose: capture-stream
  - name: detection
    purpose: detect-vehicles
  - name: tracking
    purpose: track-vehicles

pipeline:
  - video-ingestion -> detection
  - detection -> tracking`,
      docker: demoDocker(true),
      recommendedDevice: "jetson-orin",
    });
  }

  // 🤖 DEFAULT
  return NextResponse.json({
    yaml: `system:
  type: edge-ai
  use_case: generic-ai-pipeline

hardware:
  camera: true
  device: raspberry-pi-4
  memory: 4gb
  accelerator: cpu

models:
  - name: lightweight-model
    task: inference

services:
  - name: ingestion
    purpose: collect-data
  - name: inference
    purpose: run-model

pipeline:
  - ingestion -> inference`,
    docker: demoDocker(false),
    recommendedDevice: "raspberry-pi-4",
  });
}

function demoDocker(isGPU: boolean) {
  return `
version: "3.8"

services:
  inference:
    image: openvino/yolov8
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [${isGPU ? "gpu" : "cpu"}]

  video:
    image: ffmpeg-stream
`;
}