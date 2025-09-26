import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack picks the correct workspace when multiple lockfiles exist
  turbopack: {
    // Point root at the project directory to avoid C:\Users\nirma lockfile selection
    root: __dirname,
  },
  // Handle HTTP header size issues
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Accept-Charset",
            value: "utf-8"
          },
          {
            key: "Accept-Encoding",
            value: "gzip, deflate, br"
          }
        ]
      }
    ];
  }
};

export default nextConfig;