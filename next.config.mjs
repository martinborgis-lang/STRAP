/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TEMPORAIRE : sert les fichiers PNG locaux tels quels (sans passer par
    // l'optimiseur next/image, dont le cache pouvait renvoyer d'anciennes
    // variantes optimisées). À repasser à `false` une fois les vraies photos
    // en place pour réactiver l'optimisation.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
    ];
  },
};

export default nextConfig;
