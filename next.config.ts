import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    // Add a rule for GLSL files
    config.module.rules.push({
      test: /\.glsl$/,
      use: "glslify-loader",
    });

    return config;
  },
};

export default nextConfig;
