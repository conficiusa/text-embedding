import User from "../models/User.js";
import { getEmbedding } from "./get-embedding.js";

export async function CreateEmbeddingsForAll() {
  try {
    const filter = {
      role: "doctor",
      $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }],
    };
    const documents = await User.find(filter).limit(50);
    console.log("Count of documents: " + documents.length);

    // Create embeddings from a field in the collection
    let updatedDocCount = 0;
    console.log("Generating embeddings for documents...");
    await Promise.all(
      documents.map(async (doc) => {
        const { languages, doctorInfo, city } = doc;
        const { specialities, certifications, bio } = doctorInfo;

        const docData = `treats conditions related to ${specialities.join(
          ","
        )}, ${bio}, was certified in  ${certifications.join(
          ","
        )}, speaks ${languages.join(",")} located in ${city}`;
        const embedding = await getEmbedding(docData);
        // Update the document with a new embedding field
        await User.findByIdAndUpdate(doc._id, { $set: { embedding } });
        updatedDocCount += 1;
      })
    );
    console.log("Count of documents updated: " + updatedDocCount);
  } catch (err) {
    throw err;
  }
}

// connect to your Atlas deployment
