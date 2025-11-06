const fs = require('fs');
const path = require('path');

function generateSummary(dir, indent = 0) {
  let summary = '';
  const items = fs.readdirSync(dir).sort();
  
  // Directories to exclude
  const excludeDirs = ['.', 'node_modules', 'img'];
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    // Skip hidden files, node_modules, img, etc.
    if (item.startsWith('.') || excludeDirs.includes(item) || item === 'SUMMARY.md') {
      return;
    }
    
    if (stat.isDirectory()) {
      const readmePath = path.join(fullPath, 'README.md');
      const hasReadme = fs.existsSync(readmePath);
      
      if (hasReadme) {
        const spaces = '  '.repeat(indent);
        const title = item.charAt(0).toUpperCase() + item.slice(1);
        summary += `${spaces}* [${title}](${fullPath}/README.md)\n`;
        summary += generateSummary(fullPath, indent + 1);
      } else {
        summary += generateSummary(fullPath, indent);
      }
    } else if (item.endsWith('.md') && item !== 'README.md') {
      const spaces = '  '.repeat(indent);
      const name = path.basename(item, '.md');
      summary += `${spaces}* [${name}](${fullPath})\n`;
    }
  });
  
  return summary;
}

function createSummary() {
  let summary = '# Table of contents\n\n';
  
  // Add root README.md
  if (fs.existsSync('README.md')) {
    summary += '* [xffsec](README.md)\n\n';
  }
  
  // Get all top-level directories
  const items = fs.readdirSync('.').sort();
  const excludeDirs = ['.', 'node_modules', 'img'];
  
  items.forEach(item => {
    const stat = fs.statSync(item);
    
    if (stat.isDirectory() && !item.startsWith('.') && !excludeDirs.includes(item)) {
      const title = item.toUpperCase();
      summary += `## ${title}\n\n`;
      summary += generateSummary(item, 0);
      summary += '\n';
    }
  });
  
  fs.writeFileSync('SUMMARY.md', summary);
  console.log('SUMMARY.md generated successfully!');
}

createSummary();
