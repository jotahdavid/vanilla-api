const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);
  parsedUrl.pathname = parsedUrl.pathname.replace(/\/$/, '');

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  console.log(`[${request.method}]: ${parsedUrl.pathname}`);

  const route = routes.find((routeHandler) => {
    return routeHandler.endpoint === pathname && routeHandler.method === request.method;
  });

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body = {}) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      return bodyParser(request, () => route.handler(request, response));
    }

    return route.handler(request, response);
  }

  response.writeHead(404, { 'Content-Type': 'text/html' });
  return response.end(`<h1>Cannot ${request.method} ${request.url}</h1>`);
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
