import dotenv from "dotenv";
dotenv.config();

console.log("API KEY:", process.env.OPENAI_API_KEY);

import express from "express";
import multer from "multer";
import cors from "cors";
import { parsePDF } from "./utils/parser.js";
import { chunkText } from "./utils/chunker.js";
import { createEmbeddings, queryRAG } from "./rag.js";
import { calculateMatch } from "./utils/scorer.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

let resumeChunks = [];
let jdText = "";

// Upload Resume + JD
app.post("/upload", upload.fields([
  { name: "resume" },
  { name: "jd" }
]), async (req, res) => {
  const resumePath = req.files["resume"][0].path;
  const jdPath = req.files["jd"][0].path;

  const resumeText = await parsePDF(resumePath);
  jdText = await parsePDF(jdPath);

  resumeChunks = chunkText(resumeText);

  await createEmbeddings(resumeChunks);

  const match = calculateMatch(resumeText, jdText);

  res.json(match);
});

// Chat (RAG)
app.post("/chat", async (req, res) => {
  const { question } = req.body;

  const answer = await queryRAG(question);

  res.json({ answer });
});

app.listen(5000, () => console.log("Server running"));

