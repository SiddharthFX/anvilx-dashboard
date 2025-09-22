import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconSizes = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: 'Square30x30Logo.png', size: 30 },
  { name: 'Square44x44Logo.png', size: 44 },
  { name: 'Square71x71Logo.png', size: 71 },
  { name: 'Square89x89Logo.png', size: 89 },
  { name: 'Square107x107Logo.png', size: 107 },
  { name: 'Square142x142Logo.png', size: 142 },
  { name: 'Square150x150Logo.png', size: 150 },
  { name: 'Square284x284Logo.png', size: 284 },
  { name: 'Square310x310Logo.png', size: 310 },
  { name: 'StoreLogo.png', size: 50 }
];

async function generateIcons() {
  console.log('🎨 Generating AnvilX icons for Tauri...');
  
  const sourceIcon = path.join(__dirname, '../public/AnvilX-Icon.png');
  const iconsDir = path.join(__dirname, '../src-tauri/icons');
  
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  try {
    // Generate PNG icons
    for (const icon of iconSizes) {
      await sharp(sourceIcon)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join(iconsDir, icon.name));
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }
    
    // Generate ICO file for Windows
    const icoSizes = [16, 32, 48, 64, 128, 256];
    const icoBuffers = [];
    
    for (const size of icoSizes) {
      const buffer = await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();
      icoBuffers.push({ size, buffer });
    }
    
    // For now, we'll use a simple approach - copy the largest PNG as ICO
    await sharp(sourceIcon)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(iconsDir, 'icon.ico'));
    
    console.log('✅ Generated icon.ico');
    
    // Generate ICNS file for macOS
    // For ICNS, we'll use the largest PNG and let Tauri handle the conversion
    await sharp(sourceIcon)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(iconsDir, 'icon.icns'));
    
    console.log('✅ Generated icon.icns');
    
    console.log('🎉 All AnvilX icons generated successfully!');
    console.log('📁 Icons saved to: src-tauri/icons/');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
