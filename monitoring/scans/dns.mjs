import { TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";
import dns from "node:dns/promises";
import https from "node:https";

const GITHUB_PAGES_IPS = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"];

function checkSSL(hostname) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ name: "SSL Certificate", status: "warn", detail: "SSL check timed out (10s)", confidence: "VERIFIED", reason: null });
    }, 10000);

    const req = https.request({ hostname, port: 443, method: "HEAD", timeout: 10000 }, (res) => {
      const cert = res.socket.getPeerCertificate();
      res.resume();
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

async function checkWhois(domain) {
  try {
    const whois = await import("whois");
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ name: "Domain Expiry", status: "warn", detail: "WHOIS lookup timed out (15s)", confidence: "UNABLE_TO_VERIFY", reason: "WHOIS server did not respond within timeout" });
      }, 15000);

      whois.lookup(domain, (err, data) => {
        clearTimeout(timeout);
        if (err || !data) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `WHOIS lookup failed: ${err?.message || "no data"}`, confidence: "UNABLE_TO_VERIFY", reason: "WHOIS query failed; cannot determine domain expiry" });
          return;
        }

        const expiryPatterns = [
          /Registry Expiry Date:\s*(.+)/i,
          /Expiration Date:\s*(.+)/i,
          /Expiry Date:\s*(.+)/i,
          /paid-till:\s*(.+)/i,
          /Registrar Registration Expiration Date:\s*(.+)/i,
        ];

        let expiryStr = null;
        for (const pattern of expiryPatterns) {
          const match = data.match(pattern);
          if (match) {
            expiryStr = match[1].trim();
            break;
          }
        }

        if (!expiryStr) {
          resolve({ name: "Domain Expiry", status: "warn", detail: "Could not parse expiry date from WHOIS", confidence: "UNABLE_TO_VERIFY", reason: "WHOIS response format not recognized for this registrar" });
          return;
        }

        const expiryDate = new Date(expiryStr);
        if (isNaN(expiryDate.getTime())) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `Unparseable date: ${expiryStr}`, confidence: "UNABLE_TO_VERIFY", reason: "WHOIS date format could not be parsed" });
          return;
        }

        const daysLeft = Math.floor((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 30) {
          resolve({ name: "Domain Expiry", status: "fail", detail: `Domain expires in ${daysLeft} days (${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        } else if (daysLeft < 60) {
          resolve({ name: "Domain Expiry", status: "warn", detail: `Domain expires in ${daysLeft} days (${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        } else {
          resolve({ name: "Domain Expiry", status: "pass", detail: `Domain valid for ${daysLeft} days (expires ${expiryDate.toISOString().split("T")[0]})`, confidence: "INFERRED", reason: "WHOIS data parsed from raw text; format varies by registrar" });
        }
      });
    });
  } catch {
    return { name: "Domain Expiry", status: "warn", detail: "whois module not available", confidence: "UNABLE_TO_VERIFY", reason: "whois npm package not installed or not loadable" };
  }
}

export async function run() {
  const checks = [];
  const hostname = new URL(TARGET_URL).hostname;

  // SSL certificate
  const sslCheck = await checkSSL(hostname);
  checks.push(sslCheck);

  // Domain expiry
  const whoisCheck = await checkWhois(hostname);
  checks.push(whoisCheck);

  // DNS resolution
  try {
    const addresses = await dns.resolve4(hostname);
    const matchesGitHub = addresses.some((ip) => GITHUB_PAGES_IPS.includes(ip));
    if (matchesGitHub) {
      checks.push({ name: "DNS Resolution", status: "pass", detail: `Resolves to GitHub Pages: ${addresses.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "DNS Resolution", status: "warn", detail: `Resolves to ${addresses.join(", ")} (not GitHub Pages IPs)`, confidence: "VERIFIED", reason: null });
    }
  } catch (err) {
    checks.push({ name: "DNS Resolution", status: "fail", detail: `DNS resolution failed: ${err.message}`, confidence: "VERIFIED", reason: null });
  }

  // CNAME check
  try {
    const cnames = await dns.resolveCname(hostname);
    const githubCname = cnames.some((c) => c.includes("github.io"));
    if (githubCname) {
      checks.push({ name: "CNAME Configuration", status: "pass", detail: `CNAME: ${cnames.join(", ")}`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "CNAME Configuration", status: "warn", detail: `CNAME: ${cnames.join(", ")} (expected *.github.io)`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "CNAME Configuration", status: "pass", detail: "No CNAME (using A records for apex domain)", confidence: "VERIFIED", reason: null });
  }

  // www redirect
  try {
    const wwwRes = await fetch(`https://www.${hostname}`, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    const location = wwwRes.headers.get("location") || "";
    if (wwwRes.status >= 300 && wwwRes.status < 400 && location.includes(hostname)) {
      checks.push({ name: "www Redirect", status: "pass", detail: `www.${hostname} redirects to ${location}`, confidence: "VERIFIED", reason: null });
    } else if (wwwRes.ok) {
      checks.push({ name: "www Redirect", status: "pass", detail: `www.${hostname} resolves (HTTP ${wwwRes.status})`, confidence: "VERIFIED", reason: null });
    } else {
      checks.push({ name: "www Redirect", status: "warn", detail: `www.${hostname} returned HTTP ${wwwRes.status}`, confidence: "VERIFIED", reason: null });
    }
  } catch {
    checks.push({ name: "www Redirect", status: "warn", detail: `www.${hostname} not reachable`, confidence: "VERIFIED", reason: null });
  }

  return { category: "DNS & Domain", status: computeStatus(checks), score: computeScore(checks), checks };
}
