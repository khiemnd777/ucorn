import { serve } from 'bun';
import { handleHole } from './handlers/hole-handler';
import { InputValidationError } from './domain/completion';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
};

export const routeRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  if (url.pathname !== '/' && url.pathname !== '/hole') {
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }

  const allowedMethods = url.pathname === '/'
    ? 'GET, HEAD, POST, OPTIONS'
    : 'POST, OPTIONS';

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (url.pathname === '/' && (req.method === 'GET' || req.method === 'HEAD')) {
    return new Response(req.method === 'HEAD' ? null :
      'UCORN well schematic API\nSend a POST request with a JSON well payload to /hole to generate SVG.\n', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { ...corsHeaders, Allow: allowedMethods },
    });
  }

  let wellData: unknown;
  try {
    wellData = await req.json();
  } catch {
    return Response.json({ error: 'Request body must contain valid JSON.' }, {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const svgString = handleHole(wellData);
    return new Response(svgString, {
      headers: { ...corsHeaders, 'Content-Type': 'image/svg+xml' },
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      return Response.json({ error: error.message, diagnostics: error.diagnostics }, { status: 400, headers: corsHeaders });
    }
    console.error('Failed to render well schematic:', error);
    return Response.json({ error: 'Unable to render well schematic.' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
};

if (import.meta.main) {
  serve({
    port: 3000,
    fetch: routeRequest,
  });

  console.log('Server running on http://localhost:3000');
}
