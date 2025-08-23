/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Ensure lucide-react is optimized into a stable vendor chunk
    optimizePackageImports: ["lucide-react"],
  },
}

export default nextConfig
