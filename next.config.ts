import type { NextConfig } from 'next';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const IP_SERVER = process.env.SPRINGBOOT_PORT_IP_SERVER || 'localhost';
const PORT = process.env.SPRINGBOOT_PORT || '8080';

const SPRINGBOOT_URL = `http://${IP_SERVER}:${PORT}`;

process.env.NEXT_PUBLIC_SPRINGBOOT_SERVER_IP_ADDRESS = SPRINGBOOT_URL;

console.log('-------------------------------------------');
console.log(`Loaded .env.local configuration:`);
console.log(`Server: ${IP_SERVER}`);
console.log(`Port: ${PORT}`);
console.log(`Public API URL: ${SPRINGBOOT_URL}`);
console.log('-------------------------------------------');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
