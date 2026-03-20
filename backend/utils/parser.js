import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function parsePDF(path) {
  const dataBuffer = fs.readFileSync(path);
  const data = await pdf(dataBuffer);
  return data.text;
}