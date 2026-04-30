const crypto = require('crypto');

const CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'do1l4ta4k';
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || process.env.VITE_CLOUDINARY_FOLDER || 'wagmi-gallery';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

function folderPrefix(folder) {
  return folder.endsWith('/') ? folder : `${folder}/`;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const publicId = typeof body.publicId === 'string' ? body.publicId.trim() : '';

    if (!publicId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'publicId is required' }),
      };
    }

    if (!publicId.startsWith(folderPrefix(CLOUDINARY_FOLDER))) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Deletion outside configured folder is not allowed' }),
      };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    const params = new URLSearchParams();
    params.set('public_id', publicId);
    params.set('timestamp', String(timestamp));
    params.set('api_key', CLOUDINARY_API_KEY);
    params.set('signature', signature);
    params.set('invalidate', 'true');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || 'Cloudinary delete request failed' }),
      };
    }

    if (data.result !== 'ok' && data.result !== 'not found') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unexpected delete result: ${data.result}` }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ success: true, result: data.result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected server error' }),
    };
  }
};