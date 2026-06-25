import server from '../dist/server/server.js';

export default function handler(request) {
  const url = new URL(request.url);
  
  // Vercel rewrite parameter
  const originalPath = url.searchParams.get('__path') ?? '';
  url.pathname = `/${originalPath}`;
  url.searchParams.delete('__path');

  // Restore original host and protocol if behind proxy
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  
  if (forwardedHost) {
    url.host = forwardedHost;
  }
  if (forwardedProto) {
    url.protocol = `${forwardedProto}:`;
  }

  // Recreate the request with the correct URL
  const newRequest = new Request(url.href, request);

  return server.fetch(newRequest, process.env, {});
}
