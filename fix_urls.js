const fs = require('fs');
const path = require('path');

const directoryPaths = [__dirname, path.join(__dirname, 'admin'), path.join(__dirname, 'assets', 'js')];

function processFiles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) return;
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isFile() && (file.endsWith('.html') || file.endsWith('.js'))) {
                let content = fs.readFileSync(filePath, 'utf8');
                let newContent = content.replace(/http:\/\/localhost:5000\/api/g, '/api');
                newContent = newContent.replace(/http:\/\/localhost:5500\/api/g, '/api');
                if (content !== newContent) {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                    console.log(`Updated API URLs in: ${file}`);
                }
            }
        });
    });
}

directoryPaths.forEach(dir => processFiles(dir));
