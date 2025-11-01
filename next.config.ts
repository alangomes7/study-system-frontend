/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['http://192.168.0.177:3000', '*'],
  },
};

export default nextConfig;
