export function calculateMatch(resume, jd) {
  const resumeWords = resume.toLowerCase().split(" ");
  const jdWords = jd.toLowerCase().split(" ");

  const matchCount = jdWords.filter(word => resumeWords.includes(word)).length;

  const score = Math.min(100, Math.floor((matchCount / jdWords.length) * 100));

  return {
    score,
    strengths: ["Skills overlap found"],
    gaps: ["Missing some JD keywords"]
  };
}