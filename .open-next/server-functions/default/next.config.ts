import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp usa addon nativo C — manter como pacote externo para nao ser bundlado
  // No Cloudflare Workers o import dinamico falhara graciosamente (fallback no image-pipeline)
  serverExternalPackages: ["sharp"],
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
