export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
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
    // Simple API response for testing
    if (req.url === '/') {
      return res.status(200).json({
        message: 'Jurni API Server',
        version: '1.0.0',
        status: 'running'
      });
    }

    // Health check endpoint
    if (req.url === '/health') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    }

    // For now, return a simple response for other routes
    res.status(404).json({ message: 'Endpoint not found' });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}