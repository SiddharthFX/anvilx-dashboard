# AnvilX Dashboard - Tauri Desktop Application

This document explains how to build and run the AnvilX Dashboard as a native desktop application using Tauri.

## Prerequisites

### For macOS Development:
- Xcode Command Line Tools: `xcode-select --install`
- Rust: Install via [rustup.rs](https://rustup.rs/)

### For Windows Development:
- Microsoft Visual Studio C++ Build Tools
- Rust: Install via [rustup.rs](https://rustup.rs/)

### For Cross-Platform Development:
- Node.js 18+ and npm
- Rust toolchain

## Installation

1. **Install Rust (if not already installed):**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install Tauri CLI:**
   ```bash
   npm install -g @tauri-apps/cli
   ```

3. **Install project dependencies:**
   ```bash
   npm install
   ```

## Development

### Start Development Server
```bash
npm run tauri:dev
```

This will:
- Start the Vite development server
- Launch the Tauri application
- Enable hot reload for both frontend and backend

### Build for Production

#### Build for Current Platform
```bash
npm run tauri:build
```

#### Build for macOS (Universal Binary)
```bash
npm run tauri:build:mac
```

#### Build for Windows
```bash
npm run tauri:build:win
```

## Project Structure

```
anvil-dashboard/
├── src/                    # React frontend source
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs        # Application entry point
│   │   └── lib.rs         # Main application logic
│   ├── tauri.conf.json    # Tauri configuration
│   ├── Cargo.toml         # Rust dependencies
│   └── icons/             # Application icons
├── dist/                  # Built frontend (generated)
└── src-tauri/target/      # Built Rust backend (generated)
```

## Configuration

### Window Settings
The application window is configured in `src-tauri/tauri.conf.json`:
- Default size: 1400x900
- Minimum size: 1000x700
- Resizable: Yes
- Centered: Yes

### Build Settings
- Frontend build output: `../dist`
- Development server: `http://localhost:8080`
- Build commands: `npm run build`

## Distribution

### macOS
- Creates a `.app` bundle
- Supports both Intel and Apple Silicon (Universal Binary)
- Can be distributed via App Store or direct download

### Windows
- Creates an `.exe` installer
- Supports Windows 10/11
- Can be distributed via direct download

## Troubleshooting

### Common Issues

1. **Rust not found:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

2. **Xcode tools missing (macOS):**
   ```bash
   xcode-select --install
   ```

3. **Build fails on Windows:**
   - Install Visual Studio Build Tools
   - Ensure Rust target is installed: `rustup target add x86_64-pc-windows-msvc`

4. **Permission denied on macOS:**
   - Go to System Preferences > Security & Privacy
   - Allow the application to run

### Development Tips

1. **Enable logging in development:**
   - Logs are automatically enabled in debug mode
   - Check console output for detailed information

2. **Hot reload:**
   - Frontend changes are automatically reflected
   - Backend changes require restart

3. **Debugging:**
   - Use browser dev tools for frontend debugging
   - Use `println!` or `log` crate for backend debugging

## Performance Benefits

Compared to Electron, Tauri provides:
- **Smaller bundle size** (typically 10-20MB vs 100MB+)
- **Lower memory usage** (50-80% reduction)
- **Faster startup time**
- **Better security** with Rust backend
- **Native performance** for system operations

## Security

Tauri provides enhanced security through:
- Rust backend (memory safety)
- Sandboxed webview
- Configurable Content Security Policy (CSP)
- No Node.js runtime in production

## Next Steps

1. **Add native features:**
   - System tray integration
   - Native menus
   - File system access
   - Network operations

2. **Customize appearance:**
   - Update window styling
   - Add custom titlebar
   - Implement dark/light mode

3. **Distribution:**
   - Code signing for macOS
   - Windows code signing
   - App Store submission (macOS)
   - Microsoft Store submission (Windows)
