#!/bin/bash

# AnvilX Dashboard - Tauri Setup Script
# This script helps with Tauri development and building

set -e

echo "🚀 AnvilX Dashboard - Tauri Setup"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists rustc; then
    echo "❌ Rust is not installed. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
fi

if ! command_exists tauri; then
    echo "📦 Installing Tauri CLI..."
    npm install -g @tauri-apps/cli
fi

# Check platform-specific requirements
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected"
    if ! xcode-select -p >/dev/null 2>&1; then
        echo "📦 Installing Xcode Command Line Tools..."
        xcode-select --install
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Windows detected"
    echo "⚠️  Please ensure Visual Studio Build Tools are installed"
fi

echo "✅ Prerequisites check completed!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup completed successfully!"
echo ""
echo "Available commands:"
echo "  npm run tauri:dev     - Start development server"
echo "  npm run tauri:build   - Build for current platform"
echo "  npm run tauri:build:mac  - Build for macOS"
echo "  npm run tauri:build:win  - Build for Windows"
echo ""
echo "Happy coding! 🚀"
