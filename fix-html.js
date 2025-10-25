const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Flask template syntax with static paths
    content = content.replace(/\{\{\s*url_for\('static',\s*filename='css\/style\.css'\)\s*\}\}/g, '/css/style.css');
    content = content.replace(/\{\{\s*url_for\('static',\s*filename='js\/(\w+)\.js'\)\s*\}\}/g, '/js/$1.js');
    
    // Add Socket.IO script before closing body tag if not already present
    if (!content.includes('socket.io.js') && file !== 'index.html' && file !== 'login.html' && file !== 'register.html') {
        content = content.replace('</body>', `    <script src="/socket.io/socket.io.js"></script>\n    <script src="/js/socket.js"></script>\n</body>`);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
});

console.log('All HTML files updated successfully!');
