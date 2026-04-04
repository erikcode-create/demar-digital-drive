import { Client } from "basic-ftp";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const DEFAULT_LOCAL_PATH = join(__dirname, "dist/index.html");
const REMOTE_PATH = "/public_html/seo-dashboard/index.html";

/**
 * Upload dashboard HTML to GreenGeeks via FTP.
 */
export async function deployDashboard(opts = {}) {
  const localPath = opts.localPath || DEFAULT_LOCAL_PATH;
  const remotePath = opts.remotePath || REMOTE_PATH;
  const host = opts.host || process.env.FTP_SERVER;
  const user = opts.user || process.env.FTP_USERNAME;
  const password = opts.password || process.env.FTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error("FTP credentials not configured. Set FTP_SERVER, FTP_USERNAME, FTP_PASSWORD env vars.");
  }

  const client = new Client();
  client.ftp.verbose = false;

  try {
    await client.access({ host, user, password, secure: false });
    console.log(`[deploy] Connected to ${host}`);
    await client.ensureDir("/public_html/seo-dashboard");
    await client.uploadFrom(localPath, remotePath);
    console.log(`[deploy] Uploaded ${localPath} → ${remotePath}`);
  } finally {
    client.close();
  }
}

// CLI entrypoint
const isMain = process.argv[1] && process.argv[1].endsWith("deploy.mjs");
if (isMain) {
  deployDashboard()
    .then(() => console.log("[deploy] Done"))
    .catch((err) => {
      console.error("[deploy] Failed:", err.message);
      process.exit(1);
    });
}
