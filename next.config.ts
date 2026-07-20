import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(process.cwd()),
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
