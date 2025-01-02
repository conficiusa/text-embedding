import { pipeline } from "@xenova/transformers";

// Function to generate embeddings for a given data source
export async function getEmbedding(data) {
 const pipe = await pipeline(
   "embeddings",
   "nomic-ai/nomic-embed-text-v1.5"
 );
  const results = await pipe(data, { pooling: "mean", normalize: true });
  return Array.from(results.data);
}
