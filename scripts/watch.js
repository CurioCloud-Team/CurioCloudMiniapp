const { spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { cleanDist, copyNonTsFiles } = require('./build');

const srcDir = path.join(__dirname, '..', 'miniprogram');
const distDir = path.join(__dirname, '..', 'dist');

/**
 * 复制单个文件
 */
function copyFile(srcPath) {
  const relativePath = path.relative(srcDir, srcPath);
  const destPath = path.join(distDir, relativePath);
  const destDir = path.dirname(destPath);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);
  console.log(`📋 Copied: ${relativePath}`);
}

/**
 * 删除单个文件
 */
function removeFile(srcPath) {
  const relativePath = path.relative(srcDir, srcPath);
  const destPath = path.join(distDir, relativePath);

  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath);
    console.log(`🗑️  Removed: ${relativePath}`);
  }
}

/**
 * 启动 watch 模式
 */
function startWatch() {
  console.log('🚀 Starting development mode...\n');

  // 初始构建
  console.log('📦 Initial build...');
  cleanDist();
  copyNonTsFiles(srcDir, distDir);
  console.log('✅ Initial build completed\n');

  // 启动 TypeScript 编译器 watch 模式（使用 dev 配置，启用 sourcemap）
  console.log('🔧 Starting TypeScript compiler in watch mode with sourcemaps...');
  const tsc = spawn('npx', ['tsc', '-p', 'tsconfig.dev.json', '-w'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  tsc.on('error', (err) => {
    console.error('❌ TypeScript compiler error:', err);
  });

  // 监听非 TS 文件变化
  console.log('👀 Watching for non-TypeScript file changes...\n');
  
  const watcher = chokidar.watch(srcDir, {
    ignored: [
      /\.ts$/,           // 忽略 .ts 文件（由 tsc 处理）
      /node_modules/,    // 忽略 node_modules
      /miniprogram_npm/  // 忽略 miniprogram_npm
    ],
    persistent: true,
    ignoreInitial: true
  });

  watcher
    .on('add', copyFile)
    .on('change', copyFile)
    .on('unlink', removeFile)
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });

  // 优雅退出
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping development mode...');
    watcher.close();
    tsc.kill();
    process.exit(0);
  });
}

startWatch();
