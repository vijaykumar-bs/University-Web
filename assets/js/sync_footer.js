const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/vijay/OneDrive/Desktop/Vijay-svyasa';
const files = [
    'index.html', 'academics.html', 'placements.html', 'faculty.html', 
    'research.html', 'alumni.html', 'news.html', 'cs-microsite.html', 
    'commerce-microsite.html', 'engineering-microsite.html', 
    'healthcare-microsite.html', 'yoga-microsite.html', 
    'science-microsite.html', 'physiotherapy-microsite.html'
];

const newFooter = `
    <footer class="site-footer mt-auto">
        <div class="container">
            <div class="row g-5">
                <!-- Branding & Tagline -->
                <div class="col-lg-3">
                    <div class="navbar-brand d-flex align-items-center mb-4">
                        <i class="bi bi-mortarboard-fill me-2" style="font-size: 2.2rem; color: var(--accent-soft-gold);"></i>
                        <span class="text-white h3 mb-0 fw-bold">ABC University</span>
                    </div>
                    <p class="contact-info mb-4">Global Education Rooted in Wisdom. Leading the world in Yoga and Holistic Science research.</p>
                    <div class="footer-social">
                        <a href="#"><i class="bi bi-facebook"></i></a>
                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                        <a href="#"><i class="bi bi-linkedin"></i></a>
                        <a href="#"><i class="bi bi-instagram"></i></a>
                    </div>
                </div>

                <!-- Global City Campus -->
                <div class="col-lg-4">
                    <h5>Global City Campus</h5>
                    <div class="campus-block">
                        <div class="contact-info">
                            <span class="campus-title">Contact Details</span>
                            <p class="mb-1"><strong>Mob:</strong> +91-9070907066 | +91-9070907099</p>
                            <p class="mb-1"><strong>Land:</strong> 080-22639998</p>
                            <p class="mb-3"><strong>Email:</strong> info@abcuniversity.edu.in</p>
                            
                            <span class="campus-title">Campus Address</span>
                            <p class="mb-3">Sattva Global City, Mysore Road, Rajarajeshwari nagar,<br>Bengaluru, Karnataka - 560059, INDIA</p>
                            
                            <a href="#" class="text-decoration-none" style="color:var(--accent-soft-gold); font-size:12px; font-weight:600; text-transform:uppercase;">
                                <i class="bi bi-geo-alt-fill me-1"></i> View on Location Map
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Prashanthi Kutiram Campus -->
                <div class="col-lg-5">
                    <h5>Prashanthi Kutiram Campus</h5>
                    <div class="row g-0">
                        <div class="col-md-6">
                            <div class="campus-block pe-3">
                                <span class="campus-title">Contact Details</span>
                                <div class="contact-info">
                                    <p class="mb-1"><strong>Mob:</strong> +91-87629 96815 <br>+91-7022024777</p>
                                    <p class="mb-1"><strong>Land:</strong> 080-2263 9968</p>
                                    <p class="mb-0"><strong>Email:</strong> info@abcuniversity.edu.in</p>
                                    <p class="mb-0">admissions@abcuniversity.edu.in</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="campus-block">
                                <span class="campus-title">Campus Address</span>
                                <div class="contact-info">
                                    <p class="mb-3">Prashanti Kutiram, Vivekananda Road, Kalluballu Post, Jigani, Anekal,<br>Bengaluru – 560105, INDIA</p>
                                    <a href="#" class="text-decoration-none" style="color:var(--accent-soft-gold); font-size:12px; font-weight:600; text-transform:uppercase;">
                                        <i class="bi bi-geo-alt-fill me-1"></i> View on Location Map
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center">
                <p class="mb-0">&copy; 2026 ABC University. All rights reserved.</p>
                <div class="d-flex gap-4">
                    <a href="#" class="text-decoration-none text-light opacity-50">Privacy Policy</a>
                    <a href="#" class="text-decoration-none text-light opacity-50">Terms of Use</a>
                    <a href="#" class="text-decoration-none text-light opacity-50">Anti-Ragging</a>
                </div>
            </div>
        </div>
    </footer>
`;

files.forEach(f => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) return;
    let html = fs.readFileSync(p, 'utf8');
    
    // Replace old footer
    const footerStart = html.indexOf('<footer');
    const footerEnd = html.indexOf('</footer>') + 9;
    
    if (footerStart !== -1 && footerEnd !== -1) {
        html = html.substring(0, footerStart) + newFooter + html.substring(footerEnd);
    } else {
        // If footer is missing, append it before </body>
        const bodyEnd = html.indexOf('</body>');
        if (bodyEnd !== -1) {
            html = html.substring(0, bodyEnd) + newFooter + '\n' + html.substring(bodyEnd);
        }
    }

    fs.writeFileSync(p, html);
    console.log('Updated Footer for ' + f);
});
