import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    if (req.method === 'GET') {
      // Load mappings
      const mappings = await redis.get('icon-mappings');
      return res.status(200).json(mappings || {});
    }

    if (req.method === 'POST') {
      // Save mappings
      const mappings = req.body;
      await redis.set('icon-mappings', mappings);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Redis Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
