export class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.renderShell();
  }

  renderShell() {
    const currentPath = window.location.pathname;

    this.innerHTML = `
      <!-- Top Branding Header -->
      <header class="full-width header">
  <div class="container-inner header-layout">
    <!-- Left Group: Emblem + Title/Subtitle -->
    <div class="header-left">
      <img src="/assets/HGA/CAP HG Colored Emblem.png" alt="CAP HG Emblem" class="header-emblem">
      <div class="header-text">
        <h1>Honor Guard</h1>
        <h3>Unit Program Guide</h3>
      </div>
    </div>

    <!-- Right Group: Search Bar + Second Emblem/Image -->
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
          <!-- Mobile Hamburger Toggle -->
          <button id="hamburger-btn" class="hamburger" aria-label="Toggle Navigation" type="button">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>

          <!-- Main Navigation Links & Dropdowns -->
          <ul id="nav-drawer" class="main-nav">
            <li class="dropdown ${currentPath.includes("home") ? "active-nav" : ""}">
              <a href="/pages/home.html">About</a>
              <ul class="dropdown-content">
                <li><a href="/pages/color-guard.html#drill">Drill Standards</a></li>
                <li><a href="/pages/color-guard.html#manual">Manual of Arms</a></li>
              </ul>
            </li>
            
            <li class="dropdown ${currentPath.includes("color-guard") ? "active-nav" : ""}">
              <a href="/pages/color-guard.html">Color Guard</a>
              <ul class="dropdown-content">
                <li><a href="/pages/color-guard.html#drill">Drill Standards</a></li>
                <li><a href="/pages/color-guard.html#manual">Manual of Arms</a></li>
              </ul>
            </li>

            <li class="dropdown ${currentPath.includes("honor-guard") || currentPath.includes("hga-cha") ? "active-nav" : ""}">
              <a href="/pages/honor-guard.html">Honor Guard</a>
              <ul class="dropdown-content">
                <li><a href="/pages/honor-guard.html#ceremonies">Ceremonies</a></li>
                <li class="dropdown">
                  <a href="/pages/hga-cha.html">HGA / CHA &#9656;</a>
                  <ul class="sub-dropdown">
                    <li><a href="/pages/hga-cha.html#curriculum">Curriculum</a></li>
                    <li><a href="/pages/hga-cha.html#cadre">Cadre Staff</a></li>
                    <li><a href="/pages/hga-cha.html#standards">Graduation Criteria</a></li>
                  </ul>
                </li>
                <li><a href="/pages/honor-guard.html#sop">SOP Manual</a></li>
              </ul>
            </li>

            <li class="dropdown ${currentPath.includes("equipment") ? "active-nav" : ""}">
              <a href="/pages/equipment.html">Library</a>
              <ul class="dropdown-content">
                <li><a href="/pages/color-guard.html#drill">Drill Standards</a></li>
                <li><a href="/pages/color-guard.html#manual">Manual of Arms</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    `;

    this.bindMobileNav();
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

  bindSearchInput() {
    const searchInput = this.querySelector("#nav-quiz-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const mainContent = document.querySelector(".main") || document.querySelector(".preview") || document.querySelector("main");

      if (!mainContent) return;

      const searchableElements = mainContent.querySelectorAll("h1, h2, h3, h4, p, li, section, .faq-item");
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