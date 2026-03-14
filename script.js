/* =============================
   Navigation 
============================= */
function hamburg() {
  const navbar = document.querySelector(".dropdown");
  if (navbar) navbar.style.transform = "translateY(0px)";
}
function cancel() {
  const navbar = document.querySelector(".dropdown");
  if (navbar) navbar.style.transform = "translateY(-500px)";
}

/* =============================
   Typewriter 
============================= */
const texts = [
  "Cloud Engineer",
  "Support Analyst",
  "Support Engineer",
  "System Administrator",
];
let speed = 100;
const textElements = document.querySelector(".typewriter-text");
let textIndex = 0;
let charcterIndex = 0;

function typeWriter() {
  if (!textElements) return;
  if (charcterIndex < texts[textIndex].length) {
    textElements.innerHTML += texts[textIndex].charAt(charcterIndex);
    charcterIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, 1000);
  }
}
function eraseText() {
  if (!textElements) return;
  if (textElements.innerHTML.length > 0) {
    textElements.innerHTML = textElements.innerHTML.slice(0, -1);
    setTimeout(eraseText, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length;
    charcterIndex = 0;
    setTimeout(typeWriter, 500);
  }
}
window.onload = typeWriter;

/* =============================
   Visitor Counter (updated)
   - Uses your API Gateway endpoint only
   - JSON expected: { "count": <number> }
============================= */


const API_INVOKE_URL = "https://1rqnx854aj.execute-api.us-east-2.amazonaws.com/Prod/count";

/** Fetch helper with timeout to avoid hanging UI */
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 7000, ...opts } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, { ...opts, signal: controller.signal, cache: "no-store" });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/** Update the counter from API; return true if successful */
async function updateVisitorCountViaApiGateway() {
  const el = document.getElementById("visitor-count");
  if (!el) return false;

  try {
    const res = await fetchWithTimeout(API_INVOKE_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      timeout: 7000,
    });

    if (!res.ok) throw new Error(`API Gateway HTTP ${res.status}`);

    const data = await res.json();
    if (typeof data.count === "number" && Number.isFinite(data.count)) {
      el.textContent = data.count.toLocaleString();
      return true;
    }
    throw new Error("Invalid payload (missing 'count')");
  } catch (err) {
    console.error("Failed to fetch visitor count from API:", err);
    return false;
  }
}

/** Final, per‑browser fallback (only used if API fails) */
function updateVisitorCountViaLocalStorage() {
  const el = document.getElementById("visitor-count");
  if (!el) return;
  const key = "rm_portfolio_visit_count";
  const current = (parseInt(localStorage.getItem(key) || "0", 10) || 0) + 1;
  localStorage.setItem(key, String(current));
  el.textContent = `${current.toLocaleString()} (this browser)`;
}

/** On page load: try API → else localStorage fallback */
document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("visitor-count");
  if (el) el.textContent = "—"; // placeholder while loading

  const ok = await updateVisitorCountViaApiGateway();
  if (!ok) updateVisitorCountViaLocalStorage();
});