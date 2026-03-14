
function hamburg(){
  const navbar = document.querySelector(".dropdown")
  navbar.style.transform = "translateY(0px)"
}
function cancel(){
  const navbar = document.querySelector(".dropdown")
  navbar.style.transform = "translateY(-500px)"
}

// for Typewriter effect
const texts = [
  "Cloud Engineer",
  "Support Analyst",
  "Support Engineer",
  "System Administrator",
]
let speed = 100;
const textElements = document.querySelector(".typewriter-text")
let textIndex = 0;
let charcterIndex = 0;

function typeWriter() {
  if(charcterIndex < texts[textIndex].length){
    textElements.innerHTML += texts[textIndex].charAt(charcterIndex);
    charcterIndex++;
    setTimeout(typeWriter, speed);
  }
  else{
    setTimeout(eraseText, 1000)
  }
}
function eraseText() {
  if(textElements.innerHTML.length > 0){
    textElements.innerHTML = textElements.innerHTML.slice(0,-1)
    setTimeout(eraseText, 50)
  }
  else{
    textIndex = (textIndex + 1) % texts.length;
    charcterIndex = 0;
    setTimeout(typeWriter,500)
  }
}
window.onload = typeWriter;

// -------------------- Visitor Counter --------------------
// This script implements a multi-tiered visitor counter for the portfolio website, using:
// 1) API Gateway (global, authoritative)
// 2) CountAPI (global fallback)
// 3) LocalStorage (per-browser final fallback)

// 1) API Gateway (expects {"count": <number>})
const API_INVOKE_URL = 'https://jlqtk7lq1c.execute-api.us-east-2.amazonaws.com/prod/count';

async function updateVisitorCountViaApiGateway() {
  const el = document.getElementById('visitor-count');
  if (!el) return false;

  try {
    const res = await fetch(API_INVOKE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error(`API Gateway HTTP ${res.status}`);
    const data = await res.json();

    if (typeof data.count === 'number') {
      el.textContent = data.count.toLocaleString();
      return true;
    }
  } catch (e) {
    // console.error('API Gateway counter failed:', e);
  }
  return false;
}

// 2) CountAPI Fallback (Global)
async function updateVisitorCountViaCountApi() {
  const el = document.getElementById('visitor-count');
  if (!el) return false;

  const namespace = 'ron-mercier101.com';
  const key = 'portfolio_visits';

  try {
    // Ensure the counter exists (CountAPI returns 200 even if it already exists, so this is safe to call every time)
    await fetch(
      `https://api.countapi.xyz/create?namespace=${encodeURIComponent(namespace)}&key=${encodeURIComponent(key)}&value=0`,
      { method: 'GET' }
    );

    // Hit the counter to increment and get the new value
    const res = await fetch(
      `https://api.countapi.xyz/hit/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`
    );
    if (!res.ok) throw new Error(`CountAPI HTTP ${res.status}`);

    const data = await res.json();
    if (typeof data.value === 'number') {
      el.textContent = data.value.toLocaleString();
      return true;
    }
  } catch (e) {
    // console.error('CountAPI counter failed:', e);
  }
  return false;
}

// 3) LocalStorage Final Fallback (Per Browser)
function updateVisitorCountViaLocalStorage() {
  const el = document.getElementById('visitor-count');
  if (!el) return;

  const key = 'rm_portfolio_visit_count';
  const current = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(current));
  el.textContent = `${current.toLocaleString()} (this browser)`;
}

// On page load, attempt to update the visitor count using the three methods in order of reliability
document.addEventListener('DOMContentLoaded', async () => {
  const el = document.getElementById('visitor-count');
  if (el) el.textContent = '—'; // placeholder while loading

  // First try API Gateway (authoritative global count)
  let ok = await updateVisitorCountViaApiGateway();

  // If API Gateway fails, try CountAPI (global fallback)
  if (!ok) {
    ok = await updateVisitorCountViaCountApi();
  }

  // If both API Gateway and CountAPI fail, fall back to LocalStorage (per-browser count)
  if (!ok) {
    updateVisitorCountViaLocalStorage();
  }
});
