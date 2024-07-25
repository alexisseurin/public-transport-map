import express from 'express';
import path from 'path';
import mime from 'mime-types'; // Helper pour les types MIME

const app = express();

// Middleware pour ajouter les en-têtes de sécurité et de performance
app.use((req, res, next) => {
  // Sécurité: X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Performance: Cache-Control
  if (req.url.startsWith('/assets/')) { // Ajustez le chemin selon vos besoins
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Ne pas utiliser des en-têtes non nécessaires
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

// Serve your static files from 'dist' directory
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')));

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
