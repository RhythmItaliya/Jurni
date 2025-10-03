import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url, method } = req;
    
    console.log(`Request: ${method} ${url}`);

    // Simple API response for testing
    if (url === '/' || url === '') {
      return res.status(200).json({
        message: 'Jurni API Server',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        method,
        url
      });
    }

    // Health check endpoint
    if (url === '/health' || url === '/api/health') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        method,
        url
      });
    }

    // API info endpoint
    if (url === '/api' || url === '/api/') {
      return res.status(200).json({
        message: 'Jurni API',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          root: '/'
        },
        timestamp: new Date().toISOString()
      });
    }

    // For now, return info about the request for debugging
    res.status(200).json({ 
      message: 'Endpoint received', 
      method,
      url,
      timestamp: new Date().toISOString(),
      note: 'This is a test response - NestJS integration coming soon'
    });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
}