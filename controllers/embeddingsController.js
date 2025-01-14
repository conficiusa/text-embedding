import { getEmbedding } from "../utils/get-embedding.js";
import User from "../models/User.js";
import { CreateEmbeddingsForAll } from "../utils/create-embeddings.js";

export const getDoctorEmbedding = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("Doctor ID is required", {
        cause: "Bad Request",
      });
    }
    const doctor = await User.findById(id);
    if (!doctor) {
      throw new Error("Doctor not found", { cause: "Not Found" });
    }
    // Ensure the user is a doctor
    if (doctor.role !== "doctor") {
      throw new Error("User is not a doctor");
    }

    const { languages, doctorInfo, city } = doctor;
    const { specialities, certifications, bio } = doctorInfo;

    const docData = `treats conditions related to ${specialities.join(
      ","
    )}, ${bio}, was certified in  ${certifications.join(
      ","
    )}, speaks ${languages.join(",")} located in ${city}`;

    const embedding = await getEmbedding(docData);

    doctor.embedding = embedding;
    await doctor.save();

    if (!embedding) throw new Error("Error getting embedding");

    res.status(200).json({ embedding, success: true });
  } catch (err) {
    next(err);
  }
};

export const createEmbeddings = async (req, res, next) => {
  try {
    await CreateEmbeddingsForAll();
    res.status(200).json({ success: true, message: "Embeddings created" });
  } catch (err) {
    next(err);
  }
};

export async function createVectorIndex(req, res, next) {
  try {
    const index = {
      name: "vectorSearchIndex",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            similarity: "dotProduct",
            numDimensions: 384,
          },
        ],
      },
    };
    // run the helper method
    const result = await User.createSearchIndex(index);
    if (result) {
      console.log("Search index created successfully");
    }

    res.status(200).json({ success: true, message: "Index created" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

// MongoDB connection URI and options

export async function RunVectorSearch(req, res, next) {
  try {
    const { query } = req.body;
    if (!query) {
      throw new Error("search query is required", {
        cause: "Bad Request",
      });
    }
    // Generate embedding for the search query
    const queryEmbedding = await getEmbedding(query);
    const pipeline = [
      {
        $vectorSearch: {
          index: "vectorSearchIndex",
          queryVector: queryEmbedding,
          path: "embedding",
          limit: 5,
          exact: true,
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          languages: 1,
          doctorInfo: 1,
          city: 1,
          image: 1,
          address_1: 1,
          address_2: 1,
          role: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];

    // run pipeline
    const result = await User.aggregate(pipeline);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const welcomeController = (req, res) => {
  res.status(200).send("Welcome to MedCare");
};
