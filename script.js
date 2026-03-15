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
   Visitor Counter
   - Uses API Gateway endpoint that returns JSON: { "count": <number> }
============================= */
const API_INVOKE_URL = "https://1rqnx854aj.execute-api.us-east-2.amazonaws.com/count";

/** Fetch helper with timeout to avoid hanging UI */
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 7000, ...opts } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, {
      ...opts,
      signal: controller.signal,
      cache: "no-store",
    });
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

/* =============================
   "Let's Chat" button -> mailto:
============================= */
function wireLetsChatButton() {
  const btn = document.getElementById("lets-chat-btn");
  if (!btn) return;

  const TO_EMAIL = "rmerc147@proton.me";
  const SUBJECT = "Hello Ron!";
  const BODY = [
    "Hi Ron,",
    "",
    "I'd love to connect about ...",
    "",
    "Thanks,",
  ].join("\n");

  btn.addEventListener("click", () => {
    const subject = encodeURIComponent(SUBJECT);
    const body = encodeURIComponent(BODY);
    // This will open the user's default mail client (or webmail handler)
    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
  });
}

/* =============================
   On page load: initialize features
============================= */
document.addEventListener("DOMContentLoaded", async () => {
  // Visitor counter
  const counterEl = document.getElementById("visitor-count");
  if (counterEl) counterEl.textContent = "—"; // placeholder while loading
  const ok = await updateVisitorCountViaApiGateway();
  if (!ok) updateVisitorCountViaLocalStorage();

  // Wire up Let's Chat
  wireLetsChatButton();
});