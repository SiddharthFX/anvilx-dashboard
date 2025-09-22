@echo off
REM AnvilX Dashboard - Tauri Setup Script for Windows
REM This script helps with Tauri development and building on Windows

echo 🚀 AnvilX Dashboard - Tauri Setup
echo ==================================

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if Rust is installed
where rustc >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust is not installed. Installing Rust...
    echo Please visit https://rustup.rs/ to install Rust
    echo After installation, restart this script.
    pause
    exit /b 1
)

REM Check if Tauri CLI is installed
where tauri >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Tauri CLI...
    npm install -g @tauri-apps/cli
)

echo ✅ Prerequisites check completed!

REM Install dependencies
echo 📦 Installing dependencies...
npm install

echo 🎉 Setup completed successfully!
echo.
echo Available commands:
echo   npm run tauri:dev     - Start development server
echo   npm run tauri:build   - Build for current platform
echo   npm run tauri:build:mac  - Build for macOS
echo   npm run tauri:build:win  - Build for Windows
echo.
echo Happy coding! 🚀
pause
