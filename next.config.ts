/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://cleennconnect.anikstudio.com/api/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cleennconnect.anikstudio.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "cleennconnect.anikstudio.com",
        port: "4000",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
