/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ⬅️ Crucial pour générer un site statique
  images: {
    unoptimized: true, // ⬅️ Évite les erreurs liées à l’optimisation d’image côté serveur
  },
  reactStrictMode: true,
  trailingSlash: true, // ⬅️ Ajoute un slash à la fin des URLs (utile pour Hostinger)
  turbopack: {
    root: __dirname, // ⬅️ Optionnel, utile en dev local
  },
}

module.exports = nextConfig
