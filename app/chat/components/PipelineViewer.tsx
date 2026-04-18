"use client";

import React from "react";

// ─────────────────────────────────────────────
// Pipeline YAML parsing functions
// ─────────────────────────────────────────────
function parsePipelineYaml(yamlText: string): Array<{
  id: string;
  title: string;
  type: string;
  description: string;
}> {
  try {
    const lines = yamlText.split("\n");
    const steps: Array<{
      id: string;
      title: string;
      type: string;
      description: string;
    }> = [];
    let inSteps = false;
    let current: Partial<(typeof steps)[0]> = {};

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      if (line === "steps:") {
        inSteps = true;
        continue;
      }
      if (!inSteps) continue;
      if (line.startsWith("flow:")) {
        if (current.id) steps.push(current as (typeof steps)[0]);
        break;
      }
      if (line.startsWith("- id:") || line.startsWith("-id:")) {
        if (current.id) steps.push(current as (typeof steps)[0]);
        const id = line
          .replace(/^-\s*id:\s*/, "")
          .trim()
          .replace(/^["']|["']$/g, "");
        current = { id, title: id, type: id, description: "" };
        continue;
      }
      const clean = line.replace(/^-\s+/, "");
      if (clean.startsWith("title:")) {
        current.title = clean
          .replace("title:", "")
          .trim()
          .replace(/^["']|["']$/g, "");
        continue;
      }
      if (clean.startsWith("type:")) {
        current.type = clean
          .replace("type:", "")
          .trim()
          .replace(/^["']|["']$/g, "");
        continue;
      }
      if (clean.startsWith("description:")) {
        current.description = clean
          .replace("description:", "")
          .trim()
          .replace(/^["']|["']$/g, "");
        continue;
      }
    }
    if (current.id && !steps.find((s) => s.id === current.id))
      steps.push(current as (typeof steps)[0]);
    return steps;
  } catch {
    return [];
  }
}

function parsePipelineMeta(yamlText: string): {
  name: string;
  version: string;
  trigger: string;
} {
  const get = (key: string) => {
    const match = new RegExp(`${key}:\\s*(.+)`).exec(yamlText);
    return match ? match[1].trim().replace(/^["']|["']$/g, "") : "—";
  };
  return {
    name: get("name"),
    version: get("version"),
    trigger: get("trigger"),
  };
}

// ─────────────────────────────────────────────
// Color Mapping
// ─────────────────────────────────────────────
function getNodeColor(id: string): string {
  const k = id.toLowerCase();
  if (["source", "ingest", "request"].some((x) => k.includes(x))) return "#3B82F6"; // Blue
  if (["transform", "build"].some((x) => k.includes(x))) return "#F59E0B"; // Amber
  if (["process", "validate", "test", "lint"].some((x) => k.includes(x))) return "#10B981"; // Emerald
  if (["storage", "store", "cache", "deploy"].some((x) => k.includes(x))) return "#8B5CF6"; // Purple
  return "#A3A3A3"; // Gray
}

interface PipelineViewerProps {
  content: string;
  msgId: string;
  activeNode: string | null;
  onActiveNodeChange: (nodeId: any) => void;
}

export default function PipelineViewer({ content, msgId, activeNode, onActiveNodeChange }: PipelineViewerProps) {
  const nodes = parsePipelineYaml(content);
  const meta = parsePipelineMeta(content);

  if (nodes.length === 0) {
    return (
      <pre style={{ color: "#888", fontSize: "14px", fontFamily: '"Geist Mono", monospace', margin: 0 }}>
        {content}
      </pre>
    );
  }

  // Dynamically generate the grid columns so nodes take exactly 1 equal fraction (1fr) 
  // and arrows take exactly their required space (auto).
  const gridTemplate = nodes
    .map((_, i) => (i === nodes.length - 1 ? "minmax(0, 1fr)" : "minmax(0, 1fr) auto"))
    .join(" ");

  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      width: "100%", 
      background: "#050505", 
      border: "1px solid #1A1A1A", 
      borderRadius: "12px", 
      padding: "24px" 
    }}>
      
      {/* Meta Data Header */}
      <div style={{ marginBottom: "32px", display: "flex", gap: "40px", alignItems: "center" }}>
        {meta.name !== "—" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "#71717A", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
              Pipeline
            </span>
            <span style={{ fontSize: "14px", color: "#FAFAFA", fontFamily: '"Geist Mono", monospace', fontWeight: 500 }}>
              {meta.name} <span style={{ color: "#52525B", marginLeft: "4px" }}>v{meta.version}</span>
            </span>
          </div>
        )}
        {meta.trigger !== "—" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "10px", color: "#71717A", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
              Trigger
            </span>
            <span style={{ fontSize: "14px", color: "#10B981", fontFamily: '"Geist Mono", monospace', fontWeight: 500 }}>
              {meta.trigger}
            </span>
          </div>
        )}
      </div>

      {/* Grid Canvas - STRICTLY 100% WIDTH, EQUAL DISTRIBUTION */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: gridTemplate,
        alignItems: "stretch", 
        gap: "12px",
        width: "100%"
      }}>
        {nodes.map((node, i) => {
          const color = getNodeColor(node.type || node.id);
          const isLast = i === nodes.length - 1;
          const isFirst = i === 0;

          return (
            <React.Fragment key={node.id}>
              {/* Node Block */}
              <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "#09090B", 
                border: `1px solid ${color}30`,
                borderRadius: "8px",
                minWidth: 0, // Prevents CSS grid from breaking on long text
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.4)",
              }}>
                
                {/* Input Port */}
                {!isFirst && (
                  <div style={{
                    position: "absolute",
                    left: "-5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#09090B",
                    border: `2px solid ${color}`,
                    zIndex: 2
                  }} />
                )}

                {/* Output Port */}
                {!isLast && (
                  <div style={{
                    position: "absolute",
                    right: "-5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: color,
                    border: "2px solid #09090B",
                    zIndex: 2
                  }} />
                )}

                {/* Header Strip */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "10px 14px",
                  background: color, 
                  borderTopLeftRadius: "7px",
                  borderTopRightRadius: "7px",
                }}>
                  <span style={{ 
                    fontSize: "11px", 
                    color: "#000000",
                    fontFamily: '"Geist Mono", monospace',
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {node.type || "STEP"}
                  </span>
                  <span style={{ 
                    fontSize: "10px", 
                    color: "rgba(0,0,0,0.6)", 
                    fontFamily: '"Geist Mono", monospace',
                    fontWeight: 800,
                    flexShrink: 0,
                    marginLeft: "8px"
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content Body */}
                <div style={{ 
                  padding: "16px", 
                  display: "flex", 
                  flexDirection: "column", 
                  flex: 1, 
                  gap: "10px",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    fontSize: "14px", 
                    fontWeight: 600, 
                    color: "#FAFAFA", 
                    lineHeight: "1.3",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {node.title || node.id}
                  </div>

                  {node.description && (
                    <div style={{ 
                      fontSize: "13px", 
                      color: "#A1A1AA", 
                      lineHeight: "1.5",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      wordBreak: "break-word"
                    }}>
                      {node.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow Column */}
              {!isLast && (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#3F3F46" 
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16" />
                    <path d="m13 5 7 7-7 7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}