// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (dark default)
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;

function setTheme(mode){
  if (mode === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  localStorage.setItem("theme", mode);
}
const saved = localStorage.getItem("theme");
if (saved) setTheme(saved);

themeBtn?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});
document.querySelectorAll(".mobile__link").forEach(a => {
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

// Mouse spot
const spot = document.getElementById("spot");
let raf = null, tx = -9999, ty = -9999, cx = tx, cy = ty;

window.addEventListener("pointermove", (e) => {
  tx = e.clientX; ty = e.clientY;
  if (!raf) raf = requestAnimationFrame(tick);
}, { passive: true });

function tick(){
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  spot.style.left = `${cx}px`;
  spot.style.top  = `${cy}px`;
  raf = requestAnimationFrame(tick);
}

// Scroll progress
const bar = document.getElementById("progressBar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const max = (h.scrollHeight - h.clientHeight) || 1;
  bar.style.width = `${(h.scrollTop / max) * 100}%`;
}, { passive: true });

// Reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => { if (ent.isIntersecting) ent.target.classList.add("is-in"); });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Projects data (your live links)
const projects = [
  {
    id: "beautym",
    type: "landing",
    title: "Beauty Master",
    badge: "Landing",
    accent: "beauty",
    desc: "Landing page grožio meistrui / salonui (clean UI, responsive).",
    bullets: ["Clean layout", "Responsive", "CTA focused"],
    live: "https://germante4.github.io/Beauty-master/"
  },
  {
    id: "noirframe",
    type: "landing",
    title: "Photographer Master",
    badge: "Landing",
    accent: "photo",
    desc: "Fotografo landing/portfolio (modernus išdėstymas, aiškūs CTA).",
    bullets: ["Portfolio layout", "Modern UI", "Responsive"],
    live: "https://germante4.github.io/Photographer-master/"
  },
  {
    id: "recipes",
    type: "website",
    title: "Recipes",
    badge: "Website",
    accent: "recipes",
    desc: "Receptų svetainė (daugiau turinio, sekcijos, layout).",
    bullets: ["Content layout", "Cards/sections", "Responsive"],
    live: "https://germante4.github.io/Recipes/"
  },
  {
    id: "lume",
    type: "landing",
    title: "Lumé Beauty Studio",
    badge: "Landing",
    accent: "lume",
    desc: "Clean luxury salon landing su aiškiom sekcijom ir modal flow.",
    bullets: ["Luxury UI", "Services + reviews", "Modal"],
    live: "https://germante4.github.io/Lume-Beauty-Studio/"
  }
];


// Build projects grid
const grid = document.getElementById("projectsGrid");
grid.innerHTML = projects.map(p => `
  <article class="card project reveal" data-type="${p.type}">
    <div class="thumb thumb-live" data-accent="${p.accent}">
  <iframe class="thumb-iframe" src="${p.live}" title="${p.title} preview" loading="lazy"></iframe>
  <div class="thumb-glass" aria-hidden="true"></div>
</div>

    <div class="pbody">
      <div class="ptop">
        <h3>${p.title}</h3>
        <span class="badge">${p.badge}</span>
      </div>
      <p class="desc">${p.desc}</p>
      <ul class="list">
        ${p.bullets.map(b => `<li>${b}</li>`).join("")}
      </ul>
      <div class="pactions">
        <button class="btn btn--ghost" type="button" data-preview="${p.id}">Preview</button>
        <a class="btn btn--primary" href="${p.live}" target="_blank" rel="noopener">Live</a>
    
      </div>
    </div>
  </article>
`).join("");
function fitThumbs(){
  document.querySelectorAll(".thumb-live").forEach(thumb => {
    const w = thumb.clientWidth;
    // 1440 yra iframe "virtualus" plotis (CSS'e)
    const scale = Math.max(0.14, Math.min(0.28, w / 1440));
    thumb.style.setProperty("--scale", scale.toFixed(3));
  });
}

fitThumbs();
window.addEventListener("resize", fitThumbs);


// Observe injected reveal elements
document.querySelectorAll(".project.reveal").forEach(el => io.observe(el));

// Quick links
const quick = document.getElementById("quickLinks");
quick.innerHTML = projects.map(p => `
  <a href="${p.live}" target="_blank" rel="noopener">${p.title} — Live</a>
`).join("");

// Filters
const chips = document.querySelectorAll(".chip");
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    const f = chip.dataset.filter;

    document.querySelectorAll(".project").forEach(card => {
      const type = card.dataset.type;
      const show = (f === "all") || (f === type);
      card.style.display = show ? "" : "none";
    });
    fitThumbs();
  });
});

// Preview modal
const modal = document.getElementById("previewModal");
const frame = document.getElementById("previewFrame");
const title = document.getElementById("modalTitle");
const openLiveBtn = document.getElementById("openLiveBtn");
const closeBtn = document.getElementById("closeModal");

function openPreview(id){
  const p = projects.find(x => x.id === id) || projects[0];
  title.textContent = p.title;
  openLiveBtn.href = p.live;
  frame.src = p.live;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closePreview(){
  modal.classList.remove("open");
  document.body.style.overflow = "";
  frame.src = "about:blank";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-preview]");
  if (btn) openPreview(btn.getAttribute("data-preview"));
});
closeBtn?.addEventListener("click", closePreview);
modal.addEventListener("click", (e) => { if (e.target === modal) closePreview(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closePreview();
  
});
