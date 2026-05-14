const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const scriptTag = '<script src="assets/js/ai-chatbot.js"></script>';

htmlFiles.forEach(f => {
    const p = path.join(dir, f);
    let html = fs.readFileSync(p, 'utf8');

    // Remove it if it already exists to avoid duplicates
    html = html.replace(/<script src="assets\/js\/ai-chatbot\.js"><\/script>\n?/g, '');

    // Add it right before </body>
    if (html.includes('</body>')) {
        html = html.replace('</body>', `    ${scriptTag}\n</body>`);
        fs.writeFileSync(p, html, 'utf8');
        console.log('Added AI Chatbot to: ' + f);
    }
});
