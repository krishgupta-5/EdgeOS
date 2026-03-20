"use client";

import { useState } from "react";
import YAML from "yaml";

type Props = { data: { yaml: string; docker: string; recommendedDevice: string; }; };
type Tab = "pipeline" | "yaml" | "docker";

export default function YamlViewer({ data }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("yaml");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  let pipelineEdges: { from: string; to: string }[] = [];
  try {
    if (data.yaml && !data.yaml.includes("Error")) {
      const parsed = YAML.parse(data.yaml);
      if (parsed?.pipeline) {
        pipelineEdges = parsed.pipeline.map((line: string) => {
          const [from, to] = line.split("->").map((s: string) => s.trim());
          return { from, to };
        });
      }
    }
  } catch (e) { console.error("Pipeline parse error", e); }

  const groupBySource = (edges: { from: string; to: string }[]) => {
    const map: Record<string, string[]> = {};
    edges.forEach(({ from, to }) => {
      if (!map[from]) map[from] = [];
      map[from].push(to);
    });
    return map;
  };
  const grouped = groupBySource(pipelineEdges);

  // Professional SVG Icons mapped to pipeline steps
  const getStepIcon = (step: string) => {
    const baseClass = "w-4 h-4 opacity-70";
    if (step.includes("camera") || step.includes("video") || step.includes("ingestion")) {
      return <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
    }
    if (step.includes("inference") || step.includes("model")) {
      return <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
    }
    if (step.includes("data") || step.includes("storage")) {
      return <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
    }
    if (step.includes("api") || step.includes("cloud")) {
      return <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
    }
    // Fallback: Cog/Process
    return <svg className={baseClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  };

  const hasContent = (activeTab === "yaml" && data.yaml) || (activeTab === "docker" && data.docker);
  const activeContent = activeTab === "yaml" ? data.yaml : data.docker;

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#18181b] border border-slate-800 rounded-xl overflow-hidden shadow-xl font-sans">
      
      {/* IDE Tabs */}
      <div className="flex justify-between items-center bg-[#09090b] border-b border-[#27272a] pr-2 shrink-0">
        <div className="flex pt-2 px-2 gap-1">
          <button
            onClick={() => setActiveTab("yaml")}
            className={`px-4 py-2 text-[12px] font-mono rounded-t-lg transition-all border border-b-0 ${
              activeTab === "yaml" ? "bg-[#18181b] text-emerald-400 border-[#27272a] border-t-emerald-500/50" : "bg-transparent text-slate-500 border-transparent hover:bg-[#18181b]/50 hover:text-slate-300"
            }`}
          >
            <span className="mr-2 text-slate-600">YAML</span> edge-config.yaml
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`px-4 py-2 text-[12px] font-mono rounded-t-lg transition-all border border-b-0 ${
              activeTab === "docker" ? "bg-[#18181b] text-blue-400 border-[#27272a] border-t-blue-500/50" : "bg-transparent text-slate-500 border-transparent hover:bg-[#18181b]/50 hover:text-slate-300"
            }`}
          >
            <span className="mr-2 text-slate-600">DOCKER</span> docker-compose.yaml
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-4 py-2 text-[12px] font-mono rounded-t-lg transition-all border border-b-0 ${
              activeTab === "pipeline" ? "bg-[#18181b] text-purple-400 border-[#27272a] border-t-purple-500/50" : "bg-transparent text-slate-500 border-transparent hover:bg-[#18181b]/50 hover:text-slate-300"
            }`}
          >
             <span className="mr-2 text-slate-600">VISUAL</span> pipeline-flow
          </button>
        </div>
        
        {/* Hardware Badge (SVG Instead of Emoji) */}
        {data.recommendedDevice && (
          <div className="px-3 py-1 bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 rounded-full text-[10px] font-mono flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
            {data.recommendedDevice}
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-auto relative bg-[#18181b] p-4 lg:p-6 custom-scrollbar">
        
        {/* View: YAML */}
        {activeTab === "yaml" && (
          <div className="w-full">
            {!data.yaml ? (
              <div className="text-slate-600 text-[13px] font-mono flex items-center justify-center h-32">
                // Awaiting system generation...
              </div>
            ) : (
              <pre className="text-emerald-300/90 font-mono text-[13px] leading-relaxed tracking-wide">{data.yaml}</pre>
            )}
          </div>
        )}

        {/* View: DOCKER */}
        {activeTab === "docker" && (
          <div className="w-full">
            {!data.docker ? (
              <div className="text-slate-600 text-[13px] font-mono flex items-center justify-center h-32">
                // Docker compose will generate here...
              </div>
            ) : (
              <pre className="text-blue-300/90 font-mono text-[13px] leading-relaxed tracking-wide">{data.docker}</pre>
            )}
          </div>
        )}

        {/* View: PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="w-full h-full flex flex-col">
            {pipelineEdges.length === 0 ? (
              <div className="text-slate-600 text-[13px] font-mono flex items-center justify-center h-32">
                // No pipeline map detected in YAML...
              </div>
            ) : (
              <div className="flex flex-col gap-6 text-sm font-medium">
                {Object.entries(grouped).map(([from, targets], i) => (
                  <div key={i} className="flex items-center gap-4 flex-wrap">
                    {/* Source Node */}
                    <div className="px-4 py-2 bg-[#27272a] border border-[#3f3f46] text-slate-200 rounded-md shadow-sm flex items-center gap-2">
                      {getStepIcon(from)} 
                      <span className="font-mono text-[12px] uppercase tracking-wider">{from}</span>
                    </div>
                    {/* Arrow & Targets */}
                    <div className="flex gap-4 flex-wrap items-center">
                      <div className="h-[1px] w-8 bg-slate-700 relative">
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-y-[4px] border-y-transparent border-l-[5px] border-l-slate-500"></div>
                      </div>
                      <div className="flex gap-3">
                        {targets.map((to, j) => (
                          <div key={j} className="px-4 py-2 bg-indigo-900/20 border border-indigo-500/20 text-indigo-300 rounded-md shadow-sm flex items-center gap-2">
                            {getStepIcon(to)} 
                            <span className="font-mono text-[12px] uppercase tracking-wider">{to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* IDE Status Bar (Footer) */}
      <div className="h-10 shrink-0 bg-[#09090b] border-t border-[#27272a] flex items-center justify-between px-4">
        <div className="text-[#a1a1aa] text-[11px] font-mono flex items-center gap-3">
          {data.yaml ? (
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Validated</span>
          ) : (
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Idle</span>
          )}
          <span>UTF-8</span>
        </div>

        {hasContent && (
          <div className="flex gap-2">
            <button
              onClick={() => copyToClipboard(activeContent)}
              className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              {copied ? "Copied to Clipboard" : "Copy Source"}
            </button>
            <button
              onClick={() => downloadFile(activeContent, `${data.recommendedDevice || "edge"}-${activeTab === "yaml" ? "config" : "docker-compose"}.yaml`)}
              className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
            >
              Export {activeTab === "yaml" ? "YAML" : "Docker"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}