import fs from 'fs';
import path from 'path';

function checkInlineStyles() {
  console.log('🔍 INLINE STYLES AUDIT');
  console.log('='.repeat(50));
  
  const srcDir = 'src';
  const files = [];
  const inlineStyles = [];
  
  // Collect all JSX/TSX files
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.jsx') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(srcDir);
  
  // Check each file for inline styles
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for inline styles
        if (line.includes('style={') || line.includes('style={{')) {
          inlineStyles.push({
            file: file.replace(/\\/g, '/'),
            line: lineNum,
            content: line.trim()
          });
        }
      });
      
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
    }
  });
  
  // Generate report
  console.log(`\n📊 FOUND ${inlineStyles.length} INLINE STYLES:`);
  
  if (inlineStyles.length === 0) {
    console.log('✅ No inline styles found! Code is clean.');
  } else {
    console.log('\n🔍 DETAILS:');
    inlineStyles.forEach((style, index) => {
      console.log(`${index + 1}. ${style.file}:${style.line}`);
      console.log(`   ${style.content}`);
    });
    
    // Group by file
    const byFile = {};
    inlineStyles.forEach(style => {
      if (!byFile[style.file]) {
        byFile[style.file] = [];
      }
      byFile[style.file].push(style);
    });
    
    console.log('\n📁 BY FILE:');
    Object.entries(byFile).forEach(([file, styles]) => {
      console.log(`${file}: ${styles.length} inline styles`);
    });
  }
  
  console.log('\n💡 RECOMMENDATION:');
  if (inlineStyles.length > 0) {
    console.log(`❌ Found ${inlineStyles.length} inline styles that should be moved to CSS classes`);
  } else {
    console.log('✅ No inline styles found - good practice!');
  }
}

checkInlineStyles();
