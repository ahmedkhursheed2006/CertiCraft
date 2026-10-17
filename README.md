# CertiCraft - Dynamic Certificate Studio (MERN)

A high-performance dynamic certificate generator tool built with **React**, **Konva (HTML5 Canvas)**, **Tailwind CSS**, **Node.js/Express**, and **pdf-lib/JSZip**.

---

## ✨ Features Implemented

1. **Universal Certificate Template Upload**:
   - Upload any custom background image (PNG, JPG, SVG, WebP) of any dimensions (e.g., A4 300 DPI, 1920x1080).
   - Includes 3 procedural built-in certificate designs (*Classic Royal Gold*, *Modern Tech Blue*, *Clean Minimalist Light*) to test immediately without searching for an image.

2. **Visual Drag & Drop Canvas (Konva)**:
   - Add dynamic text boxes for `{{Full_Name}}`, `{{Course_Name}}`, `{{Date}}`, `{{Certificate_ID}}`, or custom tags.
   - 6-point resize handles, dragging, and alignment guides.
   - Precise positioning: live $X, Y, W, H$ coordinates inputs.
   - Text alignment: Left, Center, Right, with auto vertical centering.

3. **Custom Font Uploads & Typography**:
   - Upload your own `.ttf`, `.otf`, `.woff`, `.woff2` font files using the browser's dynamic `FontFace` API.
   - Built-in Google Fonts: *Great Vibes*, *Cinzel*, *Montserrat*, *Playfair Display*, *Alex Brush*, *Dancing Script*, *Inter*.
   - Color picker + quick palette swatches.

4. **Auto-Shrink / Font Scaling**:
   - Long recipient names automatically scale down their font size so they never overflow their bounding box.

5. **Spreadsheet Ingestion (.xlsx / .csv)**:
   - Drag & drop Excel or CSV files.
   - Auto-detects columns and matches them to your template placeholders.
   - One-click shortcuts: **Load Sample 5 Recipients** or **Generate 50 Test Participants** to test large bulk batches instantly.
   - Downloadable sample CSV template.

6. **Live Data Preview Slider**:
   - Browse recipient 1 of 50, 2 of 50, etc., directly on the canvas in real time before generating.

7. **Bulk Generation & ZIP Export**:
   - Fast client-side rendering (zero server overhead): renders up to hundreds of certificates in seconds.
   - Formats: High-Resolution Vector **PDF** (via `pdf-lib`) or Lossless **PNG**.
   - Custom filename pattern (e.g., `{{Full_Name}}_Certificate.pdf`).
   - Bundles all certificates into a single `.zip` archive via `JSZip`.
   - Celebration confetti animation upon completion.
   - Direct Google Drive sync button connected to Express backend.

---

## 🚀 Running the Project

### Frontend
```bash
cd client
npm run dev
```
Accessible at: **http://127.0.0.1:5173**

### Backend API
```bash
cd server
npm run dev
```
Accessible at: **http://localhost:5000**
