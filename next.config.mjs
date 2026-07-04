/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static export → Cloudflare Pages, no server
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
