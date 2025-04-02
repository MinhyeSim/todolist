import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["assignment-todolist-api.vercel.app"],
  }
};

export default nextConfig;
