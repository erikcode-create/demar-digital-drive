import { execSync, execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";

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

  // Write prompt to temp file, then pass via shell redirection to avoid escaping issues
  const tmpFile = path.join(tmpdir(), `claude-prompt-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  writeFileSync(tmpFile, prompt);

  try {
    const result = execFileSync("npx", [
      "-y", "@anthropic-ai/claude-code", "--print", "--model", modelId, "-p", prompt,
    ], {
      cwd: REPO_ROOT, encoding: "utf-8", timeout,
      env: { ...process.env, PATH: process.env.PATH },
      maxBuffer: 10 * 1024 * 1024,
    });
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.stdout || err.message };
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

export async function generateWithClaude(prompt, { model = "sonnet", timeout = 300000 } = {}) {
  const result = await invokeClaude(prompt, { model, timeout });
  if (!result.success) {
    throw new Error(`Claude generation failed: ${result.output}`);
  }
  return result.output;
}
