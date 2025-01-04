import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import embeddingsRouter from "./routes/appRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

app.use("/api/v1/embeddings", embeddingsRouter);
// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Server Error" });
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "Medcare" })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
