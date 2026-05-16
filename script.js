// === MOBILE MENU ===
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function closeMenu() {
  hamburger.classList.remove('active');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}
function openMenu() {
  hamburger.classList.add('active');
  sidebar.classList.add('open');
  overlay.classList.add('show');
}
hamburger.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.sidebar-nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// === NAV ACTIVE STATE ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });
sections.forEach(s => navObserver.observe(s));

// === FADE-IN ===
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-section').forEach(el => fadeObserver.observe(el));

// === PROJECT FILTER ===
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category').split(' ').includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// === FORM VALIDATION & SUBMIT ===
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const successName = document.getElementById('successName');
const resetLink = document.getElementById('resetForm');
const toast = document.getElementById('toast');
const serviceBtns = document.querySelectorAll('#serviceGrid button');
const serviceHidden = document.getElementById('serviceValue');

serviceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    serviceBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    serviceHidden.value = btn.getAttribute('data-value');
  });
});

// Mobile service select sync
const mobileSelect = document.getElementById('serviceSelectMobile');
if (mobileSelect) {
  mobileSelect.addEventListener('change', () => {
    serviceHidden.value = mobileSelect.value;
  });
}

// === HIRE CARD HOVER ===
document.querySelectorAll('.hire-card-new').forEach(card => {
  const accent = card.getAttribute('data-accent');
  const arrow = card.querySelector('.hire-arrow');
  const origBorder = card.style.borderColor;
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-3px)';
    card.style.borderColor = accent;
    if (arrow) arrow.style.color = accent;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.borderColor = origBorder;
    if (arrow) arrow.style.color = '';
  });
});

// === TABBED SERVICES ===
(function() {
  const tabs = document.querySelectorAll('.tbtn');
  const panels = document.querySelectorAll('.tpanel');
  const tabColors = ['rgba(124,58,237,0.25)','rgba(37,99,235,0.2)','rgba(139,92,246,0.2)','rgba(16,185,129,0.15)','rgba(239,68,68,0.15)','rgba(251,191,36,0.12)'];
  const tabBorders = ['#7c3aed','#2563eb','#a78bfa','#10b981','#ef4444','#fbbf24'];
  const tabText = ['#a78bfa','#60a5fa','#a78bfa','#34d399','#f87171','#fbbf24'];

  function switchTab(index, clickedBtn) {
    panels.forEach((p, i) => {
      p.style.display = i === index ? 'block' : 'none';
    });
    tabs.forEach(b => {
      b.style.background = 'transparent';
      b.style.borderColor = 'rgba(255,255,255,0.1)';
      b.style.color = 'rgba(255,255,255,0.38)';
    });
    clickedBtn.style.background = tabColors[index];
    clickedBtn.style.borderColor = tabBorders[index];
    clickedBtn.style.color = tabText[index];
  }

  if (tabs.length > 0) {
    switchTab(0, tabs[0]);
    tabs.forEach((btn, i) => {
      btn.addEventListener('click', () => switchTab(i, btn));
    });
  }
})();

resetLink.addEventListener('click', () => {
  form.reset();
  formSuccess.classList.remove('show');
  form.style.display = '';
  serviceBtns.forEach(b => b.classList.remove('active'));
  serviceHidden.value = '';
  document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(f => {
    f.classList.remove('error', 'valid'); f.classList.remove('has-value');
    const err = f.parentElement.querySelector('.field-error');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
  });
  sg.classList.remove('error');
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstInvalid = null;

  const fields = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('email'),
    document.getElementById('budget'),
    document.getElementById('timeline'),
    document.getElementById('message')
  ];

  const sgGroup = sg.closest('.form-group-c');
  const sgErr = sgGroup.querySelector('.field-error');
  if (!serviceHidden.value) {
    sg.classList.add('error');
    if (sgErr) { sgErr.textContent = 'Please select a service'; sgErr.classList.add('show'); }
    if (!firstInvalid) firstInvalid = sg;
  } else { sg.classList.remove('error'); if (sgErr) sgErr.classList.remove('show'); }

  let allValid = true;
  fields.forEach(f => {
    if (!validateField(f)) { allValid = false; if (!firstInvalid) firstInvalid = f; }
  });

  if (!allValid || !serviceHidden.value) {
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstInvalid.focus) firstInvalid.focus({ preventScroll: true });
    }
    return;
  }

  const btn = form.querySelector('.submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span><span class="btn-text">Sending…</span>';

  const data = {
    firstName: fields[0].value.trim(),
    lastName: fields[1].value.trim(),
    email: fields[2].value.trim(),
    service: serviceHidden.value,
    budget: document.getElementById('budget').value,
    timeline: document.getElementById('timeline').value,
    message: fields[5].value.trim()
  };

  fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    if (res.ok) {
      successName.textContent = `Talk soon, ${data.firstName}!`;
      form.style.display = 'none';
      formSuccess.classList.add('show');
    } else {
      throw new Error('Send failed');
    }
  }).catch(() => {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    showToast('Something went wrong. Please try again.');
  });
});

// === LIVE IST CLOCK ===
function updateClock() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 3600000);
  const h = String(ist.getHours()).padStart(2, '0');
  const m = String(ist.getMinutes()).padStart(2, '0');
  const s = String(ist.getSeconds()).padStart(2, '0');
  document.getElementById('clockTime').textContent = `${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

// === CASE STUDIES MOBILE SLIDER ===
(function() {
  const track = document.getElementById('caseSliderTrack');
  const dotsContainer = document.getElementById('caseDots');
  const counter = document.getElementById('caseCounter');
  const prevBtn = document.getElementById('casePrev');
  const nextBtn = document.getElementById('caseNext');
  const hint = document.getElementById('caseSwipeHint');
  if (!track) return;

  const slides = track.querySelectorAll('.case-slide');
  const total = slides.length;
  let current = 0;
  let startX = 0;
  let hasSwiped = false;

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'case-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.case-dot');

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    counter.textContent = (current + 1) + ' / ' + total;
    // Hide hint on first swipe
    if (!hasSwiped) { hasSwiped = true; hint.classList.add('hidden'); }
  }

  // Arrow buttons
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
  }, { passive: true });

  // Auto-hide hint after 4s
  setTimeout(() => { if (!hasSwiped) hint.classList.add('hidden'); }, 4000);
})();

// === CLOSE MOBILE MENU ON RESIZE ===
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && sidebar.classList.contains('open')) closeMenu();
});

// === CHATBOT ===
const chatToggle = document.getElementById('chatToggle');
const chatPopup = document.getElementById('chatPopup');
const chatBody = document.getElementById('chatBody');
const chatPreview = document.getElementById('chatPreview');
const previewClose = document.getElementById('previewClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

setTimeout(() => {
  if (!chatPopup.classList.contains('open')) chatPreview.classList.add('show');
}, 2500);

previewClose.addEventListener('click', (e) => { e.stopPropagation(); chatPreview.classList.remove('show'); });
chatPreview.addEventListener('click', () => { chatPreview.classList.remove('show'); openChat(); });
chatToggle.addEventListener('click', () => {
  if (chatPopup.classList.contains('open')) closeChat();
  else { chatPreview.classList.remove('show'); openChat(); }
});

function openChat() { chatPopup.classList.add('open'); chatToggle.classList.add('open'); chatBody.scrollTop = chatBody.scrollHeight; }
function closeChat() { chatPopup.classList.remove('open'); chatToggle.classList.remove('open'); }

function addUserMessage(text) {
  const m = document.createElement('div'); m.className = 'chat-msg user'; m.textContent = text;
  chatBody.appendChild(m); chatBody.scrollTop = chatBody.scrollHeight;
}
function addBotMessage(html) {
  const m = document.createElement('div'); m.className = 'chat-msg bot'; m.innerHTML = html;
  chatBody.appendChild(m); chatBody.scrollTop = chatBody.scrollHeight;
}

const qa = [
  { kw: ['service','pricing','price','cost','package','starter','growth','pro','how much'], res: '📋 <b>Services & Pricing</b><br><br>✦ <b>Starter — $69</b> (Landing page, HTML/CSS/JS, 3 revisions)<br>✦ <b>Growth — $229</b> (React site, API, CMS, Auth, 5 revisions) ← Popular<br>✦ <b>Pro — $499</b> (Full stack MERN, AI features, unlimited revisions)<br><br>All include mobile responsive & fast delivery. <a href="#services" style="color:#a78bfa;">View full details →</a>' },
  { kw: ['portfolio','project','work','built','show','case','example'], res: '💼 <b>My Projects</b><br><br>🔹 AI-Powered Thumbnail Generator (React)<br>🔹 Luxury Restaurant Website (React)<br>🔹 Multi-Specialty Healthcare (HTML/CSS)<br>🔹 Freelancer Portfolio Website (React)<br><br>Check the <a href="#projects" style="color:#a78bfa;">Projects section →</a> or <a href="#casestudies" style="color:#a78bfa;">Case Studies →</a> for detailed results.' },
  { kw: ['contact','hire','book','call','project inquiry','message','reach'], res: '📬 <b>Let\'s work together!</b><br><br>Fill out the <a href="#contact" style="color:#a78bfa;">contact form</a> with your project details and I\'ll reply within 4 hours.<br><br>Or email me directly at <b>hello@veltrix.dev</b>' },
  { kw: ['about','who','developer','experience','skill','tech stack','react','next'], res: '👨‍💻 <b>About Me</b><br><br>I\'m a frontend developer specializing in React, Next.js, and modern JavaScript. I build high-performance web apps — from AI tools to luxury brand experiences.<br><br>⚛️ React · Next.js · JavaScript · Node.js · Figma<br><br>12+ projects delivered for 8+ clients worldwide.' },
  { kw: ['availability','available','time','turnaround','delivery','when','how long'], res: '⏱ <b>Availability & Delivery</b><br><br>✅ Open for new projects — May 2026<br>⚡ Most projects delivered in 48–72hrs<br>📦 Starter: 2–3 days · Growth: 5–7 days · Pro: 10–15 days<br><br>I\'m currently taking 2 projects for this month.' },
  { kw: ['tech','stack','technology','html','css','javascript','js','tailwind','figma'], res: '🛠 <b>My Tech Stack</b><br><br>⚛️ React · Next.js<br>💛 JavaScript (ES6+)<br>🎨 HTML5 · CSS3 · Tailwind CSS<br>🟢 Node.js<br>🖌 Figma (design to code)<br>🔗 REST APIs · Firebase · Git' },
  { kw: ['hello','hi','hey','good morning','good evening','help','start'], res: 'Hey there! 👋 I\'m Veltrix AI. Here\'s what I can help you with:<br><br>📋 <b>Services & Pricing</b><br>💼 <b>My Portfolio</b><br>📬 <b>Contact & Hire</b><br>👨‍💻 <b>About Me</b><br><br>Just type your question or pick an option above!' },
  { kw: ['thanks','thank','appreciate'], res: 'You\'re welcome! 🙌 Feel free to reach out anytime. I\'m here to help!' },
  { kw: ['cost','price','budget','afford','cheap','expensive','dollar','$'], res: '💰 <b>Pricing Overview</b><br><br>✦ Landing Pages — From $60<br>✦ Portfolio Sites — From $75<br>✦ Business Sites — From $100<br>✦ React Web Apps — From $200<br>✦ AI-Powered Apps — From $350<br>✦ Figma to Code — From $50<br><br>Packages start at <b>$69</b>. <a href="#services" style="color:#a78bfa;">See all pricing →</a>' }
];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const item of qa) {
    if (item.kw.some(k => lower.includes(k))) return item.res;
  }
  return '🤔 I\'m not sure I understand. Could you try asking about my <b>services</b>, <b>portfolio</b>, <b>pricing</b>, or <b>availability</b>? Or pick an option from the menu!';
}

function showMenu() {
  addBotMessage('Hi there! 👋 I\'m Veltrix AI. I can help you:<div class="msg-options"><button data-chat="services">📋 View services & pricing</button><button data-chat="portfolio">💼 See my portfolio</button><button data-chat="book">📅 Book a discovery call</button><button data-chat="question">❓ Ask me anything</button></div>');
}

function handleSend() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  addUserMessage(text);
  setTimeout(() => { addBotMessage(getResponse(text)); }, 400);
}

chatSend.addEventListener('click', handleSend);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-chat]');
  if (!btn) return;
  const action = btn.getAttribute('data-chat');
  if (!chatPopup.classList.contains('open')) { chatPreview.classList.remove('show'); openChat(); }
  if (action === 'services') {
    addUserMessage('Show me your services and pricing');
    setTimeout(() => { addBotMessage(qa[0].res); }, 500);
  } else if (action === 'portfolio') {
    addUserMessage('Show me your portfolio');
    setTimeout(() => { addBotMessage(qa[1].res); }, 500);
  } else if (action === 'book') {
    addUserMessage('I\'d like to book a discovery call');
    setTimeout(() => { addBotMessage(qa[2].res); }, 500);
  } else if (action === 'question') {
    addUserMessage('I have a question');
    setTimeout(() => { addBotMessage('Sure! Ask me anything about my services, pricing, tech stack, availability, or past projects. I\'m here to help! 😊'); }, 500);
  }
});

// === TYPEWRITER ===
const typeWords = ['React Apps', 'Landing Pages', 'SaaS Products', 'Web Experiences', 'Portfolio Websites'];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriterText');

function typeEffect() {
  const current = typeWords[wordIdx];
  if (!isDeleting) {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
      return;
    }
    setTimeout(typeEffect, 80);
  } else {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % typeWords.length;
      setTimeout(typeEffect, 300);
      return;
    }
    setTimeout(typeEffect, 40);
  }
}
typeEffect();

// === ANIMATED GRID BACKGROUND ===
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let animId;
let time = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawGrid() {
  const w = canvas.width;
  const h = canvas.height;
  const cellSize = 52;
  const centerX = w / 2;
  const centerY = h / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  ctx.clearRect(0, 0, w, h);

  // radial glow
  const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxDist * 0.6);
  grad.addColorStop(0, 'rgba(124,58,237,0.08)');
  grad.addColorStop(0.4, 'rgba(99,48,214,0.05)');
  grad.addColorStop(1, 'rgba(11,11,19,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const scrollX = (time * 0.15) % cellSize;
  const scrollY = (time * 0.10) % cellSize;

  const cols = Math.ceil(w / cellSize) + 1;
  const rows = Math.ceil(h / cellSize) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const gx = c * cellSize + scrollX - cellSize;
      const gy = r * cellSize + scrollY - cellSize;

      const cx = gx + cellSize / 2;
      const cy = gy + cellSize / 2;
      const dist = Math.sqrt((cx - centerX) ** 2 + (cy - centerY) ** 2);
      const distNorm = Math.min(dist / (maxDist * 0.7), 1);

      const wave = 0.5 + 0.5 * Math.sin(dist * 0.02 - time * 0.008);
      const pulse = 0.08 + 0.06 * wave * (1 - distNorm * 0.5);

      ctx.strokeStyle = `rgba(124,58,237,${pulse})`;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(gx + 1, gy + 1, cellSize - 2, cellSize - 2);
    }
  }

  time++;
  animId = requestAnimationFrame(drawGrid);
}

drawGrid();

function pickService(value) {
  setTimeout(() => {
    document.querySelectorAll('#serviceGrid button')
      .forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(
      '#serviceGrid button[data-value="' + value + '"]'
    );
    if (btn) {
      btn.classList.add('active');
      const hidden = document.getElementById('serviceValue');
      if (hidden) hidden.value = value;
    }
    checkRushFee();
  }, 500);
}

function checkRushFee() {
  const timeline = document.getElementById('timeline');
  const service = document.getElementById('serviceValue');
  const note = document.getElementById('rushNote');
  const noFeeServices = ['landing', 'portfolio', 'figma'];
  if (timeline && service && note) {
    if (timeline.value === 'asap' && noFeeServices.includes(service.value)) {
      note.style.display = 'block';
      note.textContent = '✓ No rush fee for this service — ASAP delivery included!';
      note.style.color = '#4ade80';
    } else if (timeline.value === 'asap') {
      note.style.display = 'block';
      note.textContent = '⚡ +$20 rush fee applies for ASAP delivery';
      note.style.color = '#f59e0b';
    } else {
      note.style.display = 'none';
    }
  }
}

document.getElementById('timeline').addEventListener('change', checkRushFee);
document.querySelectorAll('#serviceGrid button').forEach(btn => {
  btn.addEventListener('click', checkRushFee);
});
