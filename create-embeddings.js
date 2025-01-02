import { MongoClient } from "mongodb";
import { getEmbedding } from "./index.js";

// Connect to your Atlas cluster
const client = new MongoClient(
  "mongodb+srv://addawebadua:2006adda@medcare.jqcyr.mongodb.net/?appName=medcare"
);

async function run() {
  try {
    await client.connect();
    const db = client.db("Medcare");
    const collection = db.collection("users");

    // Filter to exclude null or empty summary fields
    const filter = { role: "doctor" };

    // Get a subset of documents from the collection
    const documents = await collection.find(filter).limit(50).toArray();
    console.log("Count of documents: " + documents.length);

    // Create embeddings from a field in the collection
    let updatedDocCount = 0;
    console.log("Generating embeddings for documents...");
    await Promise.all(
      documents.map(async (doc) => {
        // Generate an embedding by using the function that you defined
        const embedding = await getEmbedding([
          doc.doctorInfo.specialities.join(","),
          doc.doctorInfo.bio,
          doc.doctorInfo.certifications.join(","),
          doc.languages.join(","),
        ]);

        // Update the document with a new embedding field
        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              embedding: embedding,
            },
          }
        );
        updatedDocCount += 1;
      })
    );
    console.log("Count of documents updated: " + updatedDocCount);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
