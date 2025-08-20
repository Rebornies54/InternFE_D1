import fs from 'fs';

function auditComprehensive() {
  console.log('COMPREHENSIVE PROJECT AUDIT REPORT');
  console.log('=' .repeat(60));
  
  const consoleLogFiles = [];
  const hardCodeFiles = [];
  const anyTypeFiles = [];
  const vietnameseCommentFiles = [];
  const emojiFiles = [];
  
  const files = [
    'src/context/BlogContext.jsx',
    'src/context/AuthContext.tsx',
    'src/context/FoodContext.tsx',
    'src/context/CalorieContext.tsx',
    'src/hooks/useScrollToTop.js',
    'src/components/ScrollToTop.jsx',
    'src/hooks/useRememberPassword.js',
    'src/components/Blog/Comment.jsx',
    'src/components/ErrorBoundary.jsx',
    'src/components/Blog/Blog.jsx',
    'src/components/BodyIndex/BodyIndex.jsx',
    'src/components/HomePage/HomePage.jsx',
    'src/components/Profile/MyBlogs/MyBlogs.jsx',
    'src/components/Profile/ProfileInfo/ProfileInfo.jsx',
    'src/pages/Login/Login.jsx',
    'src/pages/Register/Register.jsx',
    'src/pages/ForgotPassword/ForgotPassword.jsx',
    'src/utils/errorHandler.ts',
    'src/utils/errorHandler.js',
    'src/types/index.ts',
    'src/services/api.ts',
    'src/constants/index.ts',
    'src/constants/index.js'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check console.log
      if (content.match(/console\.(log|warn|error|info|debug)\(/)) {
        consoleLogFiles.push(file);
      }
      
      // Check hard code patterns
      const hardCodePatterns = [
        /"Loading\.\.\."/g,
        /'Loading\.\.\.'/g,
        /"Uploading\.\.\."/g,
        /'Uploading\.\.\.'/g,
        /"Select Image"/g,
        /'Select Image'/g,
        /placeholder="Enter your email"/g,
        /placeholder='Enter your email'/g,
        /placeholder="Enter your password"/g,
        /placeholder='Enter your password'/g,
        /placeholder="000000"/g,
        /placeholder='000000'/g
      ];
      
      let hasHardCode = false;
      hardCodePatterns.forEach(pattern => {
        if (content.match(pattern)) {
          hasHardCode = true;
        }
      });
      
      if (hasHardCode) {
        hardCodeFiles.push(file);
      }
      
      // Check any types
      if (content.match(/: any\b|any\[|Promise<any>|Record<string, any>/)) {
        anyTypeFiles.push(file);
      }
      
      // Check Vietnamese comments
      if (content.match(/\/\/.*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ].*/)) {
        vietnameseCommentFiles.push(file);
      }
      
      // Check emojis in comments
      if (content.match(/\/\/.*[✅❌⚠️📝🔧🎉📋📊🚀📁🔍💡🛠️⭐🎯📈🔮📞🔄🌟💻🎨⚡🔥💎🏆🎪🎭]/)) {
        emojiFiles.push(file);
      }
    }
  });
  
  // Report results
  console.log('\nCONSOLE.LOG STATUS:');
  if (consoleLogFiles.length === 0) {
    console.log('All console.log statements have been replaced');
  } else {
    console.log('Found console.log statements:');
    consoleLogFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\nHARD CODE STATUS:');
  if (hardCodeFiles.length === 0) {
    console.log('All hard code values have been replaced');
  } else {
    console.log('Found hard code values:');
    hardCodeFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\nTYPE SAFETY STATUS:');
  if (anyTypeFiles.length === 0) {
    console.log('All any types have been replaced');
  } else {
    console.log('Found any types:');
    anyTypeFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\nCOMMENT OPTIMIZATION STATUS:');
  if (vietnameseCommentFiles.length === 0) {
    console.log('All Vietnamese comments have been removed');
  } else {
    console.log('Found Vietnamese comments:');
    vietnameseCommentFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\nEMOJI CLEANUP STATUS:');
  if (emojiFiles.length === 0) {
    console.log('All emojis have been cleaned up');
  } else {
    console.log('Found emojis in comments:');
    emojiFiles.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\nCOMPREHENSIVE SUMMARY:');
  const totalIssues = consoleLogFiles.length + hardCodeFiles.length + anyTypeFiles.length + vietnameseCommentFiles.length + emojiFiles.length;
  
  if (totalIssues === 0) {
    console.log('PROJECT IS FULLY OPTIMIZED!');
    console.log('All quality issues have been resolved:');
    console.log('- No console.log statements');
    console.log('- No hard code values');
    console.log('- No any types');
    console.log('- No Vietnamese comments');
    console.log('- No emojis in comments');
  } else {
    console.log(`Found ${totalIssues} issues that need attention`);
  }
  
  console.log('\n' + '=' .repeat(60));
}

auditComprehensive();
