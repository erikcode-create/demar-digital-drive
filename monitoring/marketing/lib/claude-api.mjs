import { execSync, execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

const MODELS = {
  haiku: "claude-haiku-4-5-20251001",
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
};

export async function invokeClaude(prompt, { model = "sonnet", timeout = 300000 } = {}) {
  const modelId = MODELS[model] || MODELS.sonnet;

  console.log(`[claude-api] Using model: ${model} (${modelId})`);

  // Pass prompt via stdin to avoid argument parsing issues with --disallowedTools.
  // Disable file-writing tools so --print mode returns code to stdout only.
  try {
    const result = execFileSync("npx", [
      "-y", "@anthropic-ai/claude-code",
      "--print",
      "--model", modelId,
      "--disallowedTools", "Write,Edit,Bash,NotebookEdit",
    ], {
      cwd: REPO_ROOT, encoding: "utf-8", timeout,
      input: prompt,
      env: { ...process.env, PATH: process.env.PATH },
      maxBuffer: 10 * 1024 * 1024,
    });
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.stdout || err.message };
  }
}

export async function generateWithClaude(prompt, { model = "sonnet", timeout = 300000 } = {}) {
  const result = await invokeClaude(prompt, { model, timeout });
  if (!result.success) {
    throw new Error(`Claude generation failed: ${result.output}`);
  }
  return result.output;
}
