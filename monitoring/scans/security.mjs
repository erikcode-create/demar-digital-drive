import { fetchHeaders, TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";
import https from "node:https";

const REQUIRED_HEADERS = [
  { name: "strict-transport-security", label: "HSTS" },
  { name: "x-frame-options", label: "X-Frame-Options" },
  { name: "x-content-type-options", label: "X-Content-Type-Options" },
  { name: "referrer-policy", label: "Referrer-Policy" },
  { name: "content-security-policy", label: "Content-Security-Policy" },
  { name: "permissions-policy", label: "Permissions-Policy" },
];

const WARN_HEADERS = [
  { name: "x-powered-by", label: "X-Powered-By Exposure", shouldBeAbsent: true },
];

const SENSITIVE_PATHS = [
  "/.env",
  "/.env.local",
  "/.git/config",
  "/source.map",
  "/main.js.map",
];

function checkSSL(hostname) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ name: "SSL Certificate", status: "warn", detail: "SSL check timed out (10s)", confidence: "VERIFIED", reason: null });
    }, 10000);

    const req = https.request({ hostname, port: 443, method: "HEAD", timeout: 10000 }, (res) => {
      const cert = res.socket.getPeerCertificate();
      res.resume(); // consume response to free socket
      clearTimeout(timeout);
      if (!cert || !cert.valid_to) {
        resolve({ name: "SSL Certificate", status: "fail", detail: "Could not read certificate", confidence: "VERIFIED", reason: null });
        return;
      }
      const expiryDate = new Date(cert.valid_to);
      const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 7) {
        resolve({ name: "SSL Certificate", status: "fail", detail: `Expires in ${daysLeft} days (${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      } else if (daysLeft < 30) {
        resolve({ name: "SSL Certificate", status: "warn", detail: `Expires in ${daysLeft} days (${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      } else {
        resolve({ name: "SSL Certificate", status: "pass", detail: `Valid for ${daysLeft} days (expires ${cert.valid_to})`, confidence: "VERIFIED", reason: null });
      }
    });
    req.on("timeout", () => {
      req.destroy();
      clearTimeout(timeout);
      resolve({ name: "SSL Certificate", status: "warn", detail: "SSL check timed out", confidence: "VERIFIED", reason: null });
    });
    req.on("error", () => {
      clearTimeout(timeout);
      resolve({ name: "SSL Certificate", status: "fail", detail: "SSL connection failed", confidence: "VERIFIED", reason: null });
    });
    req.end();
  });
}

export async function run() {
  const checks = [];

  // Security headers
  const { headers } = await fetchHeaders();

  for (const { name, label } of REQUIRED_HEADERS) {
    const value = headers[name];
    if (value) {
      checks.push({ name: label, status: "pass", detail: value, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: label, status: "fail", detail: `Missing ${label} header`, confidence: "VERIFIED", reason: null });
    }
  }

  for (const { name, label, shouldBeAbsent } of WARN_HEADERS) {
    const value = headers[name];
    if (shouldBeAbsent && value) {
      checks.push({ name: label, status: "warn", detail: `Exposed: ${value}`, confidence: "VERIFIED", reason: null });
    } else if (shouldBeAbsent && !value) {
      checks.push({ name: label, status: "pass", detail: "Not exposed", confidence: "VERIFIED", reason: null });
    }
  }

  // HTTPS redirect
  try {
    const httpRes = await fetch(`http://demartransportation.com`, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    const location = httpRes.headers.get("location") || "";
    if (location.startsWith("https://")) {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "pass", detail: `Redirects to ${location}` });
    } else {
      checks.push({ name: "HTTP→HTTPS Redirect", status: "fail", detail: "No HTTPS redirect found" });
    }
  } catch {
    checks.push({ name: "HTTP→HTTPS Redirect", status: "warn", detail: "Could not test HTTP redirect" });
  }

  // SSL certificate
  const hostname = new URL(TARGET_URL).hostname;
  const sslCheck = await checkSSL(hostname);
  checks.push(sslCheck);

  // Exposed sensitive files
  for (const path of SENSITIVE_PATHS) {
    try {
      const res = await fetch(`${TARGET_URL}${path}`, { redirect: "follow", signal: AbortSignal.timeout(10000) });
      if (res.status === 200) {
        checks.push({ name: `Exposed: ${path}`, status: "fail", detail: `${path} is publicly accessible (HTTP 200)` });
      } else {
        checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} returns ${res.status}` });
      }
    } catch {
      checks.push({ name: `Exposed: ${path}`, status: "pass", detail: `${path} not reachable` });
    }
  }

  return {
    category: "Security",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
