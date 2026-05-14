const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

const contactBarHtml = `
    <!-- Floating Contact Bar -->
    <div class="floating-contact-bar">
        <a href="tel:+918762996815" class="contact-item">
            <div class="icon-container"><i class="bi bi-telephone-fill"></i></div>
            <div class="contact-info">
                <span class="contact-label">Call Us Today</span>
                <span class="contact-detail">+918762996815</span>
            </div>
        </a>
        <a href="mailto:info@abcuniversity.edu.in" class="contact-item">
            <div class="icon-container"><i class="bi bi-envelope-at-fill"></i></div>
            <div class="contact-info">
                <span class="contact-label">Email Us</span>
                <span class="contact-detail">info@abcuniversity.edu.in</span>
            </div>
        </a>
        <a href="https://wa.me/918762996815" class="contact-item">
            <div class="icon-container"><i class="bi bi-whatsapp"></i></div>
            <div class="contact-info">
                <span class="contact-label">WhatsApp</span>
                <span class="contact-detail">+918762996815</span>
            </div>
        </a>
    </div>
`;

function cleanupFloatingContactBar(content) {
    const bodyMatch = content.match(/<body[^>]*>/i);
    if (!bodyMatch) {
        return content;
    }

    const bodyEndIndex = bodyMatch.index + bodyMatch[0].length;
    const afterBody = content.slice(bodyEndIndex);
    const lowerAfterBody = afterBody.toLowerCase();
    const markers = ['<!-- navigation -->', '<nav', '<header', '<main', '<section', '<div class="container">', '<div class="hero">', '<div class="wrapper">', '<div class="content">'];
    let markerIndex = -1;

    for (const marker of markers) {
        const idx = lowerAfterBody.indexOf(marker);
        if (idx !== -1 && (markerIndex === -1 || idx < markerIndex)) {
            markerIndex = idx;
        }
    }

    if (markerIndex === -1) {
        return content;
    }

    const prefix = content.slice(0, bodyEndIndex);
    const suffix = afterBody.slice(markerIndex);
    return prefix + suffix;
}

function processHtmlFiles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isFile() && file.endsWith('.html') && file !== 'index.html') {
                let content = fs.readFileSync(filePath, 'utf8');
                const cleanedContent = cleanupFloatingContactBar(content);
                const bodyRegex = /(<body[^>]*>)/i;

                if (!bodyRegex.test(cleanedContent)) {
                    console.log(`No <body> tag found in: ${file}`);
                    return;
                }

                const updatedContent = cleanedContent.replace(bodyRegex, `$1\n${contactBarHtml}`);
                if (updatedContent !== content) {
                    fs.writeFileSync(filePath, updatedContent, 'utf8');
                    console.log(`Cleaned and updated: ${file}`);
                } else {
                    console.log(`No changes needed: ${file}`);
                }
            }
        });
    });
}

processHtmlFiles(directoryPath);
