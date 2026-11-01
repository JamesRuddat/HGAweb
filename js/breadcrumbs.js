import { NAV_STRUCTURE } from "/js/nav-data.js";

export class BreadCrumbs extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  /**
   * Recursively finds the active path hierarchy matching the current URL.
   * Returns an array of node objects [{ title, href }, ...] from root to leaf.
   */
  findPathInNav(nodes, currentPath, currentChain = []) {
    for (const node of nodes) {
      const nextChain = [...currentChain, { title: node.title, href: node.href }];

      // Direct match
      if (node.href === currentPath) {
        return nextChain;
      }

      // Check nested children
      if (node.children && node.children.length > 0) {
        const found = this.findPathInNav(node.children, currentPath, nextChain);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Fallback formatter if the current page isn't in NAV_STRUCTURE
   */
  formatSlug(slug) {
    return slug
      .replace(/\.html?$/i, "")
      .split(/[-_]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  render() {
    const currentPath = window.location.pathname;
    const crumbs = [{ title: "Home", href: "/pages/home.html" }];

    // 1. Try finding the route inside NAV_STRUCTURE
    const matchedPath = this.findPathInNav(NAV_STRUCTURE, currentPath);

    if (matchedPath && matchedPath.length > 0) {
      crumbs.push(...matchedPath);
    } else {
      // 2. Fallback: Parse URL slugs if the page isn't registered in NAV_STRUCTURE
      const rawSegments = currentPath.split("/").filter(Boolean);
      let accumulated = "";

      rawSegments.forEach((segment, idx) => {
        accumulated += `/${segment}`;
        const cleanSlug = segment.replace(/\.html?$/i, "");
        if (cleanSlug.toLowerCase() === "pages" || cleanSlug.toLowerCase() === "home") return;

        const isLast = idx === rawSegments.length - 1;
        const pageTitle = document.querySelector(".main-content-header h1, h1")?.innerText?.trim();

        crumbs.push({
          title: isLast ? (pageTitle || this.formatSlug(segment)) : this.formatSlug(segment),
          href: isLast ? null : (accumulated.endsWith(".html") ? accumulated : `${accumulated}.html`)
        });
      });
    }

    // Deduplicate any consecutive identical crumbs (e.g., if parent and child share the same title or href)
    const filteredCrumbs = crumbs.filter((crumb, idx, arr) => {
      if (idx === 0) return true;
      return crumb.title !== arr[idx - 1].title;
    });

    // 3. Build HTML Output
    const htmlOutput = filteredCrumbs
      .map((crumb, idx) => {
        const isLast = idx === filteredCrumbs.length - 1;

        if (isLast) {
          // Terminal active item
          return `<span class="current-page" aria-current="page">${crumb.title}</span>`;
        }

        return `<a href="${crumb.href}">${crumb.title}</a><span class="crumb-separator">/</span>`;
      })
      .join("");

    this.innerHTML = `
      <div class="breadcrumb-trail" aria-label="Breadcrumb">
        ${htmlOutput}
      </div>
    `;
  }
}

if (!customElements.get("bread-crumbs")) {
  customElements.define("bread-crumbs", BreadCrumbs);
}