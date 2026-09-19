module.exports = {
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
