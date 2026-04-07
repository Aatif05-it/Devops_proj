// assets/js/main.js - ENHANCED VERSION
document.addEventListener("DOMContentLoaded", async () => {
  enforceHttpsProtocol();
  await runPreloadCaptchaGate();
  initSidebar();
  initLangbarScroller();
  initNavToggle();
  initCopyButtons();
  initDarkMode(); // Bonus: dark mode toggle
  initSecurityAndPrivacy();
});

function enforceHttpsProtocol() {
  const isLocalHost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (window.location.protocol !== "https:" && !isLocalHost) {
    window.location.replace(
      "https://" + window.location.host + window.location.pathname + window.location.search + window.location.hash
    );
  }
}

// Build sidebar from JSON if a sidebar element exists
function initSidebar() {
  const sidebarEl = document.getElementById("sidebar");
  if (!sidebarEl) return;

  const sectionId = sidebarEl.getAttribute("data-section");
  if (!sectionId) return;

  fetch(`../../data/sidebar-links.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const section = data.sections.find((s) => s.id === sectionId);
      if (!section) return;

      sidebarEl.innerHTML = "";

      // Section title
      const title = document.createElement("h3");
      title.textContent = section.title;
      sidebarEl.appendChild(title);

      const currentPath = window.location.pathname;
      const currentFile = currentPath.substring(
        currentPath.lastIndexOf("/") + 1
      );

      section.links.forEach((link) => {
        const a = document.createElement("a");
        a.textContent = link.title;
        a.setAttribute("title", link.title); // Accessibility

        const isPublished = !link.status || link.status === "published";

        if (isPublished) {
          a.href = section.basePath + link.file;
          a.setAttribute("tabindex", "0"); // Keyboard accessible
        } else {
          a.href = "#";
          a.classList.add("link-disabled");
          a.setAttribute("aria-disabled", "true");
          a.setAttribute("tabindex", "-1");
        }

        if (link.file === currentFile) {
          a.classList.add("active-link");
        }

        sidebarEl.appendChild(a);
      });

      // Progress indicator (bonus)
      updateProgress(section);
    })
    .catch((error) => {
      console.error("Failed to load sidebar links:", error);
      sidebarEl.innerHTML = '<p class="error">📂 Loading tutorial menu...</p>';
    });
}

// Home page language strip scroller (< and > buttons)
function initLangbarScroller() {
  const wrap = document.querySelector(".langbar-wrap");
  if (!wrap) return;

  const bar = wrap.querySelector(".langbar");
  const prevBtn = wrap.querySelector(".langbar-arrow--prev");
  const nextBtn = wrap.querySelector(".langbar-arrow--next");
  if (!bar || !prevBtn || !nextBtn) return;

  const updateButtons = () => {
    const maxScroll = Math.max(0, bar.scrollWidth - bar.clientWidth);
    prevBtn.disabled = bar.scrollLeft <= 2;
    nextBtn.disabled = bar.scrollLeft >= maxScroll - 2;
  };

  const getStep = () => Math.max(220, Math.floor(bar.clientWidth * 0.62));

  prevBtn.addEventListener("click", () => {
    bar.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    bar.scrollBy({ left: getStep(), behavior: "smooth" });
  });

  bar.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

// Toggle mobile navigation
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".topnav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    links.classList.toggle("is-open");

    // Close on outside click (bonus)
    document.addEventListener("click", closeNavOnOutsideClick, { once: true });
  });
}

function closeNavOnOutsideClick(e) {
  const links = document.querySelector(".topnav-links");
  const toggle = document.querySelector(".nav-toggle");
  if (!links.classList.contains("is-open")) return;

  if (!toggle.contains(e.target) && !links.contains(e.target)) {
    links.classList.remove("is-open");
  }
}

// Enhanced copy buttons with fallback
function initCopyButtons() {
  const boxes = document.querySelectorAll(".example-box");
  boxes.forEach((box) => {
    const codeEl = box.querySelector("code");
    if (!codeEl) return;

    // Remove existing button if any
    const existingBtn = box.querySelector(".example-copy-btn");
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Copy";
    btn.className = "example-copy-btn";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.setAttribute("title", "Copy code");

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(codeEl.innerText);
        } else {
          // Fallback for older browsers
          fallbackCopyTextToClipboard(codeEl.innerText);
        }

        btn.textContent = "✅ Copied!";
        btn.classList.add("copied");

        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Copy failed", err);
        btn.textContent = "❌ Failed";
        setTimeout(() => (btn.textContent = "Copy"), 2000);
      }
    });

    box.appendChild(btn);
  });
}

// Fallback for older browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

// Bonus: Dark mode toggle
function initDarkMode() {
  const toggle = document.querySelector("#dark-mode-toggle");
  if (!toggle) return;

  const isDark = localStorage.getItem("dark-mode") === "true";
  if (isDark) document.documentElement.classList.add("dark-mode");

  toggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem(
      "dark-mode",
      document.documentElement.classList.contains("dark-mode")
    );
  });
}

// Bonus: Progress tracking
function updateProgress(section) {
  const completed = section.links.filter(
    (link) =>
      localStorage.getItem(`tutorial-${section.id}-${link.file}`) ===
      "completed"
  ).length;

  const progress = Math.round((completed / section.links.length) * 100);
  console.log(
    `${section.title}: ${completed}/${section.links.length} (${progress}%)`
  );
}

function runPreloadCaptchaGate() {
  return new Promise((resolve) => {
    if (document.getElementById("site-captcha-gate")) {
      resolve();
      return;
    }

    injectCaptchaGateStyles();

    const gate = document.createElement("div");
    gate.id = "site-captcha-gate";
    gate.innerHTML =
      '<div class="captcha-gate__card">' +
      '<h2>Security Verification</h2>' +
      '<p>Please complete CAPTCHA to continue to the website.</p>' +
      '<div class="captcha-gate__challenge" data-captcha-challenge></div>' +
      '<div class="captcha-gate__row">' +
      '<input type="text" data-captcha-input placeholder="Enter code" autocomplete="off" />' +
      '<button type="button" data-captcha-verify>Verify</button>' +
      '<button type="button" class="captcha-gate__refresh" data-captcha-refresh>Refresh</button>' +
      "</div>" +
      '<p class="captcha-gate__msg" data-captcha-msg></p>' +
      "</div>";

    document.body.appendChild(gate);
    document.body.classList.add("captcha-gate-open");

    const challengeEl = gate.querySelector("[data-captcha-challenge]");
    const inputEl = gate.querySelector("[data-captcha-input]");
    const verifyBtn = gate.querySelector("[data-captcha-verify]");
    const refreshBtn = gate.querySelector("[data-captcha-refresh]");
    const msgEl = gate.querySelector("[data-captcha-msg]");

    let challenge = "";

    function generateChallenge() {
      const chars = "0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    function refreshChallenge(message) {
      challenge = generateChallenge();
      if (challengeEl) challengeEl.textContent = challenge;
      if (inputEl) {
        inputEl.value = "";
        inputEl.focus();
      }
      if (msgEl) msgEl.textContent = message || "";
    }

    function unlockSite() {
      gate.remove();
      document.body.classList.remove("captcha-gate-open");
      resolve();
    }

    if (verifyBtn) {
      verifyBtn.addEventListener("click", () => {
        const value = inputEl ? inputEl.value.replace(/\s+/g, "") : "";
        if (value === challenge) {
          unlockSite();
        } else {
          refreshChallenge("Incorrect CAPTCHA. New code generated.");
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        refreshChallenge("CAPTCHA refreshed.");
      });
    }

    if (inputEl) {
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && verifyBtn) verifyBtn.click();
      });
    }

    refreshChallenge();
  });
}

function injectCaptchaGateStyles() {
  if (document.getElementById("captcha-gate-styles")) return;

  const style = document.createElement("style");
  style.id = "captcha-gate-styles";
  style.textContent =
    "body.captcha-gate-open{overflow:hidden}" +
    "#site-captcha-gate{position:fixed;inset:0;z-index:10000;background:rgba(2,6,23,.82);display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".captcha-gate__card{width:min(560px,100%);background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;padding:20px 18px;text-align:center;box-shadow:0 26px 70px rgba(2,6,23,.45)}" +
    ".captcha-gate__card h2{margin:0 0 8px;color:#0f172a}" +
    ".captcha-gate__card p{margin:0 0 10px;color:#334155}" +
    ".captcha-gate__challenge{margin:12px auto 10px;padding:10px 12px;border-radius:10px;border:1px dashed #94a3b8;background:#e2e8f0;color:#0f172a;font-size:1.35rem;font-weight:800;letter-spacing:.14em;max-width:320px}" +
    ".captcha-gate__row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}" +
    ".captcha-gate__row input{min-width:180px;padding:10px;border:1px solid #94a3b8;border-radius:8px;font-size:14px}" +
    ".captcha-gate__row button{padding:10px 14px;border:0;border-radius:8px;cursor:pointer;font-weight:700;background:#2563eb;color:#eff6ff}" +
    ".captcha-gate__row .captcha-gate__refresh{background:#334155;color:#e2e8f0}" +
    ".captcha-gate__msg{margin-top:10px;min-height:20px;font-size:13px;color:#1d4ed8}";

  document.head.appendChild(style);
}

// Site-wide security + privacy behavior
function initSecurityAndPrivacy() {
  hardenNewTabLinks();
  showPrivacyConsentBanner();
}

function hardenNewTabLinks() {
  const links = document.querySelectorAll('a[target="_blank"]');
  links.forEach((link) => {
    const rel = (link.getAttribute("rel") || "").toLowerCase();
    const relParts = rel.split(/\s+/).filter(Boolean);

    if (!relParts.includes("noopener")) relParts.push("noopener");
    if (!relParts.includes("noreferrer")) relParts.push("noreferrer");

    link.setAttribute("rel", relParts.join(" "));
  });
}

function showPrivacyConsentBanner() {
  const storageKey = "codenexa-privacy-consent-v3";
  const saved = safeGetLocalStorage(storageKey);
  const forceBanner =
    document.body &&
    document.body.getAttribute("data-force-consent-banner") === "true";

  if (!forceBanner && (saved === "accepted" || saved === "rejected")) return;

  if (document.getElementById("privacy-consent-banner")) return;

  injectPrivacyBannerStyles();

  const banner = document.createElement("div");
  banner.id = "privacy-consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML =
    '<div class="privacy-banner__content">' +
    '<p class="privacy-banner__text">We use essential browser storage for site preferences and security. Review our <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>' +
    '<div class="privacy-banner__actions" data-consent-actions>' +
    '<button type="button" class="privacy-banner__btn privacy-banner__btn--secondary" data-action="reject">Reject</button>' +
    '<button type="button" class="privacy-banner__btn privacy-banner__btn--primary" data-action="accept">Accept</button>' +
    "</div>" +
    "</div>";

  document.body.appendChild(banner);

  const acceptBtn = banner.querySelector('[data-action="accept"]');
  const rejectBtn = banner.querySelector('[data-action="reject"]');

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      safeSetLocalStorage(storageKey, "accepted");
      banner.remove();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      safeSetLocalStorage(storageKey, "rejected");
      banner.remove();
    });
  }
}

function injectPrivacyBannerStyles() {
  if (document.getElementById("privacy-consent-styles")) return;

  const style = document.createElement("style");
  style.id = "privacy-consent-styles";
  style.textContent =
    "#privacy-consent-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;background:#111827;color:#e5e7eb;border:1px solid #374151;border-radius:12px;box-shadow:0 14px 30px rgba(0,0,0,.35)}" +
    ".privacy-banner__content{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 14px;flex-wrap:wrap}" +
    ".privacy-banner__text{margin:0;line-height:1.45;font-size:14px}" +
    ".privacy-banner__text a{color:#93c5fd;text-decoration:underline}" +
    ".privacy-banner__actions{display:flex;gap:8px}" +
    ".privacy-banner__btn{border:0;border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer}" +
    ".privacy-banner__btn--secondary{background:#374151;color:#f3f4f6}" +
    ".privacy-banner__btn--primary{background:#10b981;color:#062d23}" +
    "@media (max-width:640px){.privacy-banner__content{align-items:flex-start}.privacy-banner__actions{width:100%}.privacy-banner__btn{flex:1}}";

  document.head.appendChild(style);
}

function safeGetLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Ignore storage write failures in private mode/restricted browsers.
  }
}
