import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory or database mock store for templates
let savedTemplates = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CertiCraft API',
    timestamp: new Date().toISOString()
  });
});

// Templates CRUD endpoints
app.get('/api/templates', (req, res) => {
  res.json({ success: true, templates: savedTemplates });
});

app.post('/api/templates', (req, res) => {
  const { name, dimensions, elements, backgroundUrl, customFonts } = req.body;
  const newTemplate = {
    id: 'tpl_' + Date.now(),
    name: name || 'Untitled Template',
    dimensions: dimensions || { width: 1920, height: 1080 },
    elements: elements || [],
    backgroundUrl: backgroundUrl || null,
    customFonts: customFonts || [],
    createdAt: new Date().toISOString()
  };
  savedTemplates.push(newTemplate);
  res.status(201).json({ success: true, template: newTemplate });
});

app.delete('/api/templates/:id', (req, res) => {
  const { id } = req.params;
  savedTemplates = savedTemplates.filter(t => t.id !== id);
  res.json({ success: true, message: 'Template deleted' });
});

// Google Drive Integration Placeholder route
app.post('/api/drive/export', async (req, res) => {
  try {
    const { folderName, certificates } = req.body;
    // When Google OAuth credentials are provided, googleapis will upload files directly
    res.json({
      success: true,
      message: `Export triggered for ${certificates?.length || 0} certificates to folder "${folderName || 'CertiCraft_Certificates'}".`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`CertiCraft Server running on port ${PORT}`);
});
