import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const releaseDir = path.join(projectRoot, 'release');

console.log('🚀 AnvilX Dashboard - Perfect Disk Images');
console.log('=========================================');
console.log('🎨 Featuring redesigned Accounts page with modern UI');
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
  
  // Step 2: Build frontend with improved UI
  console.log('\n📦 Building frontend with redesigned Accounts page...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 3: Build for macOS (Universal - Intel + Apple Silicon)
  console.log('\n🍎 Building for macOS (Universal)...');
  execSync('npm run tauri:build:mac', { cwd: projectRoot, stdio: 'inherit' });
  
  // Step 4: Organize release files
  console.log('\n📁 Organizing perfect disk images...');
  
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
    features: {
      customIcon: 'AnvilX logo used throughout the application',
      redesignedUI: 'Modern, sleek Accounts page with improved private key display',
      nativePerformance: 'Built with Tauri for optimal performance',
      crossPlatform: 'Works on macOS (Universal Binary)',
      ethereumIntegration: 'Full Ethereum node dashboard functionality'
    },
    platforms: {
      macos: {
        app: 'macos/AnvilX Dashboard.app',
        dmg: 'macos-dmg/AnvilX Dashboard_1.0.0_universal.dmg',
        requirements: 'macOS 10.15+ (Intel & Apple Silicon)',
        type: 'Universal Binary',
        features: [
          'Native macOS integration',
          'Custom AnvilX branding',
          'Redesigned Accounts page',
          'Modern private key display',
          'Security warnings and indicators'
        ]
      }
    },
    uiImprovements: {
      accountsPage: [
        'Modern card-based layout',
        'Enhanced private key security display',
        'Visual security indicators',
        'Improved copy functionality',
        'Better visual hierarchy',
        'Color-coded sections (blue for address, red for private key)',
        'Animated security warnings',
        'Professional typography and spacing'
      ]
    },
    buildInfo: {
      builtOn: 'macOS',
      availablePlatforms: ['macOS (Universal)'],
      uiVersion: '2.0 - Redesigned',
      iconSet: 'Custom AnvilX branding'
    }
  };
  
  fs.writeFileSync(
    path.join(releaseDir, 'release-info.json'),
    JSON.stringify(releaseInfo, null, 2)
  );
  
  // Create a beautiful README for the release
  const releaseReadme = `# AnvilX Dashboard v1.0.0 - Perfect Disk Images

## 🎨 What's New

### Redesigned Accounts Page
- **Modern UI**: Sleek, professional design with improved visual hierarchy
- **Enhanced Private Key Display**: Secure, visually appealing private key management
- **Security Indicators**: Clear visual feedback for security states
- **Better UX**: Improved copy functionality and user interactions

### Visual Improvements
- Color-coded sections (Blue for addresses, Red for private keys)
- Animated security warnings and indicators
- Professional typography and spacing
- Modern card-based layout
- Enhanced security messaging

## 🚀 Download Links

### macOS (Universal - Intel & Apple Silicon)
- **App Bundle**: \`macos/AnvilX Dashboard.app\` - Drag to Applications folder
- **DMG Installer**: \`macos-dmg/AnvilX Dashboard_1.0.0_universal.dmg\` - Double-click to install

## 🎨 Features
- Custom AnvilX branding and icons
- Redesigned Accounts page with modern UI
- Native desktop performance
- Cross-platform compatibility
- Full Ethereum node dashboard functionality
- Enhanced security features

## 📋 System Requirements
- **macOS**: 10.15+ (Intel & Apple Silicon)

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

## 🔒 Security Features
- Visual security indicators
- Animated warnings for private key visibility
- Clear security messaging
- Enhanced copy functionality with feedback

---
Built with ❤️ by AnvilX Team
`;

  fs.writeFileSync(path.join(releaseDir, 'README.md'), releaseReadme);
  
  console.log('\n✅ Perfect disk images created successfully!');
  console.log('📁 Release files are in the "release" directory:');
  console.log(`   ${releaseDir}`);
  
  // List generated files
  console.log('\n📋 Generated perfect disk images:');
  if (fs.existsSync(path.join(releaseDir, 'macos'))) {
    console.log('   🍎 macOS: .app bundle (Universal - with redesigned UI)');
  }
  if (fs.existsSync(path.join(releaseDir, 'macos-dmg'))) {
    console.log('   🍎 macOS: .dmg installer (Universal - with redesigned UI)');
  }
  
  console.log('\n🎨 All applications feature the redesigned Accounts page!');
  console.log('🎉 Perfect disk images ready for deployment!');
  console.log('\n✨ Key improvements:');
  console.log('   • Modern private key display with security indicators');
  console.log('   • Enhanced address section with better visual hierarchy');
  console.log('   • Color-coded sections for better UX');
  console.log('   • Professional typography and spacing');
  console.log('   • Animated security warnings');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
