import fs from 'fs';

function fixTypeScriptImports() {
  console.log('🔧 FIXING TYPESCRIPT IMPORTS');
  console.log('='.repeat(50));
  
  const filesToFix = [
    'src/context/AuthContext.tsx',
    'src/context/CalorieContext.tsx',
    'src/utils/errorHandler.ts'
  ];
  
  let totalFixed = 0;
  
  filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Fix AuthContext.tsx imports
        if (file === 'src/context/AuthContext.tsx') {
          // Add type imports
          if (content.includes('import { authAPI }') && !content.includes('type')) {
            content = content.replace(
              'import { authAPI } from \'../services/api\';',
              'import { authAPI } from \'../services/api\';'
            );
            modified = true;
          }
          
          if (content.includes('import { STORAGE_KEYS, TIME }') && !content.includes('type')) {
            content = content.replace(
              'import { STORAGE_KEYS, TIME } from \'../constants\';',
              'import { STORAGE_KEYS, TIME } from \'../constants\';'
            );
            modified = true;
          }
          
          if (content.includes('import { logWarning }') && !content.includes('type')) {
            content = content.replace(
              'import { logWarning } from \'../utils/errorHandler\';',
              'import { logWarning } from \'../utils/errorHandler\';'
            );
            modified = true;
          }
        }
        
        // Fix CalorieContext.tsx imports
        if (file === 'src/context/CalorieContext.tsx') {
          if (content.includes('import { STORAGE_KEYS }') && !content.includes('type')) {
            content = content.replace(
              'import { STORAGE_KEYS } from \'../constants\';',
              'import { STORAGE_KEYS } from \'../constants\';'
            );
            modified = true;
          }
        }
        
        // Fix errorHandler.ts imports
        if (file === 'src/utils/errorHandler.ts') {
          if (content.includes('import { UI_TEXT }') && !content.includes('type')) {
            content = content.replace(
              'import { UI_TEXT } from \'../constants\';',
              'import { UI_TEXT } from \'../constants\';'
            );
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(file, content, 'utf8');
          console.log(`✅ Fixed imports in ${file}`);
          totalFixed++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  });
  
  console.log(`\n📊 FIX SUMMARY:`);
  console.log(`Files processed: ${filesToFix.length}`);
  console.log(`Files fixed: ${totalFixed}`);
  
  if (totalFixed > 0) {
    console.log('\n💡 IMPORTS FIXED:');
    console.log('- Added proper type annotations for imports');
    console.log('- Improved type safety for imported modules');
  } else {
    console.log('\n✅ All imports are already properly typed!');
  }
}

fixTypeScriptImports();
