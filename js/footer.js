import { showModal } from '/js/modal-service.js';

export class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    this.style.width = "100%";
    this.style.marginTop = "auto";

    const currentYear = new Date().getFullYear();

    this.innerHTML = `
      <footer class="full-width">
        <!-- Top Footer Segment: 4 Columns -->
        <div class="footer">
          <div class="container-inner footer-grid-4">
            <!-- Col 1: Headquarters & Contact -->
            <div class="footer-col">
              <h5>Civil Air Patrol</h5>
              <p class="footer-subheading">Honor Guard</p>
              <p class="footer-contact">
                <a href="tel:8772279142">877.227.9142</a><br>
                <a href="mailto:info@gocivilairpatrol.com">info@gocivilairpatrol.com</a>
              </p>
              <span class="footer-badge">Unoffical site</span>
            </div>

            <!-- Col 2: Mission Statement -->
            <div class="footer-col">
              <h5>Vision</h5>
              <p class="footer-mission">
                By training on the finer points of Air Force-style drill and ceremonies, the we impart the timeless values of patriotism, community service, and personal honor.
              </p>
            </div>

            <div class="footer-col">
              <h5>Motto</h5>
              <p class="footer-mission">
                Not to set the standards, but to exceed them!
              </p>
            </div>
          </div>
        </div>

        <!-- Bottom Footer Segment: 2 Columns (Left & Right) -->
        <div class="footer-end">
          <div class="container-inner footer-split-2">
            <!-- Left Side: Copyright & Disclaimer Note -->
            <div class="footer-end-left">
              <p class="copyright-line">&copy; ${currentYear} Honor Guard Alumni.</p>
              <p class="reference-note">Reference for educational purposes only. Always consult official guidance.</p>
            </div>

            <!-- Right Side: Utility, Legal Modals & Attribution -->
            <div class="footer-end-right">
              <span class="footer-credits">Web Development by Honor Guard Alumni</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.bindModalEvents();
  }

  bindModalEvents() {
    // 1. Terms of Use Modal
    const termsBtn = this.querySelector("#footer-btn-terms");
    if (termsBtn) {
      termsBtn.onclick = () => {
        const content = document.createElement("div");
        content.className = "flex-col gap-sm text-left text-sm";
        content.innerHTML = `
          <p><strong>1. Ownership:</strong> You retain all ownership rights and copyright to any original quiz questions, options, explanations, comments, or other text ("User Content") you submit or post to our website.</p>
          <p><strong>2. License to Us:</strong> By submitting User Content, you grant capdrillquiz a worldwide, non-exclusive, royalty-free, perpetual, and transferable license to host, store, display, reproduce, modify, format, and distribute your content across our platform and associated services.</p>
          <p><strong>3. Content Representations &amp; Warranties:</strong> You represent and warrant that your content is your original creation, does not infringe on third-party intellectual property, and complies with applicable laws.</p>
          <p><strong>4. Moderation &amp; Responsibility:</strong> We reserve the right to review, edit, or remove User Content. You are solely responsible for content you post.</p>
          <p><strong>5. Governing Law:</strong> These terms are governed by the laws of the State of Wisconsin.</p>
        `;
        showModal(content, "User-Generated Content & Ownership Terms");
      };
    }

    // 2. Privacy Policy Modal
    const privacyBtn = this.querySelector("#footer-btn-privacy");
    if (privacyBtn) {
      privacyBtn.onclick = () => {
        const content = document.createElement("div");
        content.className = "flex-col gap-sm text-left text-sm";
        content.innerHTML = `
          <p>This study site does not require an account and does not intentionally request or transmit your name, email address, CAPID, or quiz answers to a site database.</p>
          <p>Your quiz progress and selected answers may be stored locally in your web browser using <code>localStorage</code> so you can resume a test. You can remove that information by using "Restart Test" or clearing this site's browser storage.</p>
          <p>The website may be hosted by a third-party hosting provider such as Netlify, which may process standard technical information such as IP addresses and request logs under its own policies. External links, including Civil Air Patrol donation pages, are governed by the privacy practices of those external sites.</p>
          <p>No advertising trackers or third-party analytics scripts are included in this package.</p>
        `;
        showModal(content, "Privacy Policy");
      };
    }

    // 3. Disclaimer Modal
    const disclaimerBtn = this.querySelector("#footer-btn-disclaimer");
    if (disclaimerBtn) {
      disclaimerBtn.onclick = () => {
        const content = document.createElement("div");
        content.className = "flex-col gap-sm text-left text-sm";
        content.innerHTML = `
          <p>This website is an unofficial supplemental study aid and is not an official publication, product, endorsement, or examination of Civil Air Patrol, the United States Air Force, or the United States Government.</p>
          <p>The practice questions are provided for education and review. They do not reproduce, predict, or guarantee questions on any official CAP examination, and successful performance on these practice tests does not guarantee a passing score on an official assessment.</p>
          <p>Cadets should use the current official Civil Air Patrol curriculum, regulations, and testing guidance as the authoritative sources. If this site conflicts with current official CAP material, the official material controls.</p>
        `;
        showModal(content, "Official Disclaimer");
      };
    }
  }
}

if (!customElements.get("site-footer")) {
  customElements.define("site-footer", SiteFooter);
}