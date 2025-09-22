import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const releaseDir = path.join(projectRoot, 'release');

console.log('🪟 AnvilX Dashboard - Windows Build Instructions');
console.log('===============================================');
console.log('');

// Check if we're on Windows
const isWindows = process.platform === 'win32';

if (!isWindows) {
  console.log('❌ Windows build requires a Windows environment');
  console.log('');
  console.log('📋 To build for Windows, you need:');
  console.log('   1. A Windows machine or virtual machine');
  console.log('   2. Visual Studio Build Tools installed');
  console.log('   3. Rust toolchain with Windows target');
  console.log('');
  console.log('🔧 Setup Instructions:');
  console.log('');
  console.log('1. Install Visual Studio Build Tools:');
  console.log('   - Download from: https://visualstudio.microsoft.com/downloads/');
  console.log('   - Install "C++ build tools" workload');
  console.log('');
  console.log('2. Install Rust (if not already installed):');
  console.log('   - Visit: https://rustup.rs/');
  console.log('   - Run the installer');
  console.log('');
  console.log('3. Add Windows target:');
  console.log('   rustup target add x86_64-pc-windows-msvc');
  console.log('');
  console.log('4. Build the application:');
  console.log('   npm run tauri:build:win');
  console.log('');
  console.log('📁 The Windows build will create:');
  console.log('   - MSI installer: src-tauri/target/release/bundle/msi/');
  console.log('   - Portable exe: src-tauri/target/release/');
  console.log('');
  
  // Create Windows build instructions file
  const windowsInstructions = `# 🪟 Windows Build Instructions

## Prerequisites

### Required Software
1. **Visual Studio Build Tools**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Install "C++ build tools" workload
   - Ensure Windows 10/11 SDK is included

2. **Rust Toolchain**
   - Install via: https://rustup.rs/
   - Add Windows target: \`rustup target add x86_64-pc-windows-msvc\`

3. **Node.js & npm**
   - Install Node.js 18+ from: https://nodejs.org/

## Build Steps

1. **Clone and setup project:**
   \`\`\`bash
   git clone <your-repo>
   cd anvil-dashboard
   npm install
   \`\`\`

2. **Generate icons:**
   \`\`\`bash
   node scripts/generate-icons.js
   \`\`\`

3. **Build for Windows:**
   \`\`\`bash
   npm run tauri:build:win
   \`\`\`

## Generated Files

After successful build, you'll find:
- **MSI Installer**: \`src-tauri/target/release/bundle/msi/AnvilX Dashboard_1.0.0_x64_en-US.msi\`
- **Portable EXE**: \`src-tauri/target/release/anvilx-dashboard.exe\`

## Distribution

### MSI Installer
- Professional Windows installer
- Handles dependencies automatically
- Can be distributed via:
  - Direct download
  - Microsoft Store
  - Enterprise deployment tools

### Portable EXE
- Standalone executable
- No installation required
- Can be run from any location

## Features
- Custom AnvilX branding and icons
- Redesigned Accounts page with modern UI
- Responsive private key display
- Native Windows integration
- Professional installer package

---
Built with ❤️ by AnvilX Team
`;

  fs.writeFileSync(path.join(releaseDir, 'WINDOWS_BUILD_INSTRUCTIONS.md'), windowsInstructions);
  
  console.log('📄 Windows build instructions saved to: release/WINDOWS_BUILD_INSTRUCTIONS.md');
  console.log('');
  console.log('💡 Alternative: Use GitHub Actions for automated Windows builds');
  console.log('   - Create .github/workflows/build.yml');
  console.log('   - Automatically build for all platforms');
  console.log('');
  
} else {
  // We're on Windows, try to build
  console.log('✅ Windows environment detected');
  console.log('🔨 Building Windows application...');
  
  try {
    // Generate icons
    console.log('🎨 Generating AnvilX icons...');
    execSync('node scripts/generate-icons.js', { cwd: projectRoot, stdio: 'inherit' });
    
    // Build frontend
    console.log('📦 Building frontend...');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    
    // Build Windows app
    console.log('🪟 Building Windows application...');
    execSync('npm run tauri:build:win', { cwd: projectRoot, stdio: 'inherit' });
    
    // Copy to release directory
    console.log('📁 Organizing Windows build...');
    const tauriBundleDir = path.join(projectRoot, 'src-tauri/target/release/bundle');
    
    if (fs.existsSync(path.join(tauriBundleDir, 'msi'))) {
      fs.cpSync(path.join(tauriBundleDir, 'msi'), path.join(releaseDir, 'windows'), { recursive: true });
      console.log('✅ Windows MSI installer copied');
    }
    
    console.log('🎉 Windows build completed successfully!');
    console.log('📁 Windows files are in: release/windows/');
    
  } catch (error) {
    console.error('❌ Windows build failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Ensure Visual Studio Build Tools are installed');
    console.log('2. Check that Windows 10/11 SDK is included');
    console.log('3. Verify Rust Windows target is installed');
    console.log('4. Try running: rustup target add x86_64-pc-windows-msvc');
  }
}
