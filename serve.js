import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

const app = express();

// Obtenez le répertoire du fichier courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware pour ajouter les en-têtes de sécurité et de performance
app.use((req, res, next) => {
  // Sécurité: X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Performance: Cache-Control pour les fichiers statiques
  if (req.url && req.url.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Suppression des en-têtes non nécessaires
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('Expires');
  res.removeHeader('X-Frame-Options');

  // Optionnel: Content-Security-Policy pour sécurité accrue
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");

  next();
});

// Middleware pour définir le Content-Type correct
app.use((req, res, next) => {
  const ext = path.extname(req.url || '');
  const contentType = mime.contentType(ext) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  next();
});

// Serve les fichiers statiques depuis le répertoire 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
