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
};

export default nextConfig;
