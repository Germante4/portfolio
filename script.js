// ==============================
// Helpers
// ==============================
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// ==============================
// Year
// ==============================
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ==============================
// Theme toggle
// ==============================
const themeBtn = $("#themeBtn");
const root = document.documentElement;

function setTheme(mode) {
  if (mode === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
    mode = "dark";
  }
  localStorage.setItem("theme", mode);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  setTheme(savedTheme);
}

themeBtn?.addEventListener("click", () => {
  const isLight = root.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

// ==============================
// Mobile menu
// ==============================
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

function openMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuBtn?.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuBtn?.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!mobileMenu) return;
  const isOpen = mobileMenu.classList.contains("open");
  if (isOpen) closeMenu();
  else openMenu();
}

menuBtn?.addEventListener("click", toggleMenu);

$$(".mobile__link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (e) => {
  if (!mobileMenu || !menuBtn) return;
  const clickedInsideMenu = mobileMenu.contains(e.target);
  const clickedMenuBtn = menuBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedMenuBtn && mobileMenu.classList.contains("open")) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

// ==============================
// Mouse spot
// ==============================
const spot = $("#spot");
let spotRaf = null;
let targetX = -9999;
let targetY = -9999;
let currentX = -9999;
let currentY = -9999;
let pointerActive = false;

function animateSpot() {
  if (!spot) {
    spotRaf = null;
    return;
  }

  currentX += (targetX - currentX) * 0.14;
  currentY += (targetY - currentY) * 0.14;

  spot.style.left = `${currentX}px`;
  spot.style.top = `${currentY}px`;

  const dx = Math.abs(targetX - currentX);
  const dy = Math.abs(targetY - currentY);

  if (pointerActive || dx > 0.2 || dy > 0.2) {
    spotRaf = requestAnimationFrame(animateSpot);
  } else {
    spotRaf = null;
  }
}

window.addEventListener(
  "pointermove",
  (e) => {
    if (!spot) return;
    pointerActive = true;
    targetX = e.clientX;
    targetY = e.clientY;

    if (!spotRaf) {
      spotRaf = requestAnimationFrame(animateSpot);
    }
  },
  { passive: true }
);

window.addEventListener("pointerleave", () => {
  pointerActive = false;
  targetX = -9999;
  targetY = -9999;

  if (!spotRaf && spot) {
    spotRaf = requestAnimationFrame(animateSpot);
  }
});

// ==============================
// Scroll progress
// ==============================
const progressBar = $("#progressBar");

function updateScrollProgress() {
  if (!progressBar) return;

  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const value = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressBar.style.width = `${value}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

// ==============================
// Reveal on scroll
// ==============================
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function observeRevealElements(scope = document) {
  $$(".reveal", scope).forEach((el) => {
    if (!el.classList.contains("is-in")) {
      revealObserver.observe(el);
    }
  });
}

observeRevealElements();

// ==============================
// Projects data
// ==============================
const projects = [
  {
    id: "beautym",
    type: "landing",
    title: "Beauty Master",
    badge: "Landing",
    accent: "beauty",
    desc: "Landing page for a beauty specialist / studio (clean UI, responsive).",
    bullets: ["Clean layout", "Responsive", "CTA focused"],
    live: "https://germante4.github.io/Beauty-master/"
  },
  {
    id: "noirframe",
    type: "landing",
    title: "Photographer Master",
    badge: "Landing",
    accent: "photo",
    desc: "Photographer landing/portfolio (modern layout, clear CTAs).",
    bullets: ["Portfolio layout", "Modern UI", "Responsive"],
    live: "https://germante4.github.io/Photographer-master/"
  },
  {
    id: "recipes",
    type: "website",
    title: "Recipes",
    badge: "Website",
    accent: "recipes",
    desc: "Recipe website (more content, sections, layout).",
    bullets: ["Content layout", "Cards/sections", "Responsive"],
    live: "https://germante4.github.io/Recipes/"
  },
  {
    id: "lume",
    type: "landing",
    title: "Lumé Beauty Studio",
    badge: "Landing",
    accent: "lume",
    desc: "Clean luxury salon landing with clear sections and a modal flow.",
    bullets: ["Luxury UI", "Services + reviews", "Modal"],
    live: "https://germante4.github.io/Lume-Beauty-Studio/"
  },
  {
    id : "parformer",
    type : "landing",
    title: "Reformer pilates",
    badge: "Landing",
    accent: "photo",
    desc : "Pilates studio landing page with registration",
    bullets: ["Studio website", "Modern UI", "Responsive", "Google forms"],
    live: "https://germante4.github.io/Parf-rmer/"
  },
  {
    id : "Karolina MakeupStyle",
    type : "website",
    title: "Karolina Makeup Style",
    badge: "Website",
    accent: "karolinamakeupstyle",
    desc: "Beauty stylist portfolio website",
    bullets: ["Content layout", "Cards/section", "Responsive"],
    live: "https://germante4.github.io/karolinamakeupstyle/"
  }

];

// ==============================
// Build projects
// ==============================
const projectsGrid = $("#projectsGrid");

function createProjectCard(project) {
  return `
    <article class="card project reveal" data-type="${project.type}">
      <div class="thumb thumb-live" data-accent="${project.accent}">
        <iframe
          class="thumb-iframe"
          src="${project.live}"
          title="${project.title} preview"
          loading="lazy"
          tabindex="-1"
        ></iframe>
        <div class="thumb-glass" aria-hidden="true"></div>
      </div>

      <div class="pbody">
        <div class="ptop">
          <h3>${project.title}</h3>
          <span class="badge">${project.badge}</span>
        </div>

        <p class="desc">${project.desc}</p>

        <ul class="list">
          ${project.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>

        <div class="pactions">
          <button class="btn btn--ghost" type="button" data-preview="${project.id}">
            Preview
          </button>
          <a class="btn btn--primary" href="${project.live}" target="_blank" rel="noopener">
            Live
          </a>
        </div>
      </div>
    </article>
  `;
}

if (projectsGrid) {
  projectsGrid.innerHTML = projects.map(createProjectCard).join("");
  observeRevealElements(projectsGrid);
}

// ==============================
// Fit preview thumbs
// ==============================
function fitThumbs() {
  document.querySelectorAll(".thumb-live").forEach((thumb) => {
    const width = thumb.clientWidth;
    const scale = Math.max(0.16, Math.min(0.30, width / 1440));
    thumb.style.setProperty("--scale", scale.toFixed(3));
  });
}

window.addEventListener("resize", fitThumbs);
window.addEventListener("load", fitThumbs);
fitThumbs();

// ==============================
// Quick links
// ==============================
const quickLinks = $("#quickLinks");

if (quickLinks) {
  quickLinks.innerHTML = projects
    .map(
      (project) =>
        `<a href="${project.live}" target="_blank" rel="noopener">${project.title} — Live</a>`
    )
    .join("");
}

// ==============================
// Filters
// ==============================
const chips = $$(".chip");

function applyFilter(filter) {
  $$(".project").forEach((card) => {
    const type = card.dataset.type;
    const shouldShow = filter === "all" || filter === type;
    card.style.display = shouldShow ? "" : "none";
  });

  fitThumbs();
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    applyFilter(chip.dataset.filter || "all");
  });
});

// ==============================
// Preview modal
// ==============================
const modal = $("#previewModal");
const previewFrame = $("#previewFrame");
const modalTitle = $("#modalTitle");
const openLiveBtn = $("#openLiveBtn");
const closeModalBtn = $("#closeModal");

let lastFocusedElement = null;

function getProjectById(id) {
  return projects.find((project) => project.id === id) || projects[0];
}

function openPreview(id) {
  if (!modal || !previewFrame || !modalTitle || !openLiveBtn) return;

  const project = getProjectById(id);
  lastFocusedElement = document.activeElement;

  modalTitle.textContent = project.title;
  openLiveBtn.href = project.live;
  previewFrame.src = project.live;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

  closeModalBtn?.focus();
}

function closePreview() {
  if (!modal || !previewFrame) return;

  modal.classList.remove("open");
  document.body.style.overflow = "";
  previewFrame.src = "about:blank";

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

document.addEventListener("click", (e) => {
  const previewBtn = e.target.closest("[data-preview]");
  if (previewBtn) {
    openPreview(previewBtn.getAttribute("data-preview"));
  }
});

closeModalBtn?.addEventListener("click", closePreview);

modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    closePreview();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal?.classList.contains("open")) {
      closePreview();
    } else if (mobileMenu?.classList.contains("open")) {
      closeMenu();
    }
  }
});