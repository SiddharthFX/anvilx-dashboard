import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const releaseDir = path.join(projectRoot, 'release');

console.log('🚀 AnvilX Dashboard - Multi-Platform Build & Deploy');
console.log('==================================================');

// Ensure release directory exists
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

try {
  // Build frontend
  console.log('📦 Building frontend...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  
  // Build for macOS
  console.log('\n🍎 Building for macOS...');
  execSync('npm run tauri:build:mac', { cwd: projectRoot, stdio: 'inherit' });
  
  // Build for Windows
  console.log('\n🪟 Building for Windows...');
  execSync('npm run tauri:build:win', { cwd: projectRoot, stdio: 'inherit' });
  
  // Build for Linux
  console.log('\n🐧 Building for Linux...');
  execSync('npm run tauri:build:linux', { cwd: projectRoot, stdio: 'inherit' });
  
  // Copy builds to release directory
  console.log('\n📁 Organizing release files...');
  
  const tauriBundleDir = path.join(projectRoot, 'src-tauri/target/release/bundle');
  
  // Copy macOS builds
  if (fs.existsSync(path.join(tauriBundleDir, 'macos'))) {
    fs.cpSync(path.join(tauriBundleDir, 'macos'), path.join(releaseDir, 'macos'), { recursive: true });
  }
  
  if (fs.existsSync(path.join(tauriBundleDir, 'dmg'))) {
    fs.cpSync(path.join(tauriBundleDir, 'dmg'), path.join(releaseDir, 'macos-dmg'), { recursive: true });
  }
  
  // Copy Windows builds
  if (fs.existsSync(path.join(tauriBundleDir, 'msi'))) {
    fs.cpSync(path.join(tauriBundleDir, 'msi'), path.join(releaseDir, 'windows'), { recursive: true });
  }
  
  // Copy Linux builds
  if (fs.existsSync(path.join(tauriBundleDir, 'appimage'))) {
    fs.cpSync(path.join(tauriBundleDir, 'appimage'), path.join(releaseDir, 'linux'), { recursive: true });
  }
  
  if (fs.existsSync(path.join(tauriBundleDir, 'deb'))) {
    fs.cpSync(path.join(tauriBundleDir, 'deb'), path.join(releaseDir, 'linux-deb'), { recursive: true });
  }
  
  // Create release info
  const releaseInfo = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    platforms: {
      macos: {
        app: 'macos/AnvilX Dashboard.app',
        dmg: 'macos-dmg/AnvilX Dashboard_1.0.0_aarch64.dmg'
      },
      windows: {
        msi: 'windows/AnvilX Dashboard_1.0.0_x64_en-US.msi'
      },
      linux: {
        appimage: 'linux/AnvilX Dashboard_1.0.0_amd64.AppImage',
        deb: 'linux-deb/anvilx-dashboard_1.0.0_amd64.deb'
      }
    }
  };
  
  fs.writeFileSync(
    path.join(releaseDir, 'release-info.json'),
    JSON.stringify(releaseInfo, null, 2)
  );
  
  console.log('\n✅ Build completed successfully!');
  console.log('📁 Release files are in the "release" directory:');
  console.log(`   ${releaseDir}`);
  
  // List generated files
  console.log('\n📋 Generated files:');
  if (fs.existsSync(path.join(releaseDir, 'macos'))) {
    console.log('   🍎 macOS: .app bundle');
  }
  if (fs.existsSync(path.join(releaseDir, 'macos-dmg'))) {
    console.log('   🍎 macOS: .dmg installer');
  }
  if (fs.existsSync(path.join(releaseDir, 'windows'))) {
    console.log('   🪟 Windows: .msi installer');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux'))) {
    console.log('   🐧 Linux: .AppImage');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux-deb'))) {
    console.log('   🐧 Linux: .deb package');
  }
  
  console.log('\n🎉 Ready for deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
