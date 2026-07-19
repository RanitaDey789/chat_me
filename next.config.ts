import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @huggingface/transformers uses onnxruntime-node which must run server-side
  // and loads .onnx model files from disk. Keep both external to bundlers.
  serverExternalPackages: ["onnxruntime-node", "@huggingface/transformers"],
  turbopack: {},
};

export default nextConfig;
