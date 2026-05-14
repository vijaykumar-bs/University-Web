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

function processHtmlFiles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isFile() && file.endsWith('.html') && file !== 'index.html') {
                let content = fs.readFileSync(filePath, 'utf8');
                
                if (!content.includes('class="floating-contact-bar"')) {
                    const bodyRegex = /(<body[^>]*>)/i;
                    if (bodyRegex.test(content)) {
                        content = content.replace(bodyRegex, `$1\n${contactBarHtml}`);
                        fs.writeFileSync(filePath, content, 'utf8');
                        console.log(`Updated: ${file}`);
                    } else {
                        console.log(`No <body> tag found in: ${file}`);
                    }
                } else {
                    console.log(`Already has floating contact bar: ${file}`);
                }
            }
        });
    });
}

processHtmlFiles(directoryPath);
