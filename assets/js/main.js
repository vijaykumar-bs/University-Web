/**
 * ABC University Interactive Features Data Module
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 0. Detect Dark Heroes for CSS targeting fallback
    if (document.querySelector('.microsite-hero')) {
        document.body.classList.add('has-dark-hero');
    }
    // 1. Initialise Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // 2. Multi-level Dropdown Logic
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth > 991) {
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                this.classList.add('show');
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.add('show');
            });
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('show');
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
            });
        });
    }

    // Handle nested dropdowns
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');
    dropdownSubmenus.forEach(submenu => {
        submenu.addEventListener('mouseenter', function(e) {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) menu.classList.add('show');
        });
        submenu.addEventListener('mouseleave', function(e) {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) menu.classList.remove('show');
        });
    });


    // 3. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled-nav');
            navbar.style.background = '';
            navbar.style.boxShadow = '';
        } else {
            navbar.classList.remove('scrolled-nav');
            navbar.style.background = '';
            navbar.style.boxShadow = '';
        }
    });

    // 4. Modal Interactions (Automate Bootstrap if present)
    const viewBrochureBtns = document.querySelectorAll('.view-brochure-btn');
    viewBrochureBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalHtml = `
            <div class="modal fade" id="brochureModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content glass-panel" style="border:none;">
                  <div class="modal-header border-0">
                    <h5 class="modal-title" style="color:var(--theme-primary)">Program Brochure</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-center p-5">
                    <i class="bi bi-file-earmark-pdf" style="font-size: 4rem; color:var(--theme-secondary)"></i>
                    <h3 class="mt-3">Download Brochure</h3>
                    <p class="text-muted">Enter your details to receive the comprehensive program guide.</p>
                    <form>
                        <input type="text" class="form-control mb-3" placeholder="Full Name" required>
                        <input type="email" class="form-control mb-3" placeholder="Email Address" required>
                        <button type="submit" class="btn btn-primary-custom w-100">Download Now</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>`;
            
            // Remove existing if any
            let existingModal = document.getElementById('brochureModal');
            if(existingModal) { existingModal.remove(); }
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            let brochureModal = new bootstrap.Modal(document.getElementById('brochureModal'));
            brochureModal.show();
        });
    });

    // 5. Collapse mobile navbar after clicking a top-level link
    (function collapseMobileNavOnLinkClick(){
        const mainNavEl = document.getElementById('mainNav');
        if (!mainNavEl || typeof bootstrap === 'undefined') return;
        // Create a collapse instance without toggling
        let bsCollapse;
        try { bsCollapse = bootstrap.Collapse.getInstance(mainNavEl) || new bootstrap.Collapse(mainNavEl, {toggle:false}); } catch(e){ bsCollapse = new bootstrap.Collapse(mainNavEl, {toggle:false}); }

        const shouldIgnore = (href) => {
            if (!href) return true;
            href = href.toLowerCase();
            if (href.includes('sitemap.html')) return true;
            if (href.includes('/admin/') || href.includes('admin/')) return true;
            return false;
        };

        mainNavEl.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                const text = (link.textContent || '').trim().toLowerCase();

                // Mobile-specific remapping
                if (window.innerWidth <= 991) {
                    // Academics -> academics overview page
                    if (text.includes('academics')) {
                        e.preventDefault();
                        try { bsCollapse.hide(); } catch(err) {}
                        window.location.href = 'academics.html';
                        return;
                    }
                    // Admissions -> apply page
                    if (text.includes('admissions')) {
                        e.preventDefault();
                        try { bsCollapse.hide(); } catch(err) {}
                        window.location.href = 'apply.html';
                        return;
                    }
                }

                // If link opens a dropdown (has dropdown-toggle) or is excluded, don't collapse here
                if (link.classList.contains('dropdown-toggle')) return;
                if (shouldIgnore(href)) return;
                if (window.innerWidth <= 991) {
                    try { bsCollapse.hide(); } catch(err) { /* ignore */ }
                }
            });
        });
    })();
});
