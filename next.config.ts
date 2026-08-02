import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @huggingface/transformers uses onnxruntime-node which must run server-side
  // and loads .onnx model files from disk. Keep both external to bundlers.
  serverExternalPackages: ["onnxruntime-node", "@huggingface/transformers"],
  turbopack: {},
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
      {
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

export default nextConfig;
