// Built-in Google Fonts and standard web fonts
export const BUILT_IN_FONTS = [
  { name: 'Great Vibes (Calligraphy)', family: 'Great Vibes', category: 'Handwriting' },
  { name: 'Alex Brush (Calligraphy)', family: 'Alex Brush', category: 'Handwriting' },
  { name: 'Dancing Script (Cursive)', family: 'Dancing Script', category: 'Handwriting' },
  { name: 'Cinzel (Royal Serif)', family: 'Cinzel', category: 'Serif' },
  { name: 'Playfair Display (Elegant Serif)', family: 'Playfair Display', category: 'Serif' },
  { name: 'Montserrat (Modern Sans)', family: 'Montserrat', category: 'Sans-Serif' },
  { name: 'Inter (Clean Sans)', family: 'Inter', category: 'Sans-Serif' },
  { name: 'Georgia (Classic Serif)', family: 'Georgia', category: 'Serif' },
  { name: 'Courier New (Monospace)', family: 'Courier New', category: 'Monospace' }
];

/**
 * Loads a user-uploaded font file (.ttf, .otf, .woff, .woff2) into document.fonts
 * @param {File} file - Font file from input
 * @returns {Promise<{name: string, family: string, custom: boolean}>}
 */
export async function loadCustomFontFile(file) {
  const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\- ]/g, '');
  const arrayBuffer = await file.arrayBuffer();
  
  const fontFace = new FontFace(fontName, arrayBuffer);
  await fontFace.load();
  document.fonts.add(fontFace);
  
  return {
    name: `${fontName} (Custom)`,
    family: fontName,
    category: 'Custom',
    custom: true
  };
}

/**
 * Calculates auto-scaled font size so that the string fits within the bounding box
 * @param {string} text - The text string
 * @param {number} maxWidth - Target width
 * @param {number} baseFontSize - Desired base font size
 * @param {string} fontFamily - Font family name
 * @param {string} fontWeight - Font weight
 * @returns {number} Fitted font size
 */
export function calculateFittedFontSize(text, maxWidth, baseFontSize, fontFamily, fontWeight = 'normal') {
  if (!text || maxWidth <= 0) return baseFontSize;
  
  // Create an offscreen canvas context for measurement
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return baseFontSize;
  
  ctx.font = `${fontWeight} ${baseFontSize}px "${fontFamily}", sans-serif`;
  const measuredWidth = ctx.measureText(text).width;
  
  if (measuredWidth <= maxWidth) {
    return baseFontSize;
  }
  
  // Scale down proportionally, keeping a minimum legible threshold
  const scaleRatio = maxWidth / measuredWidth;
  const scaledSize = Math.max(12, Math.floor(baseFontSize * scaleRatio * 0.95));
  return scaledSize;
}
