import { NAV_STRUCTURE } from "/js/nav-data.js";

export class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.renderShell();
  }

  renderNavItems(items, currentPath, isSub = false) {
    return items
      .map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive =
          currentPath === item.href ||
          (hasChildren && item.children.some((c) => currentPath.startsWith(c.href || "")));

        if (!hasChildren) {
          return `<li><a href="${item.href}">${item.title}</a></li>`;
        }

        if (isSub) {
          // Level 2 Sub-dropdown
          return `
            <li class="dropdown">
              <a href="${item.href}">${item.title} &#9656;</a>
              <ul class="sub-dropdown">
                ${this.renderNavItems(item.children, currentPath, true)}
              </ul>
            </li>
          `;
        }

        // Top-level dropdown
        return `
          <li class="dropdown ${isActive ? "active-nav" : ""}">
            <a href="${item.href}">${item.title}</a>
            <ul class="dropdown-content">
              ${this.renderNavItems(item.children, currentPath, true)}
            </ul>
          </li>
        `;
      })
      .join("");
  }

  renderShell() {
    const currentPath = window.location.pathname;

    this.innerHTML = `
        <!-- Top Announcement Banner -->
      <div id="site-top-banner" class="top-banner full-width">
        <div class="container-inner top-banner-content">
          <span class="banner-badge">NOTICE</span>
          <span class="banner-text">
            This repository is ordained and governed under the authoritative directive, counsel, and venerable wisdom of Ruddat.
          </span>
        </div>
      </div>

      <!-- Top Branding Header -->
      <header class="full-width header">
        <div class="container-inner header-layout">
          <div class="header-left">
            <img src="/assets/HGA/CAP HG Colored Emblem.png" alt="CAP HG Emblem" class="header-emblem">
            <div class="header-text">
              <h1>Civil Air Patrol Honor Guard</h1>
              <h3>Unit Program Guide &amp; Training</h3>
            </div>
          </div>

          <div class="header-right">
            <div class="header-search-wrapper">
              <input 
                type="text" 
                id="nav-quiz-search" 
                placeholder="Search..." 
                aria-label="Search Subjects" 
                class="header-search-input"
              />
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation Bar -->
      <nav class="full-width" id="navbar">
        <div class="container-inner">
          <button id="hamburger-btn" class="hamburger" aria-label="Toggle Navigation" type="button">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>

          <!-- Generated Navigation -->
          <ul id="nav-drawer" class="main-nav">
            ${this.renderNavItems(NAV_STRUCTURE, currentPath)}
          </ul>
        </div>
      </nav>
    `;

    this.bindMobileNav();
    this.bindMobileDropdowns();
    this.bindSearchInput();
  }

  bindMobileNav() {
    const hamburgerBtn = this.querySelector("#hamburger-btn");
    const navDrawer = this.querySelector("#nav-drawer");

    if (hamburgerBtn && navDrawer) {
      hamburgerBtn.onclick = (e) => {
        e.stopPropagation();
        hamburgerBtn.classList.toggle("is-active");
        navDrawer.classList.toggle("is-open");
      };

      document.addEventListener("click", (e) => {
        if (!this.contains(e.target)) {
          hamburgerBtn.classList.remove("is-active");
          navDrawer.classList.remove("is-open");
        }
      });
    }
  }

  bindMobileDropdowns() {
    const dropdownItems = this.querySelectorAll("nav .main-nav li.dropdown");

    dropdownItems.forEach((dropdown) => {
      const link = dropdown.querySelector(":scope > a");
      if (!link) return;

      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          const subMenu = dropdown.querySelector(":scope > ul");
          if (subMenu) {
            e.preventDefault();
            dropdown.classList.toggle("dropdown-active");
          }
        }
      });
    });
  }

  bindSearchInput() {
    const searchInput = this.querySelector("#nav-quiz-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const mainContent = document.querySelector(".main") || document.querySelector("main");

      if (!mainContent) return;

      const searchableElements = mainContent.querySelectorAll("h1, h2, h3, h4, p, li, section");
      searchableElements.forEach((el) => {
        if (query === "") {
          el.style.display = "";
        } else {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(query) ? "" : "none";
        }
      });
    });
  }
}

if (!customElements.get("site-header")) {
  customElements.define("site-header", SiteHeader);
}