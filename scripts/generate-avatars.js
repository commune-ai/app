
/**
 * This script generates placeholder avatar images for the friends feature
 * Run with: node scripts/generate-avatars.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const outputDir = path.join(__dirname, '../public/images/avatars');
const colors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Generate avatars
function generateAvatar(index, size = 200) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = colors[index % colors.length];
  ctx.fillRect(0, 0, size, size);
  
  // Generate a pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  
  // Different pattern based on index
  switch (index % 5) {
    case 0: // Circles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 10 + Math.random() * 30;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 1: // Squares
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const side = 20 + Math.random() * 40;
        ctx.fillRect(x, y, side, side);
      }
      break;
    case 2: // Triangles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const side = 30 + Math.random() * 50;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + side, y);
        ctx.lineTo(x + side/2, y - side);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case 3: // Lines
      for (let i = 0; i < 8; i++) {
        const x1 = Math.random() * size;
        const y1 = Math.random() * size;
        const x2 = Math.random() * size;
        const y2 = Math.random() * size;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
    case 4: // Dots
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = 2 + Math.random() * 5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
  
  return canvas.toBuffer('image/png');
}

// Generate 10 avatars
for (let i = 1; i <= 10; i++) {
  const avatarBuffer = generateAvatar(i);
  const outputPath = path.join(outputDir, `avatar-${i}.png`);
  
  fs.writeFileSync(outputPath, avatarBuffer);
  console.log(`Generated avatar: ${outputPath}`);
}

console.log('Avatar generation complete!');
