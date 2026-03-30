import "dotenv/config";
import crypto from "crypto";

const SITE_URL_ENCODED = "https%3A%2F%2Fdemartransportation.com";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEARCH_ANALYTICS_URL = `https://www.googleapis.com/webmasters/v3/sites/${SITE_URL_ENCODED}/searchAnalytics/query`;
const LINKS_URL = `https://www.googleapis.com/webmasters/v3/sites/${SITE_URL_ENCODED}/links`;
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

let cachedToken = null;
let tokenExpiry = 0;

function getServiceAccount() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set");
  return JSON.parse(json);
}

function base64url(data) {
  const str = typeof data === "string" ? data : data.toString("base64");
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createJWT(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64url(Buffer.from(JSON.stringify(header)).toString("base64"));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)).toString("base64"));
  const unsigned = `${headerB64}.${payloadB64}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = base64url(sign.sign(serviceAccount.private_key, "base64"));

  return `${unsigned}.${signature}`;
}

/**
 * Authenticate with Google using service account JWT.
 * Returns an access token. Caches the token until expiry.
 */
export async function authenticate() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const serviceAccount = getServiceAccount();
  const jwt = createJWT(serviceAccount);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google OAuth error: ${response.status} ${text}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function defaultStartDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

function defaultEndDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

/**
 * Query the Search Analytics API.
 * @param {Object} options
 * @param {string} options.startDate - YYYY-MM-DD
 * @param {string} options.endDate - YYYY-MM-DD
 * @param {string[]} options.dimensions - e.g. ["query"], ["page"], ["query", "page"]
 * @param {number} [options.rowLimit=1000] - max rows to return
 */
export async function getSearchAnalytics({ startDate, endDate, dimensions, rowLimit = 1000 }) {
  const token = await authenticate();

  const body = {
    startDate: startDate || defaultStartDate(28),
    endDate: endDate || defaultEndDate(),
    dimensions: dimensions || ["query"],
    rowLimit,
  };

  const response = await fetch(SEARCH_ANALYTICS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search Analytics API error: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Get backlinks from Google Search Console Links API.
 */
export async function getBacklinks() {
  const token = await authenticate();

  const response = await fetch(LINKS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Links API error: ${response.status} ${text}`);
  }

  return response.json();
}

/**
 * Get top queries for the last N days.
 * @param {number} [days=28]
 */
export async function getTopQueries(days = 28) {
  return getSearchAnalytics({
    startDate: defaultStartDate(days),
    endDate: defaultEndDate(),
    dimensions: ["query"],
    rowLimit: 1000,
  });
}

/**
 * Get top pages for the last N days.
 * @param {number} [days=28]
 */
export async function getTopPages(days = 28) {
  return getSearchAnalytics({
    startDate: defaultStartDate(days),
    endDate: defaultEndDate(),
    dimensions: ["page"],
    rowLimit: 1000,
  });
}
