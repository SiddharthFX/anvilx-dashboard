import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const releaseDir = path.join(projectRoot, 'release');

console.log('🚀 AnvilX Dashboard - Available Platform Deployment');
console.log('==================================================');
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
  
  // Step 4: Build for Linux
  console.log('\n🐧 Building for Linux...');
  execSync('npm run tauri:build:linux', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 5: Organize release files
  console.log('\n📁 Organizing release files...');
  
  const tauriBundleDir = path.join(projectRoot, 'src-tauri/target/release/bundle');
  const universalBundleDir = path.join(projectRoot, 'src-tauri/target/universal-apple-darwin/release/bundle');
  
  // Copy macOS builds (from universal build)
  if (fs.existsSync(path.join(universalBundleDir, 'macos'))) {
    fs.cpSync(path.join(universalBundleDir, 'macos'), path.join(releaseDir, 'macos'), { recursive: true });
    console.log('✅ macOS app bundle copied (Universal)');
  }
  
  if (fs.existsSync(path.join(universalBundleDir, 'dmg'))) {
    fs.cpSync(path.join(universalBundleDir, 'dmg'), path.join(releaseDir, 'macos-dmg'), { recursive: true });
    console.log('✅ macOS DMG installer copied (Universal)');
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
        dmg: 'macos-dmg/AnvilX Dashboard_1.0.0_universal.dmg',
        requirements: 'macOS 10.15+ (Intel & Apple Silicon)',
        type: 'Universal Binary'
      },
      linux: {
        appimage: 'linux/AnvilX Dashboard_1.0.0_amd64.AppImage',
        deb: 'linux-deb/anvilx-dashboard_1.0.0_amd64.deb',
        requirements: 'Linux (x64) - Ubuntu 18.04+, Debian 10+, etc.'
      },
      windows: {
        note: 'Windows build requires Windows environment or cross-compilation setup',
        instructions: 'See DEPLOYMENT_GUIDE.md for Windows build instructions'
      }
    },
    features: {
      customIcon: 'AnvilX logo used throughout the application',
      nativePerformance: 'Built with Tauri for optimal performance',
      crossPlatform: 'Works on macOS and Linux (Windows build available separately)',
      ethereumIntegration: 'Full Ethereum node dashboard functionality'
    },
    buildInfo: {
      builtOn: 'macOS',
      availablePlatforms: ['macOS (Universal)', 'Linux'],
      windowsBuild: 'Requires Windows environment'
    }
  };
  
  fs.writeFileSync(
    path.join(releaseDir, 'release-info.json'),
    JSON.stringify(releaseInfo, null, 2)
  );
  
  // Create a simple README for the release
  const releaseReadme = `# AnvilX Dashboard v1.0.0

## 🚀 Download Links

### macOS (Universal - Intel & Apple Silicon)
- **App Bundle**: \`macos/AnvilX Dashboard.app\` - Drag to Applications folder
- **DMG Installer**: \`macos-dmg/AnvilX Dashboard_1.0.0_universal.dmg\` - Double-click to install

### Linux
- **AppImage**: \`linux/AnvilX Dashboard_1.0.0_amd64.AppImage\` - Make executable and run
- **DEB Package**: \`linux-deb/anvilx-dashboard_1.0.0_amd64.deb\` - Install with package manager

### Windows
Windows builds are not included in this release as they require a Windows environment.
To build for Windows:
1. Use a Windows machine or virtual machine
2. Install Visual Studio Build Tools
3. Run: \`npm run tauri:build:win\`

## 🎨 Features
- Custom AnvilX branding and icons
- Native desktop performance
- Cross-platform compatibility
- Full Ethereum node dashboard functionality

## 📋 System Requirements
- **macOS**: 10.15+ (Intel & Apple Silicon)
- **Linux**: Ubuntu 18.04+, Debian 10+, or compatible (x64)
- **Windows**: Windows 10/11 (x64) - build separately

## 🔧 Installation
1. Download the appropriate file for your platform
2. Follow platform-specific installation instructions
3. Launch AnvilX Dashboard
4. Connect to your Ethereum node

## 🎨 Custom AnvilX Icon
All applications use your custom AnvilX logo:
- Application icon in dock/taskbar
- Window icon
- Installer icons
- All platform-specific icon formats

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
    console.log('   🍎 macOS: .app bundle (Universal - with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'macos-dmg'))) {
    console.log('   🍎 macOS: .dmg installer (Universal - with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux'))) {
    console.log('   🐧 Linux: .AppImage (with AnvilX icon)');
  }
  if (fs.existsSync(path.join(releaseDir, 'linux-deb'))) {
    console.log('   🐧 Linux: .deb package (with AnvilX icon)');
  }
  
  console.log('\n🎨 All applications now use your custom AnvilX icon!');
  console.log('🎉 Ready for deployment!');
  console.log('\n📝 Note: Windows builds require a Windows environment.');
  console.log('   See DEPLOYMENT_GUIDE.md for Windows build instructions.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
