import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const EMBEDDING_MODEL = "llama-nemotron-embed-vl-1b-v2";

interface EmbedOptions {
  inputType?: "query" | "passage";
}

export async function embed(texts: string[], options: EmbedOptions = {}): Promise<number[][]> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY not set. Get a free key at https://build.nvidia.com/");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: NVIDIA_BASE_URL,
  });

  const inputType = options.inputType || "passage";

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    // @ts-expect-error - input_type is NVIDIA-specific
    input_type: inputType,
    // @ts-ignore
    truncate: "END",
  });

  return response.data.map((item) => item.embedding);
}

export async function embedOne(text: string): Promise<number[]> {
  const [vec] = await embed([text], { inputType: "passage" });
  return vec;
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embed([text], { inputType: "query" });
  return vec;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}
