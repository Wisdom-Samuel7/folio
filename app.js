import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix for ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ROUTES ----
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/projects", (req, res) => res.sendFile(path.join(__dirname, "public", "projects.html")));
app.get("/ai", (req, res) => res.sendFile(path.join(__dirname, "public", "ai.html")));
app.get("/kuc-ai-chat", (req, res) => res.sendFile(path.join(__dirname, "public", "kuc-ai-chat.html")));
app.get("/blogs", (req, res) => res.sendFile(path.join(__dirname, "public", "blogs.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "public", "contact.html")));

// ---- AI CHAT ENDPOINT (OpenRouter.ai) ----
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    console.log("🎯 User message:", message);

    // 🔹 Multiple system roles
    const systemRoles = [
      { role: "system", content: "You are KNOWURCRAFT AI assistant." },
      { role: "system", content: "Represent Wisdom Samuel, CEO of KNOWURCRAFT." },
      { role: "system", content: "Music Producer & Sound Designer with 100K+ YouTube subscribers." },
      { role: "system", content: "1M+ views on a popular post." },
      { role: "system", content: "Full-Stack MERN developer for Web & Mobile apps." },
      { role: "system", content: "Experience teaching in multiple schools interstate." },
      { role: "system", content: "Remote experience with CVtoCareer (Australia)." },
      { role: "system", content: "Always answer naturally, professionally, and engagingly." },
      { role: "system", content: "Provide accurate info about projects, music, and tech expertise." },
      { role: "system", content: "End answers warmly and encourage users to explore the portfolio." }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct", // Free + reliable model
        messages: [...systemRoles, { role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("🚨 OpenRouter API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "No response.";
    res.json({ reply });

  } catch (error) {
    console.error("🚨 Server Error:", error);
    res.status(500).json({ error: "AI service failed. Please try again later." });
  }
});

// ---- START SERVER ----
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
