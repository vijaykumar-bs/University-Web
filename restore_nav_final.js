const fs = require('fs');
const path = require('path');

const dir = __dirname;

const navbarTemplate = `    <!-- Sticky Navigation (Mega Menu) -->
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
    </nav>`;

const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(f => {
    const p = path.join(dir, f);
    let html = fs.readFileSync(p, 'utf8');

    // Remove the bad fullscreen logic scripts
    html = html.replace(/<script>\s*function toggleFullscreenMenu[\s\S]*?<\/script>/g, '');
    html = html.replace(/<!-- Fullscreen Menu Logic -->[\s\S]*?<\/script>/g, '');

    // Now remove the bad navbar CSS block down to the end of the fullscreen menu
    const badNavRegex = /<!-- Custom Fullscreen Nav CSS -->[\s\S]*?<div id="fullscreen-menu" class="fullscreen-menu">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
    
    // Fallback regex if the first one doesn't match properly
    const fallbackRegex = /<nav class="navbar fixed-top bg-white shadow-sm"[\s\S]*?<div id="fullscreen-menu" class="fullscreen-menu">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
    
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

    // Replace the bad nav
    if (html.match(badNavRegex)) {
        html = html.replace(badNavRegex, currentNavbar);
        fs.writeFileSync(p, html);
        console.log('Restored original navbar in ' + f);
    } else if (html.match(fallbackRegex)) {
        html = html.replace(fallbackRegex, currentNavbar);
        fs.writeFileSync(p, html);
        console.log('Restored original navbar (fallback) in ' + f);
    } else {
        console.log('No bad nav found in ' + f);
    }
});
