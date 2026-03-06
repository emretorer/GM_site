const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, 'src', 'pages', 'marketing', 'MarketingIndex.jsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Applying CSS fixes...');

// Fix hero section - add min-height and flexbox
content = content.replace(
  /\.hero { \\n\s+padding-top: 110px; padding-bottom: 60px;(.*?)position: relative; overflow: hidden; \\n\s+}/,
  `.hero { \\n            min-height: 100vh;\\n            display: flex;\\n            flex-direction: column;\\n            justify-content: center;\\n            padding-top: 110px; padding-bottom: 60px;$1position: relative; overflow: hidden; \\n        }`
);

// Fix comparison section
content = content.replace(
  /\.comparison-section {\\n\s+padding: 3rem 0;\\n\s+overflow: hidden;\\n}/,
  `.comparison-section {\\n    min-height: 100vh;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: center;\\n    padding: 3rem 0;\\n    overflow: hidden;\\n}`
);

// Fix process section
content = content.replace(
  /\.process-section {\\n\s+padding: 6rem 0;\\n\s+background: #FFFFFF;\\n\s+position: relative;\\n\s+overflow: hidden;\\n}/,
  `.process-section {\\n    min-height: 100vh;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: center;\\n    padding: 6rem 0;\\n    background: #FFFFFF;\\n    position: relative;\\n    overflow: hidden;\\n}`
);

// Fix guide section
content = content.replace(
  /\.guide-section {\\n\s+background: #0B0F19;(.*?)padding: 6rem 0;/,
  `.guide-section {\\n    min-height: 100vh;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: center;\\n    background: #0B0F19;$1padding: 6rem 0;`
);

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ CSS changes applied successfully!');
console.log('✓ Added min-height: 100vh to hero, comparison, process, and guide sections');
