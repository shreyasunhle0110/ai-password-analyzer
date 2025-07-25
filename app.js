// app.js – client-side logic for AI-Aware Password Strength Analyzer

// Utility: debounce with cancel support
function debounce(fn, delay = 500) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

// Utility: SHA-1 hash (hex) using Web Crypto API
async function sha1Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// DOM elements
const pwdInput = document.getElementById('pwd');
const togglePwd = document.getElementById('togglePwd');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
const crackTimeEl = document.getElementById('crackTime');
const breachStatusEl = document.getElementById('breachStatus');
const aiInsightsEl = document.getElementById('aiInsights');
const suggestionsEl = document.getElementById('suggestions');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

// Color mapping for zxcvbn score 0-4 using design system colors
const scoreColors = [
  'var(--color-gray-300)', // 0 – Very weak
  'var(--color-red-500)', // 1 – Weak
  'var(--color-warning)', // 2 – Fair
  'var(--color-success)', // 3 – Strong
  'var(--color-primary)'  // 4 – Very strong
];
const scoreLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

let latestPwd = '';

// Show toast message
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

// Update UI based on zxcvbn result
function updateStrengthUI(result) {
  const score = result.score; // 0-4
  const pct = ((score + 1) / 5) * 100; // 20-100%
  strengthFill.style.width = `${pct}%`;
  strengthFill.style.backgroundColor = scoreColors[score];
  strengthLabel.textContent = `${scoreLabels[score]} (${score}/4)`;
  crackTimeEl.textContent = result.crack_times_display.offline_fast_hashing_1e10_per_second;

  // Suggestions
  suggestionsEl.innerHTML = '';
  const { suggestions } = result.feedback;
  if (suggestions && suggestions.length) {
    suggestions.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      suggestionsEl.appendChild(li);
    });
  }

  // AI Insights based on sequence
  aiInsightsEl.innerHTML = '';
  result.sequence.forEach(seq => {
    const li = document.createElement('li');
    let msg = '';
    switch (seq.pattern) {
      case 'dictionary':
        msg = `Contains dictionary word “${seq.token}” which language models can guess easily.`;
        break;
      case 'date':
        msg = `Includes date “${seq.token}”, often found in public records.`;
        break;
      case 'repeat':
        msg = `Repeats pattern “${seq.token}” making it predictable.`;
        break;
      case 'sequence':
        msg = `Sequential characters “${seq.token}” are trivial to predict.`;
        break;
      case 'regex':
        msg = `Common pattern “${seq.token}” detected.`;
        break;
      case 'spatial':
        msg = `Keyboard walk “${seq.token}” is weak against AI guessing.`;
        break;
      default:
        return; // Skip other patterns
    }
    li.textContent = msg;
    aiInsightsEl.appendChild(li);
  });
}

// Client-side HIBP k-anonymity check
async function checkBreachStatus(pwd) {
  const hashHex = await sha1Hex(pwd);
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);
  const url = `https://api.pwnedpasswords.com/range/${prefix}`;
  const res = await fetch(url, {
    headers: {
      'Add-Padding': 'true',
      'User-Agent': 'PasswordStrengthAnalyzer/1.0'
    }
  });
  if (!res.ok) throw new Error('HIBP request failed');
  const text = await res.text();
  const lines = text.split('\n');
  for (const line of lines) {
    const [hashSuffix, countStr] = line.trim().split(':');
    if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
      return { breached: true, count: parseInt(countStr, 10) };
    }
  }
  return { breached: false, count: 0 };
}

// Debounced breach check
const debouncedBreachCheck = debounce(async pwd => {
  try {
    const data = await checkBreachStatus(pwd);
    updateBreachUI(data);
  } catch (err) {
    console.error(err);
    breachStatusEl.className = 'status status--error';
    breachStatusEl.textContent = 'Error checking breaches. Try again later.';
  }
});

// Update breach status UI
function updateBreachUI({ breached, count }) {
  if (breached) {
    breachStatusEl.className = 'status status--warning';
    breachStatusEl.textContent = `⚠ Pwned ${count.toLocaleString()} times! Consider a unique password.`;
  } else {
    breachStatusEl.className = 'status status--success';
    breachStatusEl.textContent = '✓ Secure – not found in public breaches.';
  }
}

// Main input handler
pwdInput.addEventListener('input', e => {
  const pwd = e.target.value;
  latestPwd = pwd;

  copyBtn.disabled = pwd.length === 0;

  if (!pwd) {
    // Reset UI
    strengthFill.style.width = '0%';
    strengthFill.style.backgroundColor = 'var(--color-secondary)';
    strengthLabel.textContent = '';
    crackTimeEl.textContent = '–';
    aiInsightsEl.innerHTML = '';
    suggestionsEl.innerHTML = '';
    debouncedBreachCheck.cancel();
    breachStatusEl.className = 'status status--info';
    breachStatusEl.textContent = 'Waiting…';
    return;
  }

  const result = window.zxcvbn(pwd);
  updateStrengthUI(result);
  debouncedBreachCheck(pwd);
});

// Clipboard copy
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(latestPwd);
    showToast('Password copied to clipboard');
  } catch {
    showToast('Unable to copy');
  }
});

// Password visibility toggle
togglePwd.addEventListener('click', () => {
  const isPassword = pwdInput.type === 'password';
  pwdInput.type = isPassword ? 'text' : 'password';
  togglePwd.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  togglePwd.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
  togglePwd.innerHTML = isPassword ? '🙈' : '👁️';
});
