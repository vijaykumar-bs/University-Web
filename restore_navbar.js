// Standardize the Navbar across all pages
const fs = require('fs');
const path = require('path');

const originalNavbar = `
    <!-- Sticky Navigation -->
    <nav class="navbar navbar-expand-lg fixed-top bg-white shadow-sm" style="transition: all 0.3s ease;">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <i class="bi bi-mortarboard-fill me-2" style="font-size: 1.8rem; color: var(--heritage-maroon);"></i>
                <span style="color:var(--text-dark-maroon); font-weight: 800; font-size: 1.4rem;">ABC University</span>
            </a>
            <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <i class="bi bi-list fs-2" style="color: var(--text-dark-maroon);"></i>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link fw-bold" href="index.html">Home</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle fw-bold" href="#" data-bs-toggle="dropdown">Academics</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="academics.html">Academic Overview</a></li>
                            <li><a class="dropdown-item" href="syllabus.html">Syllabus</a></li>
                            <li><a class="dropdown-item" href="calendar.html">Academic Calendar</a></li>
                            <li><a class="dropdown-item" href="library.html">Library Resources</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle fw-bold" href="#" data-bs-toggle="dropdown">Admissions</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="admissions.html">Admission Process</a></li>
                            <li><a class="dropdown-item" href="ug-programs.html">UG Programs</a></li>
                            <li><a class="dropdown-item" href="pg-programs.html">PG Programs</a></li>
                            <li><a class="dropdown-item" href="admissions.html">Fee Structure</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link fw-bold" href="placements.html">Placements</a></li>
                    <li class="nav-item"><a class="nav-link fw-bold" href="faculty.html">Faculty</a></li>
                    <li class="nav-item"><a class="nav-link fw-bold" href="research.html">Research</a></li>
                    <li class="nav-item"><a class="nav-link fw-bold" href="alumni.html">Alumni</a></li>
                    <li class="nav-item"><a class="nav-link fw-bold" href="news.html">News & Blogs</a></li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <div id="google_translate_element" class="d-none d-lg-block"></div>
                    <a href="apply.html" class="btn btn-primary-custom px-4 rounded-pill">Apply Now</a>
                </div>
            </div>
        </div>
    </nav>
`;

function processHtmlFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Find the start of the bad navbar
            const startNavIndex = content.indexOf('<nav class="navbar fixed-top bg-white shadow-sm"');
            if (startNavIndex === -1) return;

            // Find the end of the full screen menu
            const endMenuIndex = content.indexOf('<!-- Page Header -->');
            let endMenuIndexAlternative = content.indexOf('<header');
            if (endMenuIndex === -1 && endMenuIndexAlternative !== -1) {
                // we use header if available
            }

            // We can reliably remove everything from the start of the <nav> to the start of <header> or <section> or whatever the main content is.
            // Let's use a regex to replace from <nav class="navbar fixed-top bg-white shadow-sm" ... down to <div id="fullscreen-menu" ...</div>
            const regex = /<!-- Custom Fullscreen Nav CSS -->[\s\S]*?<div id="fullscreen-menu" class="fullscreen-menu">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
            
            content = content.replace(regex, originalNavbar);
            // Wait, what if the regex doesn't match perfectly? The fullscreen menu has </div></div></div> at the end.
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Restored navbar in: ' + file);
        }
    });
}

// processHtmlFiles(__dirname);
