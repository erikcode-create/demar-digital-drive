import { TARGET_URL, computeStatus, computeScore } from "../lib/scanner.mjs";

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

async function fetchPSI(strategy) {
  const url = `${PSI_API}?url=${encodeURIComponent(TARGET_URL)}&strategy=${strategy}&category=performance&category=accessibility`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`PageSpeed API returned ${res.status}`);
  }
  return res.json();
}

function extractMetrics(data) {
  const audits = data.lighthouseResult?.audits || {};
  return {
    lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
    lcpScore: audits["largest-contentful-paint"]?.score ?? -1,
    fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
    fcpScore: audits["first-contentful-paint"]?.score ?? -1,
    cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
    clsScore: audits["cumulative-layout-shift"]?.score ?? -1,
    tbt: audits["total-blocking-time"]?.displayValue || "N/A",
    tbtScore: audits["total-blocking-time"]?.score ?? -1,
    ttfb: audits["server-response-time"]?.displayValue || "N/A",
    ttfbScore: audits["server-response-time"]?.score ?? -1,
    performanceScore: Math.round((data.lighthouseResult?.categories?.performance?.score || 0) * 100),
    renderBlocking: audits["render-blocking-resources"]?.details?.items?.length || 0,
    thirdParty: audits["third-party-summary"]?.details?.items?.length || 0,
  };
}

function scoreToStatus(score) {
  if (score >= 0.9) return "pass";
  if (score >= 0.5) return "warn";
  return "fail";
}

export async function run() {
  const checks = [];

  for (const strategy of ["mobile", "desktop"]) {
    try {
      const data = await fetchPSI(strategy);
      const m = extractMetrics(data);
      const label = strategy.charAt(0).toUpperCase() + strategy.slice(1);

      checks.push({
        name: `${label} Performance Score`,
        status: m.performanceScore >= 90 ? "pass" : m.performanceScore >= 50 ? "warn" : "fail",
        detail: `${m.performanceScore}/100`,
        confidence: "VERIFIED",
        reason: null,
      });

      checks.push({
        name: `${label} LCP`,
        status: scoreToStatus(m.lcpScore),
        detail: m.lcp,
        confidence: "VERIFIED",
        reason: null,
      });

      checks.push({
        name: `${label} FCP`,
        status: scoreToStatus(m.fcpScore),
        detail: m.fcp,
        confidence: "VERIFIED",
        reason: null,
      });

      checks.push({
        name: `${label} CLS`,
        status: scoreToStatus(m.clsScore),
        detail: m.cls,
        confidence: "VERIFIED",
        reason: null,
      });

      checks.push({
        name: `${label} TBT (proxy for INP)`,
        status: scoreToStatus(m.tbtScore),
        detail: m.tbt,
      });

      checks.push({
        name: `${label} TTFB`,
        status: scoreToStatus(m.ttfbScore),
        detail: m.ttfb,
      });

      if (strategy === "mobile") {
        if (m.renderBlocking > 0) {
          checks.push({
            name: "Render-Blocking Resources",
            status: "warn",
            detail: `${m.renderBlocking} render-blocking resources`,
          });
        } else {
          checks.push({ name: "Render-Blocking Resources", status: "pass", detail: "None detected" });
        }

        if (m.thirdParty > 3) {
          checks.push({
            name: "Third-Party Scripts",
            status: "warn",
            detail: `${m.thirdParty} third-party scripts loaded`,
          });
        } else {
          checks.push({
            name: "Third-Party Scripts",
            status: "pass",
            detail: `${m.thirdParty} third-party scripts`,
          });
        }
      }
    } catch (err) {
      checks.push({
        name: `${strategy} PageSpeed`,
        status: "warn",
        detail: `Could not fetch: ${err.message}`,
      });
    }
  }

  return {
    category: "Performance",
    status: computeStatus(checks),
    score: computeScore(checks),
    checks,
  };
}
