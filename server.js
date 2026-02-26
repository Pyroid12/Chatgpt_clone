// ============================================================
//  server.js  –  Express backend for Gemini Chatbot
//  WHY a backend?
//    • Keeps your GEMINI_API_KEY off the browser (never exposed)
//    • Acts as a secure proxy between frontend and Google's API
// ============================================================

const express = require("express");
const fetch   = require("node-fetch");        // HTTP calls to Google
require("dotenv").config();                   // loads .env → process.env

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());                      // parse JSON request bodies
app.use(express.static("public"));            // serve frontend files

// ── POST /api/chat ───────────────────────────────────────────
//  Frontend sends: { messages: [ {role, text}, … ] }
//  We call Gemini, then return: { reply: "…" }
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided." });
    }

    // Build Gemini "contents" array from conversation history
    // Gemini uses roles "user" and "model" (not "assistant")
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    // ── Call Google Gemini API ───────────────────────────────
    const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/` +
  `gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await geminiRes.json();

    // Handle API-level errors returned by Google
    if (!geminiRes.ok || data.error) {
      console.error("Gemini API error:", data.error || data);
      return res.status(502).json({
        error: data.error?.message || "Gemini API request failed.",
      });
    }

    // Extract the text reply from the nested response structure
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Gemini Chatbot running → http://localhost:${PORT}`);
});
