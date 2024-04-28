import { serve } from 'bun';
import { WellData } from 'well-data';
import { handleHole } from './handlers/hole-handler';

const routeRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  switch (url.pathname) {
    case '/':
    case '/hole':
      const wellData = (await req.json()) as WellData;
      const svgString = await handleHole(wellData);

      // Send the SVG as response
      return new Response(svgString, {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    default:
      return new Response('Not Found', { status: 404 });
  }
};

serve({
  port: 3000,
  fetch(request: Request) {
    return routeRequest(request);
  },
});

console.log('Server running on http://localhost:3000');
