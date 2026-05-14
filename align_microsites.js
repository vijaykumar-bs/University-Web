const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/vijay/OneDrive/Desktop/Vijay-svyasa';
const microsites = [
    'cs-microsite.html', 'commerce-microsite.html', 'engineering-microsite.html',
    'healthcare-microsite.html', 'yoga-microsite.html', 'science-microsite.html',
    'physiotherapy-microsite.html'
];

microsites.forEach(f => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) return;
    let html = fs.readFileSync(p, 'utf8');

    // Update card container for flex alignment
    html = html.replace(/<div class="glass-card p-4 h-100">/g, '<div class="glass-card p-4 h-100 d-flex flex-column">');
    
    // Update button to push to bottom
    html = html.replace(/class="btn btn-outline-dark mt-3"/g, 'class="btn btn-outline-dark mt-auto"');
    
    // Also handle "Curriculum" buttons in commerce
    html = html.replace(/class="btn btn-outline-dark mt-3">Curriculum<\/a>/g, 'class="btn btn-outline-dark mt-auto">Curriculum<\/a>');

    fs.writeFileSync(p, html);
    console.log('Aligned cards in ' + f);
});
