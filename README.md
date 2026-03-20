# 📄 Resume Screening System using RAG

## 🚀 Overview
This project is an AI-powered Resume Screening System built using **Retrieval-Augmented Generation (RAG)**.  
It allows users to upload a resume and job description, calculate a match score, and ask intelligent questions based on the resume content.

---

## 🎯 Features
- 📄 Upload Resume (PDF)
- 📑 Upload Job Description (PDF)
- 📊 Match Score Calculation
- 🤖 RAG-based Question Answering
- 🔍 Keyword-based intelligent responses
- 💬 Chat interface for resume queries

---

## 🧠 How It Works
1. Resume and JD are uploaded  
2. PDF text is extracted  
3. Resume is split into chunks  
4. Free embeddings are generated using Transformers  
5. Similar chunks are retrieved based on user query  
6. Answer is generated using retrieved context (RAG)  
