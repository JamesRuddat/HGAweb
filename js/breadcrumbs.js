export class BreadCrumbs extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  // Map slugs to clean readable labels
  static get labelMap() {
    return {
      "pages": "", // Empty string means skip this segment
      "home": "Home",
      "programs": "Programs",
      "cadet-programs": "Cadet Programs",
      "color-guard": "Color Guard",
      "honor-guard": "Honor Guard",
      "hga-cha": "HGA / CHA",
      "equipment": "Equipment",
      "drill": "Drill Standards",
      "sop": "SOP Manual"
    };
  }

  // Explicit URL fallbacks for intermediary paths
  static get routeMap() {
    return {
      "programs": "/pages/home.html#programs",
      "cadet-programs": "/pages/home.html#cadet-programs",
      "color-guard": "/pages/color-guard.html",
      "honor-guard": "/pages/honor-guard.html",
      "equipment": "/pages/equipment.html"
    };
  }

  formatSlug(slug) {
    const clean = slug.replace(/\.html?$/i, "");
    if (BreadCrumbs.labelMap[clean] !== undefined) {
      return BreadCrumbs.labelMap[clean];
    }
    return clean
      .split(/[-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  resolveHref(slug) {
    const clean = slug.replace(/\.html?$/i, "");

    // 1. Check explicit route map first
    if (BreadCrumbs.routeMap[clean]) {
      return BreadCrumbs.routeMap[clean];
    }

    // 2. Direct page link under /pages/
    return `/pages/${clean}.html`;
  }

  render() {
    const path = window.location.pathname;
    const rawSegments = path.split("/").filter(Boolean);

    // Initial root crumb
    const crumbs = [{ label: "Home", href: "/pages/home.html" }];

    rawSegments.forEach((segment, idx) => {
      const isLast = idx === rawSegments.length - 1;
      const cleanSlug = segment.replace(/\.html?$/i, "");
      const label = this.formatSlug(segment);

      // Skip ignored folders (e.g. 'pages') or duplicate home
      if (!label || cleanSlug.toLowerCase() === "home") return;

      const titleFromPage = document.querySelector(".main-content-header h1, h1")?.innerText?.trim();

      crumbs.push({
        label: isLast ? (titleFromPage || label) : label,
        href: isLast ? null : this.resolveHref(segment)
      });
    });

    // Render as plain links with / separators
    const htmlOutput = crumbs.map((crumb, idx) => {
      const isLast = idx === crumbs.length - 1;
      if (isLast) {
        return `<span class="current-page">${crumb.label}</span>`;
      }
      return `<a href="${crumb.href}">${crumb.label}</a><span class="crumb-separator">/</span>`;
    }).join("");

    // Uses div instead of nav
    this.innerHTML = `
      <div class="breadcrumb-trail">
        ${htmlOutput}
      </div>
    `;
  }
}

if (!customElements.get("bread-crumbs")) {
  customElements.define("bread-crumbs", BreadCrumbs);
}