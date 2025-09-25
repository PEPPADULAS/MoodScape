import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack picks the correct workspace when multiple lockfiles exist
  turbopack: {
    // Point root at the project directory to avoid C:\Users\nirma lockfile selection
    root: __dirname,
  },
};

export default nextConfig;
