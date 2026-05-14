const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/vijay/OneDrive/Desktop/Vijay-svyasa';

// Standard Navbar & Footer Templates
const navbarTemplate = `
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container position-relative">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <i class="bi bi-mortarboard-fill me-2" style="font-size: 1.8rem; color: var(--theme-primary);"></i>
                ABC University
            </a>
            <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <i class="bi bi-list fs-2 text-dark"></i>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link {{ACTIVE_HOME}}" href="index.html">Home</a></li>
                    <li class="nav-item dropdown dropdown-mega">
                        <a class="nav-link dropdown-toggle {{ACTIVE_ACADEMICS}}" href="academics.html" data-bs-toggle="dropdown">Academics</a>
                        <div class="dropdown-menu mega-menu p-4">
                            <div class="container">
                                <div class="row g-4">
                                    <div class="col-lg-3 col-md-6">
                                        <h6 class="fw-bold mb-3">Discover</h6>
                                        <ul class="list-unstyled">
                                            <li><a class="dropdown-item px-0" href="academics.html">Overview</a></li>
                                            <li><a class="dropdown-item px-0" href="syllabus.html">Syllabus</a></li>
                                            <li><a class="dropdown-item px-0" href="calendar.html">Academic Calendar</a></li>
                                            <li><a class="dropdown-item px-0" href="library.html">Library Resources</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-3 col-md-6">
                                        <h6 class="fw-bold mb-3">Tech & Mgmt</h6>
                                        <ul class="list-unstyled">
                                            <li><a class="dropdown-item px-0" href="cs-microsite.html">Computer Science</a></li>
                                            <li><a class="dropdown-item px-0" href="commerce-microsite.html">Commerce & Management</a></li>
                                            <li><a class="dropdown-item px-0" href="engineering-microsite.html">Engineering</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-3 col-md-6">
                                        <h6 class="fw-bold mb-3">Health & Sciences</h6>
                                        <ul class="list-unstyled">
                                            <li><a class="dropdown-item px-0" href="healthcare-microsite.html">Allied Healthcare</a></li>
                                            <li><a class="dropdown-item px-0" href="yoga-microsite.html">Yoga & Humanities</a></li>
                                            <li><a class="dropdown-item px-0" href="science-microsite.html">Science & Humanities</a></li>
                                            <li><a class="dropdown-item px-0" href="physiotherapy-microsite.html">Physiotherapy</a></li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-3 col-md-6">
                                        <div class="p-4 text-center h-100 d-flex flex-column justify-content-center border glass-card">
                                            <i class="bi bi-mortarboard fs-1 mb-2" style="color:var(--theme-primary)"></i>
                                            <p class="small mb-3 text-muted">Find your perfect path at ABC University to shape the future.</p>
                                            <a href="academics.html" class="btn btn-primary-custom ">View All Programs</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle {{ACTIVE_ADMISSIONS}}" href="admissions.html" data-bs-toggle="dropdown">Admissions</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="ug-programs.html">UG Programs</a></li>
                            <li><a class="dropdown-item" href="pg-programs.html">PG Programs</a></li>
                            <li><a class="dropdown-item" href="phd.html">PhD Admissions</a></li>
                            <li><a class="dropdown-item" href="admissions.html">Fee Structure</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link {{ACTIVE_PLACEMENTS}}" href="placements.html">Placements</a></li>
                    <li class="nav-item"><a class="nav-link {{ACTIVE_FACULTY}}" href="faculty.html">Faculty</a></li>
                    <li class="nav-item"><a class="nav-link {{ACTIVE_RESEARCH}}" href="research.html">Research</a></li>
                    <li class="nav-item"><a class="nav-link {{ACTIVE_ALUMNI}}" href="alumni.html">Alumni</a></li>
                    <li class="nav-item"><a class="nav-link {{ACTIVE_NEWS}}" href="news.html">News & Blogs</a></li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <div id="google_translate_element"></div>
                    <a href="apply.html" class="btn btn-primary-custom ">Apply Now</a>
                </div>
            </div>
        </div>
    </nav>
`;

const footerTemplate = `
    <footer class="site-footer mt-auto py-5" style="background: #4A0F0F; color: #fff;">
        <div class="container">
            <div class="row g-5">
                <!-- Brand & About -->
                <div class="col-lg-4">
                    <div class="nav-brand d-flex align-items-center mb-4 text-decoration-none">
                        <i class="bi bi-mortarboard-fill me-2" style="font-size: 2.5rem; color: #C9A96E;"></i>
                        <span class="text-white h2 mb-0 fw-bold">ABC University</span>
                    </div>
                    <p class="mb-4 opacity-75">Global Education Rooted in Wisdom. A premier institution dedicated to excellence in Yoga, Holistic Science, and Modern Technology.</p>
                    <div class="footer-social d-flex gap-3">
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-4"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-4"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-4"><i class="bi bi-linkedin"></i></a>
                        <a href="#" class="text-white opacity-75 hover-opacity-100 fs-4"><i class="bi bi-instagram"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-2">
                    <h5 class="text-white fw-bold mb-4">Quick Links</h5>
                    <ul class="list-unstyled footer-links">
                        <li class="mb-2"><a href="academics.html" class="text-white opacity-50 text-decoration-none">Academics</a></li>
                        <li class="mb-2"><a href="admissions.html" class="text-white opacity-50 text-decoration-none">Admissions</a></li>
                        <li class="mb-2"><a href="research.html" class="text-white opacity-50 text-decoration-none">Research</a></li>
                        <li class="mb-2"><a href="iqac.html" class="text-white opacity-50 text-decoration-none">IQAC</a></li>
                        <li class="mb-2"><a href="mandatory-disclosure.html" class="text-white opacity-50 text-decoration-none">Mandatory Disclosure</a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div class="col-lg-3">
                    <h5 class="text-white fw-bold mb-4">Contact Us</h5>
                    <div class="d-flex mb-3">
                        <i class="bi bi-geo-alt-fill me-3" style="color: #C9A96E;"></i>
                        <p class="mb-0 small opacity-75">Vivekananda Road, Kalluballu Post, Jigani, Anekal, Bengaluru – 560105, INDIA</p>
                    </div>
                    <div class="d-flex mb-3">
                        <i class="bi bi-telephone-fill me-3" style="color: #C9A96E;"></i>
                        <p class="mb-0 small opacity-75">+91-80-2263 9968<br>+91-9070907066</p>
                    </div>
                    <div class="d-flex">
                        <i class="bi bi-envelope-fill me-3" style="color: #C9A96E;"></i>
                        <p class="mb-0 small opacity-75">info@abcuniversity.edu.in</p>
                    </div>
                </div>

                <!-- Action Button -->
                <div class="col-lg-3 text-lg-end">
                    <h5 class="text-white fw-bold mb-4">Resources</h5>
                    <a href="apply.html" class="btn btn-outline-light rounded-pill px-4 mb-3 w-100">Apply for 2026-27</a>
                    <a href="assets/pdf/university-brochure.pdf" class="btn btn-lg rounded-pill px-4 w-100 shadow-sm" style="background: #C9A96E; color: #4A0F0F; font-weight: 700;">
                        <i class="bi bi-download me-2"></i> Download Brochure
                    </a>
                </div>
            </div>

            <hr class="my-5 border-white opacity-10">

            <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center opacity-50 small">
                <p class="mb-0">&copy; 2026 ABC University. All rights reserved.</p>
                <div class="d-flex gap-4">
                    <a href="privacy-policy.html" class="text-white text-decoration-none">Privacy Policy</a>
                    <a href="terms-of-use.html" class="text-white text-decoration-none">Terms of Use</a>
                    <a href="anti-ragging.html" class="text-white text-decoration-none">Anti-Ragging</a>
                </div>
            </div>
        </div>
    </footer>
`;

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(f => {
    const p = path.join(dir, f);
    let html = fs.readFileSync(p, 'utf8');

    // 1. Standardize Nav & Footer
    let currentNavbar = navbarTemplate;
    const isActiveHome = f === 'index.html';
    const isActiveAcademics = f === 'academics.html' || f.includes('microsite') || f === 'syllabus.html' || f === 'calendar.html' || f === 'library.html';
    const isActiveAdmissions = f === 'admissions.html' || f.includes('programs') || f === 'phd.html' || f === 'apply.html';
    
    currentNavbar = currentNavbar.replace('{{ACTIVE_HOME}}', isActiveHome ? 'active' : '')
                                 .replace('{{ACTIVE_ACADEMICS}}', isActiveAcademics ? 'active' : '')
                                 .replace('{{ACTIVE_ADMISSIONS}}', isActiveAdmissions ? 'active' : '')
                                 .replace('{{ACTIVE_PLACEMENTS}}', f === 'placements.html' ? 'active' : '')
                                 .replace('{{ACTIVE_FACULTY}}', f === 'faculty.html' ? 'active' : '')
                                 .replace('{{ACTIVE_RESEARCH}}', f === 'research.html' ? 'active' : '')
                                 .replace('{{ACTIVE_ALUMNI}}', f === 'alumni.html' ? 'active' : '')
                                 .replace('{{ACTIVE_NEWS}}', f === 'news.html' ? 'active' : '');

    const navStart = html.indexOf('<nav');
    const navEnd = html.indexOf('</nav>') + 6;
    if (navStart !== -1 && navEnd !== -1) html = html.substring(0, navStart) + currentNavbar + html.substring(navEnd);

    const footerStart = html.indexOf('<footer');
    const footerEnd = html.indexOf('</footer>') + 9;
    if (footerStart !== -1 && footerEnd !== -1) html = html.substring(0, footerStart) + footerTemplate + html.substring(footerEnd);

    // 2. Clickable Cards & Apply button links
    const contentStart = html.indexOf('</nav>');
    if (contentStart !== -1) {
        let bodyContent = html.substring(contentStart);

        // Update all other "Apply Now" buttons in the body to point to apply.html
        bodyContent = bodyContent.replace(/href="admissions.html" class="btn btn-primary-custom btn-lg/g, 'href="apply.html" class="btn btn-primary-custom btn-lg');
        bodyContent = bodyContent.replace(/href="#" class="btn btn-primary-custom btn-lg px-5">Apply Now/g, 'href="apply.html" class="btn btn-primary-custom btn-lg px-5">Apply Now');

        // Academics
        if (f === 'academics.html') {
            bodyContent = bodyContent.replace(/class="glass-card theme-(.*?) p-4 text-center h-100"/g, 'class="glass-card theme-$1 p-4 text-center h-100 position-relative"');
            bodyContent = bodyContent.replace(/class="btn btn-primary-custom "/g, 'class="btn btn-primary-custom stretched-link"');
        }

        // Home
        if (f === 'index.html') {
            bodyContent = bodyContent.replace(/class="glass-card program-card"/g, 'class="glass-card program-card position-relative"');
            bodyContent = bodyContent.replace(/class="btn btn-outline-dark   mt-2"/g, 'class="btn btn-outline-dark stretched-link mt-2"');
            // Home Hero Apply button
            bodyContent = bodyContent.replace(/href="admissions.html" class="btn btn-primary-custom btn-lg px-5 me-md-3 mb-3 mb-md-0"/g, 'href="apply.html" class="btn btn-primary-custom btn-lg px-5 me-md-3 mb-3 mb-md-0"');
        }

        // Admissions
        if (f === 'admissions.html') {
            bodyContent = bodyContent.replace(/class="glass-card p-4 text-center h-100"/g, 'class="glass-card p-4 text-center h-100 position-relative"');
            bodyContent = bodyContent.replace(/class="btn btn-outline-primary mt-3"/g, 'class="btn btn-outline-primary stretched-link mt-3"');
        }

        // Research
        if (f === 'research.html') {
            bodyContent = bodyContent.replace(/class="glass-panel p-4 h-100 d-flex flex-column h-100"/g, 'class="glass-panel p-4 h-100 d-flex flex-column position-relative"');
            bodyContent = bodyContent.replace(/class="text-primary text-decoration-none fw-bold mt-3"/g, 'class="text-primary text-decoration-none fw-bold mt-3 stretched-link"');
        }

        // News
        if (f === 'news.html') {
            bodyContent = bodyContent.replace(/class="glass-card gallery-card h-100 bg-white border"/g, 'class="glass-card gallery-card h-100 bg-white border position-relative"');
            bodyContent = bodyContent.replace(/class="btn  btn-outline-dark "/g, 'class="btn btn-outline-dark stretched-link"');
        }

        html = html.substring(0, contentStart) + bodyContent;
    }

    fs.writeFileSync(p, html);
});
console.log('Final Standardization, Clickable Cards, and Apply-Link updates complete.');
