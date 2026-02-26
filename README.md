# ✦ GeminiChat — ChatGPT-like AI Chatbot with Google Gemini

A fully working, beginner-friendly AI chatbot using **Google's FREE Gemini API**, built with plain HTML/CSS/JS (frontend) and Node.js + Express (backend).

---

## 📁 Project Structure

```
gemini-chat/
├── public/              ← Frontend (served statically)
│   ├── index.html       ← Chat UI
│   ├── style.css        ← All styles
│   └── app.js           ← Frontend logic (fetch, bubbles, state)
├── server.js            ← Express backend (secure API proxy)
├── .env                 ← Your secret API key (never share this!)
├── package.json
└── README.md
```

---

## 🔑 How the API Works

1. **You** type a message in the browser.
2. **Frontend (app.js)** sends a POST request to `/api/chat` on *your own server* — **not directly to Google**.
3. **Backend (server.js)** receives the request, attaches your secret `GEMINI_API_KEY`, and forwards it to:
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
   ```
4. **Google Gemini** returns an AI-generated response.
5. **Backend** strips the raw response and returns `{ reply: "..." }` to your frontend.
6. **Frontend** displays the reply as a chat bubble.

---

## 🔒 Why is a Backend Required?

> **Never put your API key in frontend JavaScript.**

If you call Gemini directly from the browser, your API key would be visible to anyone who opens DevTools → Network tab. They could:
- Steal your key and use your free quota
- Make thousands of requests that burn your billing

The Express server acts as a **secure proxy** — the key lives only in `.env` on your machine and is never sent to the browser.

---

## 🚀 Setup Instructions

### Step 1 — Get a free Gemini API Key

1. Go to → [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key

### Step 2 — Clone / download this project

```bash
# If you have git:
git clone <your-repo-url>
cd gemini-chat

# Or just unzip the folder and cd into it
```

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Add your API key

Open `.env` and replace the placeholder:

```env
GEMINI_API_KEY=your_actual_key_here
PORT=3000
```

### Step 5 — Run the server

```bash
# Production:
npm start

# Development (auto-restarts on file changes):
npm run dev
```

### Step 6 — Open in browser

```
http://localhost:3000
```

---

## 🌐 How Frontend Communicates with Backend

```
Browser (app.js)
      │
      │  POST /api/chat
      │  Body: { messages: [{role, text}, ...] }
      ▼
Express Server (server.js)
      │
      │  POST to Google Gemini API
      │  + attaches GEMINI_API_KEY
      ▼
Google Gemini API
      │
      │  Returns { candidates: [...] }
      ▼
Express Server
      │
      │  Extracts reply text
      │  Returns { reply: "..." }
      ▼
Browser
      │
      Displays AI message bubble
```

---

## ✅ Features

- ✅ Multi-turn conversation (full history sent each request)
- ✅ Typing / loading indicator
- ✅ Markdown-lite rendering (bold, code blocks, inline code)
- ✅ Suggestion chips on welcome screen
- ✅ New Chat button (clears history)
- ✅ Enter to send, Shift+Enter for newline
- ✅ Auto-expanding textarea
- ✅ Error handling (API errors, network errors, empty input)
- ✅ API key fully secured server-side

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---|---|
| `Error: Cannot find module 'express'` | Run `npm install` |
| `API key not valid` | Check your `.env` file — no spaces around `=` |
| `Port already in use` | Change `PORT=3001` in `.env` |
| Blank page / 404 | Make sure you're accessing `localhost:3000`, not opening the HTML file directly |

---

## 📝 Notes

- Uses **Gemini 1.5 Flash** — fastest, free tier model
- `node-fetch` v2 is used (CommonJS compatible with `require()`)
- To use **streaming** responses (text appears word-by-word), you'd switch to `generateContentStream` — an advanced extension of this project
