import type { NextConfig } from 'next';

const IP_SERVER = process.env.IP_SERVER || '192.168.0.177';
const PORT = process.env.PORT || '8080';

process.env.NEXT_PUBLIC_SPRINGBOOT_SERVER_IP_ADDRESS = `http://${IP_SERVER}:${PORT}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
