# 🚀 AnvilX Dashboard - Deployment Guide

This guide covers deploying your AnvilX Dashboard application for all platforms (Windows, macOS, and Linux).

## 📋 Prerequisites

### For All Platforms:
- Node.js 18+ and npm
- Rust toolchain (installed via rustup)
- Tauri CLI: `npm install -g @tauri-apps/cli`

### Platform-Specific Requirements:

#### macOS:
- Xcode Command Line Tools: `xcode-select --install`
- Universal binary support (Intel + Apple Silicon)

#### Windows:
- Microsoft Visual Studio C++ Build Tools
- Windows 10/11 target

#### Linux:
- Standard build tools (gcc, make, etc.)
- AppImage and DEB package support

## 🎯 Quick Deployment

### Option 1: Automated Build (Recommended)
```bash
# Build for all platforms at once
node scripts/build-deploy.js
```

### Option 2: Manual Platform-Specific Builds
```bash
# Build for current platform
npm run tauri:build

# Build for specific platforms
npm run tauri:build:mac    # macOS (Universal)
npm run tauri:build:win    # Windows
npm run tauri:build:linux  # Linux

# Build for all platforms
npm run tauri:build:all
```

## 📦 Generated Files

After building, you'll find the following files in the `release/` directory:

### macOS
- **App Bundle**: `release/macos/AnvilX Dashboard.app`
- **DMG Installer**: `release/macos-dmg/AnvilX Dashboard_1.0.0_aarch64.dmg`

### Windows
- **MSI Installer**: `release/windows/AnvilX Dashboard_1.0.0_x64_en-US.msi`

### Linux
- **AppImage**: `release/linux/AnvilX Dashboard_1.0.0_amd64.AppImage`
- **DEB Package**: `release/linux-deb/anvilx-dashboard_1.0.0_amd64.deb`

## 🎨 Customization

### Application Metadata
Edit `src-tauri/tauri.conf.json` to customize:
- Application name and version
- Bundle identifier
- Publisher information
- Copyright notice

### Icons
All platform-specific icons are automatically generated from:
- Source: `public/AnvilX-Icon.png`
- Generated: `src-tauri/icons/`

To regenerate icons:
```bash
node scripts/generate-icons.js
```

## 🔧 Advanced Configuration

### Code Signing (Recommended for Distribution)

#### macOS Code Signing:
1. Get an Apple Developer account
2. Create certificates in Keychain Access
3. Add to `src-tauri/tauri.conf.json`:
```json
{
  "bundle": {
    "macOS": {
      "codeSigningIdentity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "entitlements": "entitlements.plist"
    }
  }
}
```

#### Windows Code Signing:
1. Get a code signing certificate
2. Add to `src-tauri/tauri.conf.json`:
```json
{
  "bundle": {
    "windows": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "password"
    }
  }
}
```

### Auto-Updates
Configure auto-updates in `src-tauri/tauri.conf.json`:
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://your-update-server.com/updates.json"
      ],
      "dialog": true,
      "pubkey": "your-public-key"
    }
  }
}
```

## 📱 Distribution Channels

### macOS
1. **Direct Distribution**: Share the `.dmg` file
2. **App Store**: Submit through App Store Connect
3. **Homebrew**: Create a cask for easy installation

### Windows
1. **Direct Distribution**: Share the `.msi` installer
2. **Microsoft Store**: Submit through Microsoft Partner Center
3. **Chocolatey**: Create a package for package manager installation

### Linux
1. **Direct Distribution**: Share the `.AppImage` or `.deb` file
2. **Snap Store**: Create a snap package
3. **Flathub**: Create a flatpak package
4. **Distribution Repositories**: Submit to Ubuntu PPA, etc.

## 🔒 Security Considerations

### macOS
- Enable hardened runtime
- Use proper entitlements
- Code sign with Developer ID

### Windows
- Code sign with trusted certificate
- Use Windows Defender SmartScreen
- Implement proper UAC handling

### Linux
- Use AppImage signing
- Implement proper sandboxing
- Follow Linux security best practices

## 📊 Performance Optimization

### Bundle Size Optimization:
- Enable compression in Tauri config
- Use tree-shaking for unused code
- Optimize assets and images

### Runtime Performance:
- Enable Rust optimizations
- Use efficient data structures
- Implement proper memory management

## 🧪 Testing

### Pre-Release Testing:
```bash
# Test development build
npm run tauri:dev

# Test production build locally
npm run tauri:build
open "src-tauri/target/release/bundle/macos/AnvilX Dashboard.app"
```

### Platform Testing:
- Test on target platforms
- Verify all features work correctly
- Check for platform-specific issues

## 📈 Release Management

### Version Management:
1. Update version in `package.json`
2. Update version in `src-tauri/Cargo.toml`
3. Update version in `src-tauri/tauri.conf.json`
4. Create git tag for the release

### Release Notes:
Create `CHANGELOG.md` with:
- New features
- Bug fixes
- Breaking changes
- Platform-specific notes

## 🚀 Deployment Checklist

- [ ] All platforms build successfully
- [ ] Icons display correctly on all platforms
- [ ] Application launches without errors
- [ ] All features work as expected
- [ ] Code signing applied (if distributing)
- [ ] Auto-updates configured (if needed)
- [ ] Release notes prepared
- [ ] Version numbers updated
- [ ] Git tags created
- [ ] Distribution files uploaded

## 🆘 Troubleshooting

### Common Issues:

1. **Build fails on macOS**:
   ```bash
   xcode-select --install
   ```

2. **Build fails on Windows**:
   - Install Visual Studio Build Tools
   - Ensure Rust target is installed

3. **Icons not showing**:
   ```bash
   node scripts/generate-icons.js
   npm run tauri:build
   ```

4. **Code signing issues**:
   - Verify certificates are valid
   - Check entitlements configuration
   - Ensure proper permissions

## 📞 Support

For deployment issues:
1. Check Tauri documentation
2. Review platform-specific requirements
3. Test on clean virtual machines
4. Verify all dependencies are installed

---

**Happy deploying! 🚀**
