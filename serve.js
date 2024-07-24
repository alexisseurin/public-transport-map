import static from 'node-static';
import http from 'http';

const file = new static.Server('./dist');

http
  .createServer(function (request, response) {
    request
      .addListener('end', function () {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(3000);