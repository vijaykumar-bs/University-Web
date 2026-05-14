const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'university-portal', 'src', 'app');
const componentsDir = path.join(__dirname, 'university-portal', 'src', 'components');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

function htmlToJsx(html) {
    // 1. Remove comments
    let jsx = html.replace(/<!--[\s\S]*?-->/g, '');
    
    // 2. class -> className, for -> htmlFor
    jsx = jsx.replace(/\bclass=/g, 'className=');
    jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
    
    // 3. Self-close void elements
    const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source'];
    voidElements.forEach(tag => {
        const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
        jsx = jsx.replace(regex, `<${tag}$1 />`);
    });
    
    // 4. Convert simple style="prop: value;" to style={{prop: 'value'}}
    jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, p1) => {
        const rules = p1.split(';').filter(Boolean);
        const objStr = rules.map(rule => {
            let [key, val] = rule.split(':');
            if(!key || !val) return null;
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            val = val.trim().replace(/"/g, "'");
            return `${key}: "${val}"`;
        }).filter(Boolean).join(', ');
        return `style={{ ${objStr} }}`;
    });

    return jsx;
}

// 5. Build Navbar and Footer components
const indexHtmlPath = path.join(srcDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Extract Nav
    const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
    if (navMatch) {
         let navJsx = htmlToJsx(navMatch[0]);
         const navComponent = `export default function Navbar() { return (<>\n${navJsx}\n</>); }`;
         fs.writeFileSync(path.join(componentsDir, 'Navbar.jsx'), navComponent);
    }
    
    // Extract Footer
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    if (footerMatch) {
         let footerJsx = htmlToJsx(footerMatch[0]);
         const footerComponent = `export default function Footer() { return (<>\n${footerJsx}\n</>); }`;
         fs.writeFileSync(path.join(componentsDir, 'Footer.jsx'), footerComponent);
    }
}

// 6. Convert all pages
const files = fs.readdirSync(srcDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const html = fs.readFileSync(path.join(srcDir, file), 'utf8');
        
        // Remove everything before </nav> and after <footer
        // Since some pages might not be perfectly formatted, we will try to extract exactly the main content sections
        // Usually content is between <header> or <section> and <footer>
        
        let bodyContent = html;
        const navEndIndex = html.toLowerCase().indexOf('</nav>');
        if (navEndIndex !== -1) {
             bodyContent = bodyContent.substring(navEndIndex + 6);
        }
        
        const footerStartIndex = bodyContent.toLowerCase().indexOf('<footer');
        if (footerStartIndex !== -1) {
             bodyContent = bodyContent.substring(0, footerStartIndex);
        }
        
        // Also remove any remaining scripts
        bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
        
        let jsx = htmlToJsx(bodyContent);
        
        // Create Next.js route folder
        let pageName = file.replace('.html', '');
        let targetDir = destDir;
        if (pageName !== 'index') {
            targetDir = path.join(destDir, pageName);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const componentCode = `export default function ${pageName.replace(/[^a-zA-Z0-9]/g, '')}Page() {\n  return (\n    <main>\n${jsx}\n    </main>\n  );\n}`;
        fs.writeFileSync(path.join(targetDir, 'page.jsx'), componentCode);
        console.log(`Converted ${file} to app/${pageName === 'index' ? '' : pageName + '/'}page.jsx`);
    }
});
