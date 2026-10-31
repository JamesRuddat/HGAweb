/**
 * Safe partial loader that prevents script crashes on missing components.
 */
async function loadPartial(id, file) {
  const element = document.getElementById(id);
  if (!element) return; // Exit gracefully if the container isn't present

  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} when fetching ${file}`);
    }
    const html = await response.text();
    element.innerHTML = html;
  } catch (err) {
    console.warn(`Partial load bypassed for #${id}:`, err.message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Load partials independently so one failure doesn't block the rest
  await loadPartial("head-placeholder", "/js/head.html");
  
  await Promise.allSettled([
    loadPartial("announcement-placeholder", "/js/announcement.html"),
    loadPartial("header-placeholder", "/js/header.html"),
    loadPartial("nav-placeholder", "/js/nav.html"),
    loadPartial("footer-placeholder", "/js/footer.html")
  ]);

  setupAnnouncement();
  setupThemeToggle();
  setupMobileNav();
});

function setupThemeToggle() {
  const toggleBtn = document.getElementById("darkModeToggle");
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
    window.dispatchEvent(new Event("themechange"));
  });
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }
}

function setupAnnouncement() {
  const announcement = document.getElementById("announcement");
  const title = document.getElementById("announcement-title");
  const message = document.getElementById("announcement-message");
  const marquee = document.getElementById("announcement-marquee");

  if (!announcement || !title || !message) return;

  const path = window.location.pathname;
  const announcements = {
    "/pages/builders/uniformBuilder.html": {
      title: "Warning:",
      message: "This is a draft uniform creator. Verify all details against CAPR 39-1.",
      marquee: "Draft tool - tolerances may vary."
    },
    "/pages/uniforms/faq.html": {
      title: "Update:",
      message: "OCP uniform wear authorized starting November 1, 2025.",
      marquee: "In accordance with DAFI 36-2903 and CAPR 39-1."
    }
  };

  const current = announcements[path];
  if (current) {
    title.textContent = current.title;
    message.textContent = current.message;
    if (marquee && current.marquee) {
      marquee.textContent = current.marquee;
      marquee.style.display = "inline-block";
    }
    announcement.style.display = "block";
  }
}