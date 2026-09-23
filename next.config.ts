import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Complex runtimes are bundled by Next by default; keep them as
  // real node_modules imports so Mastra & pg are never bundled/twisted.
  serverExternalPackages: ["@mastra/core", "pg"],
};

export default nextConfig;