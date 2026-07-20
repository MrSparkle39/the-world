import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project. Without this, Next infers the
  // workspace root as the home directory (which is itself a git repo), and the
  // Netlify runtime then treats the app as a monorepo package and generates a
  // server handler with broken Windows paths (\var\task\the-world -> 502s).
  outputFileTracingRoot: __dirname,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // The default ".next" dir keeps getting corrupted mid-build on this machine
  // (files vanish during "Collecting page data"); a different dist dir avoids it.
  distDir: ".next-dev",
};

export default nextConfig;
