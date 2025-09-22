import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const releaseDir = path.join(projectRoot, 'release');

console.log('🚀 AnvilX Dashboard - Multi-Platform Deployment');
console.log('===============================================');
console.log('🎨 Using AnvilX custom icon for all platforms');
console.log('');

// Ensure release directory exists
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
const distDir = path.join(projectRoot, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

try {
  // Step 1: Generate all icons from AnvilX icon
  console.log('🎨 Generating AnvilX icons for all platforms...');
  execSync('node scripts/generate-icons.js', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 2: Build frontend
  console.log('\n📦 Building frontend...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 3: Build for macOS (Universal - Intel + Apple Silicon)
  console.log('\n🍎 Building for macOS (Universal)...');
  execSync('npm run tauri:build:mac', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 4: Build for Windows
  console.log('\n🪟 Building for Windows...');
  execSync('npm run tauri:build:win', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 5: Build for Linux
  console.log('\n🐧 Building for Linux...');
  execSync('npm run tauri:build:linux', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 6: Organize release files
  console.log('\n📁 Organizing release files...');
  
  const tauriBundleDir = path.join(projectRoot, 'src-tauri/target/release/bundle');
  
  // Copy macOS builds
  if (fs.existsSync(path.join(tauriBundleDir, 'macos'))) {
    fs.cpSync(path.join(tauriBundleDir, 'macos'), path.join(releaseDir, 'macos'), { recursive: true });
    console.log('✅ macOS app bundle copied');
  }
  
  if (fs.existsSync(path.join(tauriBundleDir, 'dmg'))) {
    fs.cpSync(path.join(tauriBundleDir, 'dmg'), path.join(releaseDir, 'macos-dmg'), { recursive: true });
    console.log('✅ macOS DMG installer copied');
  }
  
  // Copy Windows builds
  if (fs.existsSync(path.join(tauriBundleDir, 'msi'))) {
    fs.cpSync(path.join(tauriBundleDir, 'msi'), path.join(releaseDir, 'windows'), { recursive: true });
    console.log('✅ Windows MSI installer copied');
  }
  
  // Copy Linux builds
  if (fs.existsSync(path.join(tauriBundleDir, 'appimage'))) {
    fs.cpSync(path.join(tauriBundleDir, 'appimage'), path.join(releaseDir, 'linux'), { recursive: true });
    console.log('✅ Linux AppImage copied');
  }
  
  if (fs.existsSync(path.join(tauriBundleDir, 'deb'))) {
    fs.cpSync(path.join(tauriBundleDir, 'deb'), path.join(releaseDir, 'linux-deb'), { recursive: true });
    console.log('✅ Linux DEB package copied');
  }
  
  // Create comprehensive release info
  const releaseInfo = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    application: {
      name: 'AnvilX Dashboard',
      description: 'Premium Ethereum local node dashboard and viewer',
      identifier: 'com.anvilx.dashboard',
      publisher: 'AnvilX Team',
      copyright: '© 2024 AnvilX Team. All rights reserved.'
    },
    platforms: {
      macos: {
        app: 'macos/AnvilX Dashboard.app',
        dmg: 'macos-dmg/AnvilX Dashboard_1.0.0_aarch64.dmg',
        requirements: 'macOS 10.15+ (Intel & Apple Silicon)'
      },
      windows: {
        msi: 'windows/AnvilX Dashboard_1.0.0_x64_en-US.msi',
        requirements: 'Windows 10/11 (x64)'
      },
      linux: {
        appimage: 'linux/AnvilX Dashboard_1.0.0_amd64.AppImage',
        deb: 'linux-deb/anvilx-dashboard_1.0.0_amd64.deb',
        requirements: 'Linux (x64) - Ubuntu 18.04+, Debian 10+, etc.'
      }
    },
    features: {
      customIcon: 'AnvilX logo used throughout the application',
      nativePerformance: 'Built with Tauri for optimal performance',
      crossPlatform: 'Works on Windows, macOS, and Linux',
      ethereumIntegration: 'Full Ethereum node dashboard functionality'
    }
  };
  
  fs.writeFileSync(
    path.join(releaseDir, 'release-info.json'),
    JSON.stringify(releaseInfo, null, 2)
  );
  
  // Create a simple README for the release
  const releaseReadme = `# AnvilX Dashboard v1.0.0

## 🚀 Download Links

### macOS
- **App Bundle**: \`macos/AnvilX Dashboard.app\` - Drag to Applications folder
- **DMG Installer**: \`macos-dmg/AnvilX Dashboard_1.0.0_aarch64.dmg\` - Double-click to install

### Windows
- **MSI Installer**: \`windows/AnvilX Dashboard_1.0.0_x64_en-US.msi\` - Double-click to install

### Linux
- **AppImage**: \`linux/AnvilX Dashboard_1.0.0_amd64.AppImage\` - Make executable and run
- **DEB Package**: \`linux-deb/anvilx-dashboard_1.0.0_amd64.deb\` - Install with package manager

## 🎨 Features
- Custom AnvilX branding and icons
- Native desktop performance
- Cross-platform compatibility
- Full Ethereum node dashboard functionality

## 📋 System Requirements
- **macOS**: 10.15+ (Intel & Apple Silicon)
- **Windows**: Windows 10/11 (x64)
- **Linux**: Ubuntu 18.04+, Debian 10+, or compatible (x64)

## 🔧 Installation
1. Download the appropriate file for your platform
2. Follow platform-specific installation instructions
3. Launch AnvilX Dashboard
4. Connect to your Ethereum node

---
Built with ❤️ by AnvilX Team
`;

  fs.writeFileSync(path.join(releaseDir, 'README.md'), releaseReadme);
  
  console.log('\n✅ Build completed successfully!');
  console.log('📁 Release files are in the "release" directory:');
  console.log(`   ${releaseDir}`);
  
  // List generated files
  console.log('\n📋 Generated files:');
  if (fs.existsSync(path.join(releaseDir, 'macos'))) {
    console.log('   🍎 macOS: .app bundle (with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'macos-dmg'))) {
    console.log('   🍎 macOS: .dmg installer (with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'windows'))) {
    console.log('   🪟 Windows: .msi installer (with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux'))) {
    console.log('   🐧 Linux: .AppImage (with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux-deb'))) {
    console.log('   🐧 Linux: .deb package (with AnvilX icon)');
  }
  
  console.log('\n🎨 All applications now use your custom AnvilX icon!');
  console.log('🎉 Ready for deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
