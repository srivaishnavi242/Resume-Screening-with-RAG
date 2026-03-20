import { pipeline } from "@xenova/transformers";

let extractor;
let vectorDB = [];

// Load embedding model
async function loadModel() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
}

// Create embeddings
export async function createEmbeddings(chunks) {
  await loadModel();
  vectorDB = [];

  for (let chunk of chunks) {
    const embedding = await extractor(chunk, { pooling: "mean", normalize: true });

    vectorDB.push({
      text: chunk,
      embedding: embedding.data
    });
  }
}

// Cosine similarity
function similarity(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

// Query RAG
export async function queryRAG(question) {
  await loadModel();

  const qEmbedding = await extractor(question, { pooling: "mean", normalize: true });

  const qVec = qEmbedding.data;

  const ranked = vectorDB
    .map(item => ({
      ...item,
      score: similarity(qVec, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const context = ranked.map(r => r.text).join("\n");

  // Simple answer generator (no paid LLM)
  // 🔹 Clean text
const cleanContext = context.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
const cleanQuestion = question.toLowerCase().replace(/[^a-z0-9 ]/g, " ");

// 🔹 Stopwords
const stopWords = [
  "does","the","is","a","an","he","she","they",
  "candidate","know","have","has","what","which"
];

// 🔹 Extract keywords
const keywords = cleanQuestion
  .split(" ")
  .filter(word => word.length > 2 && !stopWords.includes(word));

// 🔹 Match keywords
const matched = keywords.filter(word => cleanContext.includes(word));

// 🔹 Supporting lines
const contextLines = context.split("\n");
const supportingLines = contextLines.filter(line =>
  keywords.some(word => line.toLowerCase().includes(word))
);

// 🔥 FINAL ANSWER
if (matched.length > 0) {
  return `
✅ Answer: Yes — the candidate has relevant experience.

🔑 Matched Skills: ${matched.join(", ")}

📄 Supporting Evidence:
${supportingLines.join("\n") || context}
`;
} else {
  return `
❌ Answer: No strong evidence found.

🔍 Keywords Checked: ${keywords.join(", ")}

📄 Closest Resume Content:
${context}
`;
}
}