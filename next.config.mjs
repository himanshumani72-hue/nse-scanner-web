/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
