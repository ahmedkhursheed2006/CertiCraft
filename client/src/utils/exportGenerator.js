import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { calculateFittedFontSize } from './fontManager';

/**
 * Loads an HTML Image element from a source URL
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Replaces dynamic placeholders in a string with data from a recipient record
 */
export function interpolateText(templateText, record) {
  if (!templateText || !record) return templateText;
  return templateText.replace(/\{\{\s*([a-zA-Z0-9_\-\s]+)\s*\}\}/g, (match, tag) => {
    const trimmedTag = tag.trim();
    if (record[trimmedTag] !== undefined) {
      return record[trimmedTag];
    }
    // Also try case-insensitive and normalized matching
    const foundKey = Object.keys(record).find(
      k => k.trim().toLowerCase() === trimmedTag.toLowerCase()
    );
    if (foundKey && record[foundKey] !== undefined) {
      return record[foundKey];
    }
    return match;
  });
}

/**
 * Renders a certificate onto an offscreen canvas at full original dimensions
 */
export async function renderCertificateCanvas(bgImage, elements, record, canvasWidth, canvasHeight) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // 1. Draw Background Image
  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // 2. Draw all text elements
  for (const el of elements) {
    const resolvedText = record ? interpolateText(el.tag || el.text, record) : (el.text || el.tag);
    if (!resolvedText) continue;

    const fontSize = el.autoFit
      ? calculateFittedFontSize(resolvedText, el.width, el.fontSize, el.fontFamily, el.fontWeight)
      : el.fontSize;

    const fontStyle = el.fontStyle === 'italic' ? 'italic' : 'normal';
    const fontWeight = el.fontWeight || 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${el.fontFamily || 'sans-serif'}", sans-serif`;
    ctx.fillStyle = el.fill || '#000000';
    ctx.textBaseline = 'middle';

    let renderX = el.x;
    const renderY = el.y + el.height / 2;

    if (el.align === 'center') {
      ctx.textAlign = 'center';
      renderX = el.x + el.width / 2;
    } else if (el.align === 'right') {
      ctx.textAlign = 'right';
      renderX = el.x + el.width;
    } else {
      ctx.textAlign = 'left';
      renderX = el.x;
    }

    ctx.fillText(resolvedText, renderX, renderY);
  }

  return canvas;
}

/**
 * Converts a Canvas to a high quality PDF Document bytes
 */
export async function canvasToPdfBytes(canvas) {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([canvas.width, canvas.height]);
  const pngImage = await pdfDoc.embedPng(dataUrl);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  });

  return await pdfDoc.save();
}

/**
 * Triggers a browser download for a Blob
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Formats individual certificate filename based on record
 */
export function formatFilename(pattern, record, index, extension) {
  let name = pattern || '{{Full_Name}}_Certificate';
  name = interpolateText(name, record);
  // Sanitize filename for operating systems
  name = name.replace(/[^a-zA-Z0-9_\-\.\s]/g, '').trim();
  if (!name) name = `Certificate_${index + 1}`;
  return `${name}.${extension}`;
}

/**
 * Bulk exports certificates into a single ZIP file
 */
export async function exportBatchToZip({
  bgUrl,
  elements,
  records,
  canvasWidth,
  canvasHeight,
  format = 'pdf', // 'pdf' or 'png'
  namePattern = '{{Full_Name}}_Certificate',
  zipName = 'Certificates_Batch.zip',
  onProgress
}) {
  const bgImg = bgUrl ? await loadImage(bgUrl) : null;
  const zip = new JSZip();
  const total = records.length;

  for (let i = 0; i < total; i++) {
    const record = records[i];
    const canvas = await renderCertificateCanvas(bgImg, elements, record, canvasWidth, canvasHeight);
    const filename = formatFilename(namePattern, record, i, format);

    if (format === 'pdf') {
      const pdfBytes = await canvasToPdfBytes(canvas);
      zip.file(filename, pdfBytes);
    } else {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const base64Data = dataUrl.split(',')[1];
      zip.file(filename, base64Data, { base64: true });
    }

    if (onProgress) {
      onProgress(i + 1, total, filename);
    }

    // Small yield to keep UI responsive
    await new Promise(r => setTimeout(r, 10));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, zipName);

  // Trigger celebration confetti
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });

  return zipBlob;
}
