import static from 'node-static';
import http from 'http';

// Création d'un serveur de fichiers statiques avec des types MIME personnalisés
const fileServer = new static.Server('./dist', {
  cache: 3600,
  gzip: true,
  headers: {
    'X-Content-Type-Options': 'nosniff',
  },
  mime: {
    'tsx': 'application/typescript',
    'ts': 'application/typescript',
  },
});

const requestHandler = (request, response) => {
  request.addListener('end', () => {
    fileServer.serve(request, response, (err, response) => {
      if (err) {
        console.error("Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      }
    });
  }).resume();
};

const httpServer = http.createServer(requestHandler);

httpServer.listen(3000, () => {
  console.log('HTTP Server running at http://localhost:3000');
});