import express from "express";
import {
  createEmbeddings,
  createVectorIndex,
  getDoctorEmbedding,
  RunVectorSearch,
} from "../controllers/embeddingsController.js";

const router = express.Router();

router.patch("/doctor/create/:id/", getDoctorEmbedding);
router.get("/doctor/create/", createEmbeddings);
router.get("/createVectorIndex/", createVectorIndex);
router.post("/vectorSearch/", RunVectorSearch);
router.get("/", (req, res) => {
  res.status(200).send("Welcome to the Embeddings API of medcare hub");
});

export default router;
