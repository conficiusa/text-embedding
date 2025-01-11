import { pipeline } from "@xenova/transformers";

// Function to generate embeddings for a given data source
export async function getEmbedding(data) {
 try {
  const pipe = await pipeline("feature-extraction", "Supabase/gte-small");
  const results = await pipe(data, { pooling: "mean", normalize: true });
  return Array.from(results.data);
 } catch (error) {
   throw new Error(`Error generating embeddings: ${error.message}`, {
     cause: error?.message
   });
  
 }
}
 