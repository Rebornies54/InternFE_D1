import fs from 'fs';
import path from 'path';

function auditTypeScript() {
  console.log('🔍 TYPESCRIPT STRICT AUDIT');
  console.log('='.repeat(50));
  
  const srcDir = 'src';
  const files = [];
  const issues = {
    anyTypes: [],
    implicitAny: [],
    untypedImports: [],
    missingTypes: [],
    looseTypes: []
  };
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(srcDir);
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for any types
        if (line.includes(': any') || line.includes('any[') || line.includes('Promise<any>')) {
          issues.anyTypes.push({
            file: file.replace(/\\/g, '/'),
            line: lineNum,
            content: line.trim()
          });
        }
        
        // Check for implicit any patterns
        if (line.includes('function(') && !line.includes(':') && line.includes(')')) {
          if (!line.includes('//') && !line.includes('/*')) {
            issues.implicitAny.push({
              file: file.replace(/\\/g, '/'),
              line: lineNum,
              content: line.trim()
            });
          }
        }
        
        // Check for untyped imports
        if (line.includes('import') && line.includes('from') && !line.includes('type') && !line.includes('interface')) {
          if (line.includes('{') && line.includes('}') && !line.includes('as')) {
            // Check if imported items have types
            const importMatch = line.match(/import\s*{([^}]+)}\s*from/);
            if (importMatch) {
              const imports = importMatch[1].split(',').map(i => i.trim());
              imports.forEach(imp => {
                if (!imp.includes(':')) {
                  issues.untypedImports.push({
                    file: file.replace(/\\/g, '/'),
                    line: lineNum,
                    import: imp,
                    content: line.trim()
                  });
                }
              });
            }
          }
        }
        
        // Check for loose types
        if (line.includes(': string') || line.includes(': number') || line.includes(': boolean')) {
          if (line.includes('|') && line.includes('null') || line.includes('undefined')) {
            issues.looseTypes.push({
              file: file.replace(/\\/g, '/'),
              line: lineNum,
              content: line.trim()
            });
          }
        }
      });
      
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
    }
  });
  
  // Generate report
  console.log(`\n📊 TYPESCRIPT AUDIT RESULTS:`);
  console.log(`Files scanned: ${files.length}`);
  
  console.log('\n🔍 ANY TYPES:');
  if (issues.anyTypes.length === 0) {
    console.log('✅ No explicit any types found');
  } else {
    console.log(`❌ Found ${issues.anyTypes.length} any types:`);
    issues.anyTypes.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ${issue.content}`);
    });
  }
  
  console.log('\n🔍 IMPLICIT ANY:');
  if (issues.implicitAny.length === 0) {
    console.log('✅ No implicit any patterns found');
  } else {
    console.log(`❌ Found ${issues.implicitAny.length} potential implicit any:`);
    issues.implicitAny.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ${issue.content}`);
    });
  }
  
  console.log('\n🔍 UNTYPED IMPORTS:');
  if (issues.untypedImports.length === 0) {
    console.log('✅ All imports are properly typed');
  } else {
    console.log(`❌ Found ${issues.untypedImports.length} untyped imports:`);
    issues.untypedImports.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line} - ${issue.import}`);
    });
  }
  
  console.log('\n🔍 LOOSE TYPES:');
  if (issues.looseTypes.length === 0) {
    console.log('✅ No loose type definitions found');
  } else {
    console.log(`⚠️  Found ${issues.looseTypes.length} potentially loose types:`);
    issues.looseTypes.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.file}:${issue.line}`);
      console.log(`   ${issue.content}`);
    });
  }
  
  const totalIssues = issues.anyTypes.length + issues.implicitAny.length + issues.untypedImports.length + issues.looseTypes.length;
  
  console.log('\n📈 STRICT TYPESCRIPT SUMMARY:');
  if (totalIssues === 0) {
    console.log('🎉 EXCELLENT! Project follows strict TypeScript practices');
    console.log('✅ No any types');
    console.log('✅ No implicit any');
    console.log('✅ All imports properly typed');
    console.log('✅ Type definitions are precise');
  } else {
    console.log(`⚠️  Found ${totalIssues} issues that could improve type safety`);
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Replace any types with specific interfaces');
    console.log('2. Add explicit type annotations to functions');
    console.log('3. Use union types instead of loose types');
    console.log('4. Consider using branded types for better type safety');
  }
  
  console.log('\n🔧 STRICT TYPESCRIPT BEST PRACTICES:');
  console.log('✅ Use specific interfaces instead of any');
  console.log('✅ Add explicit return types to functions');
  console.log('✅ Use union types for multiple possible values');
  console.log('✅ Use branded types for domain-specific types');
  console.log('✅ Enable all strict TypeScript compiler options');
  console.log('✅ Use ESLint TypeScript rules');
  console.log('✅ Regular type audits with this script');
}

auditTypeScript();
