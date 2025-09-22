# 🪟 Windows Build Instructions

## Prerequisites

### Required Software
1. **Visual Studio Build Tools**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Install "C++ build tools" workload
   - Ensure Windows 10/11 SDK is included

2. **Rust Toolchain**
   - Install via: https://rustup.rs/
   - Add Windows target: `rustup target add x86_64-pc-windows-msvc`

3. **Node.js & npm**
   - Install Node.js 18+ from: https://nodejs.org/

## Build Steps

1. **Clone and setup project:**
   ```bash
   git clone <your-repo>
   cd anvil-dashboard
   npm install
   ```

2. **Generate icons:**
   ```bash
   node scripts/generate-icons.js
   ```

3. **Build for Windows:**
   ```bash
   npm run tauri:build:win
   ```

## Generated Files

After successful build, you'll find:
- **MSI Installer**: `src-tauri/target/release/bundle/msi/AnvilX Dashboard_1.0.0_x64_en-US.msi`
- **Portable EXE**: `src-tauri/target/release/anvilx-dashboard.exe`

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
