/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "https://backend.cleennconnect.com/api/",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.cleennconnect.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend.cleennconnect.com",
        port: "4000",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
