const CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'do1l4ta4k';
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || process.env.VITE_CLOUDINARY_FOLDER || 'wagmi-gallery';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

function normalizePrefix(folder) {
  return folder.endsWith('/') ? folder : `${folder}/`;
}

export const handler = async () => {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET' }),
    };
  }

  const prefix = normalizePrefix(CLOUDINARY_FOLDER);
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload?prefix=${encodeURIComponent(prefix)}&max_results=100`;
  const credentials = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || 'Cloudinary list request failed' }),
      };
    }

    const images = (data.resources || [])
      .map((resource) => ({
        id: resource.asset_id || resource.public_id,
        url: resource.secure_url,
        publicId: resource.public_id,
        filename: resource.original_filename || resource.public_id?.split('/').pop() || 'image',
        timestamp: resource.created_at ? new Date(resource.created_at).getTime() : Date.now(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ images }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected server error' }),
    };
  }
};