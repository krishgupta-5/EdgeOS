const fs = require('fs');

function processApiGenerate() {
  const path = 'app/api/generate/route.ts';
  let content = fs.readFileSync(path, 'utf8');

  // Remove TOKEN_BUDGET
  content = content.replace(/\s*references:\s*\d+,/g, '');

  // Remove Reference interface
  content = content.replace(/interface Reference \{[\s\S]*?\}/, '');

  // Remove from GenerateResult
  content = content.replace(/\s*references\?:\s*Reference\[\];/g, '');
  content = content.replace(/\s*references,/g, '');

  // Remove from RegenerateFlags
  content = content.replace(/\s*references:\s*boolean;/g, '');

  // Remove from detectChanges
  content = content.replace(/\s*references:\s*changed\.size\s*>\s*0,/g, '');

  // Remove REFERENCES_PROMPT
  content = content.replace(/const REFERENCES_PROMPT = `[\s\S]*?`;/, '');

  // Remove parseReferences function
  content = content.replace(/\/\/ ─────────────────────────────────────────────\n\/\/ References JSON parser\n\/\/ ─────────────────────────────────────────────\nfunction parseReferences[\s\S]*?\}\n/g, '');

  // Remove from callGroq variables & checks
  content = content.replace(/\s*let referencesResult:.*?null;/g, '');
  content = content.replace(/\s*let references = session\.lastResult\.references;/g, '');
  
  const referencesIfBlock = /if\s*\(flags\.references\)\s*\{[\s\S]*?references = parseReferences\(referencesResult\.content\);\s*\}/g;
  content = content.replace(referencesIfBlock, '');

  content = content.replace(/\s*if\s*\(flags\.references\s*&&\s*referencesResult\)\s*totalTokens\s*\+=\s*referencesResult\.tokens;/g, '');
  
  content = content.replace(/\s*if\s*\(references\)\s*\{[\s\S]*?userId\s*}\);?\s*\}/g, '');
  content = content.replace(/\s*if\s*\(references\.length\s*>\s*0\)\s*\{[\s\S]*?\}\n/g, '');
  
  // Remove step 6 blocks
  content = content.replace(/\s*\/\/ Step 6 — References[\s\S]*?const references = referencesRaw \? parseReferences\(referencesRaw\.content\) : \[\];/g, '');

  // Remove totalTokens deductions
  content = content.replace(/\s*\(referencesRaw\?\.tokens \?\? 0\) \+/g, '');

  fs.writeFileSync(path, content, 'utf8');
}

function processChatPanel() {
  const path = 'app/chat/components/ChatPanel.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // Remove type
  content = content.replace(/\s*references\?:\s*Reference\[\];/g, '');
  content = content.replace(/interface Reference \{[\s\S]*?\}/, '');
  content = content.replace(/ \| "references"/g, '');

  // Remove ReferenceViewer component completely 
  content = content.replace(/\/\/ ─────────────────────────────────────────────\n\/\/ References Viewer\n\/\/ ─────────────────────────────────────────────\nfunction ReferencesViewer[\s\S]*?\/\/ ─────────────────────────────────────────────/g, '// ─────────────────────────────────────────────');

  // Remove from arrays and logic
  content = content.replace(/,?\s*"references"/g, '');
  content = content.replace(/\s*references:\s*"REFS",/g, '');
  content = content.replace(/\s*case "references":.*?;/g, '');
  content = content.replace(/\s*if\s*\(lower\.includes\("reference"\)[\s\S]*?return "references";/g, '');
  content = content.replace(/\s*"Show References",?/g, '');
  content = content.replace(/\s*if\s*\(step\s*===\s*"references"\)\s*\{[\s\S]*?\}(?=\s*if\s*\(step\s*===\s*"apiDesign"\))/g, '');
  content = content.replace(/\s*if\s*\(language\s*===\s*"references"\)\s*return\s*<ReferencesViewer[^>]*>;/g, '');
  content = content.replace(/\s*\|\|\s*msg\.file\.language\s*===\s*"references"/g, '');
  content = content.replace(/\s*:\s*lastMsg\.file\?\.language\s*===\s*"references"\s*\?\s*"references"\s*as\s*Step/g, '');


  fs.writeFileSync(path, content, 'utf8');
}

processApiGenerate();
processChatPanel();
