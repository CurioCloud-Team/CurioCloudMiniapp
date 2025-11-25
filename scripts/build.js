const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'miniprogram');

// 需要保留的文件和文件夹
const preserveItems = ['miniprogram_npm', '.gitkeep'];

/**
 * 清理 dist 目录，但保留指定的文件和文件夹
 */
function cleanDist() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('📁 Created dist directory');
    return;
  }

  const items = fs.readdirSync(distDir);
  
  for (const item of items) {
    if (preserveItems.includes(item)) {
      console.log(`⏭️  Preserved: ${item}`);
      continue;
    }
    
    const itemPath = path.join(distDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      fs.rmSync(itemPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(itemPath);
    }
    console.log(`🗑️  Removed: ${item}`);
  }
  
  console.log('✅ Dist directory cleaned (preserved: ' + preserveItems.join(', ') + ')');
}

/**
 * 递归复制非 .ts 文件到 dist 目录
 */
function copyNonTsFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // 跳过 miniprogram_npm，它应该已经存在于 dist 中
      if (item === 'miniprogram_npm') {
        console.log(`⏭️  Skipped copying: ${item} (should be managed by WeChat DevTools)`);
        continue;
      }
      copyNonTsFiles(srcPath, destPath);
    } else {
      // 只复制非 .ts 文件（.d.ts 文件也不需要复制）
      if (!item.endsWith('.ts')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * 主构建流程
 */
function build() {
  console.log('🚀 Starting build process...\n');
  
  // 1. 清理 dist 目录
  console.log('📦 Cleaning dist directory...');
  cleanDist();
  console.log('');
  
  // 2. 复制非 TS 文件
  console.log('📋 Copying non-TypeScript files...');
  copyNonTsFiles(srcDir, distDir);
  console.log('✅ Non-TypeScript files copied\n');
  
  console.log('🔧 TypeScript compilation will be handled by tsc...\n');
}

// 导出函数供其他脚本使用
module.exports = { cleanDist, copyNonTsFiles, build };

// 如果直接运行此脚本
if (require.main === module) {
  build();
}
