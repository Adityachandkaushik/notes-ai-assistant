# 🧠 NoteAI — AI-Powered Study Notes Manager

A full-stack web application that transforms your syllabus into comprehensive AI-generated study notes, quizzes, flashcards, and progress tracking — powered by Groq AI.

---

## ✨ Features

### 📄 Syllabus Upload
- Upload **PDF or TXT** files, or paste syllabus text directly
- AI automatically extracts and organizes **topics/chapters**
- Supports Hindi & multilingual syllabuses

### 📝 AI Note Generation
- One-click generation of **comprehensive study notes** per topic
- Each note includes: Definition, Explanation, Key Terms, Examples, Important Points, Real-world Applications, Summary, Important Questions, Flashcards
- **Visual Mermaid diagrams** for concept mapping
- **Regenerate** notes any time

### 🎯 Quiz & Flashcards
- **AI-generated MCQ quizzes** per topic with explanations
- **Flashcard study mode** with flip animations
- **Spaced repetition** (SM-2 algorithm) for optimal memorization

### 💬 AI Chat Assistant
- Ask questions about any topic
- Context-aware responses using your generated notes
- Full conversation history

### 📊 Progress Tracking
- Mark topics as complete
- Bookmark important topics
- Quiz score history
- Overall completion percentage

### 🏆 Gamification
- XP points for every study action
- Level-up system
- **Achievements** (First Note, Perfect Quiz, Week Warrior, etc.)
- Daily login streaks

### 🔗 Other
- **Share** syllabuses publicly with a link
- **Download all notes** as a formatted PDF
- **Global search** across all syllabuses, topics, and notes
- **Translate notes** to any language
- **Text-to-Speech** for notes (browser native)
- Dark/Light theme toggle
- Keyboard shortcuts

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT + bcryptjs** | Authentication |
| **Groq API (OpenAI-compatible)** | AI text generation |
| **pdf-parse + pdf.js-extract** | PDF text extraction |
| **pdfkit** | PDF generation/download |
| **multer** | File uploads |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | UI framework |
| **React Router v6** | Client-side routing |
| **TanStack Query** | Server state management |
| **Framer Motion** | Animations |
| **Axios** | HTTP client |
| **Mermaid.js** | Diagram rendering |
| **Lucide React** | Icons |
| **react-hot-toast** | Notifications |

---

## 📁 Project Structure

```
notes manager/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seedAdmin.js       # Default admin user seed
│   ├── controllers/
│   │   ├── authController.js  # Register, login, me
│   │   └── pdfController.js   # PDF generation/download
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly
│   │   ├── errorHandler.js    # Central error handler
│   │   └── rateLimiter.js     # Per-IP rate limiting
│   ├── models/
│   │   ├── GeneratedNotes.js  # AI notes per topic
│   │   ├── Quiz.js            # Quiz questions
│   │   ├── StudyProgress.js   # User progress per syllabus
│   │   ├── Syllabus.js        # Syllabus metadata + topics
│   │   ├── Topic.js           # Individual topic
│   │   └── User.js            # User account
│   ├── routes/
│   │   ├── authRoutes.js      # POST /api/auth/*
│   │   ├── chatRoutes.js      # POST /api/chat/*
│   │   ├── notesRoutes.js     # GET/POST /api/notes/*
│   │   ├── progressRoutes.js  # GET/PUT /api/progress/*
│   │   ├── searchRoutes.js    # GET /api/search
│   │   ├── sharedRoutes.js    # GET /api/shared/:id
│   │   └── syllabusRoutes.js  # GET/POST /api/syllabus/*
│   ├── services/
│   │   ├── aiService.js       # All Groq AI calls
│   │   └── pdfParser.js       # PDF text extraction
│   ├── .env                   # Environment variables (git-ignored)
│   ├── .env.example           # Template for environment setup
│   └── server.js              # Express app entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ChatAssistant.jsx     # AI chat panel
        │   ├── FlashcardStudy.jsx    # Flip card UI
        │   ├── GlobalSearch.jsx      # Cmd+K search
        │   ├── KeyboardShortcuts.jsx # Shortcut handler
        │   ├── Layout.jsx            # App shell with sidebar
        │   ├── MermaidChart.jsx      # Diagram renderer
        │   ├── ProtectedRoute.jsx    # Auth guard
        │   ├── QuizModal.jsx         # MCQ quiz UI
        │   ├── Sidebar.jsx           # Navigation sidebar
        │   └── SpacedRepetition.jsx  # SM-2 flashcard review
        ├── context/
        │   ├── AuthContext.jsx        # User auth state
        │   ├── GamificationContext.jsx # XP/levels/streaks
        │   └── ThemeContext.jsx       # Dark/light theme
        ├── pages/
        │   ├── Dashboard.jsx    # Home with syllabuses + exam countdown
        │   ├── Landing.jsx      # Marketing landing page
        │   ├── Login.jsx        # Login form
        │   ├── NotesViewer.jsx  # Main notes reading page
        │   ├── Progress.jsx     # Study progress page
        │   ├── SharedViewer.jsx # Public syllabus view
        │   ├── Signup.jsx       # Registration form
        │   └── Upload.jsx       # Syllabus upload page
        └── services/
            └── api.js           # Axios instance + interceptors
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** running locally (`mongodb://localhost:27017`) or MongoDB Atlas
- **Groq API Key** (free) — get one at [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cd backend
copy .env.example .env
```

Edit `backend/.env` and fill in:
```env
MONGO_URI=mongodb://localhost:27017/noteai
JWT_SECRET=your_random_secret_here
AI_API_KEY=gsk_your_groq_key_here          # from console.groq.com
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=qwen/qwen3.8-27b
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

### 4. First Login

A default admin account is auto-created on first startup:
- **Email:** `admin@noteai.com`
- **Password:** `admin123`

> Change these immediately via the auth API or MongoDB.

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |

### Syllabus
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/syllabus/upload` | Upload PDF/TXT or paste text |
| GET | `/api/syllabus` | List all user's syllabuses |
| GET | `/api/syllabus/:id` | Get syllabus with topics |
| PUT | `/api/syllabus/:id/public` | Toggle public sharing |
| DELETE | `/api/syllabus/:id` | Delete syllabus + notes |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notes/generate/:topicId` | Generate AI notes for topic |
| POST | `/api/notes/generate-all/:syllabusId` | Batch generate (up to 4) |
| GET | `/api/notes/:topicId` | Fetch notes for topic |
| PUT | `/api/notes/regenerate/:topicId` | Regenerate notes |
| POST | `/api/notes/quiz/:topicId` | Generate/fetch quiz |
| POST | `/api/notes/translate/:topicId` | Translate notes |
| GET | `/api/notes/download/:syllabusId` | Download all notes as PDF |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Chat with AI about a topic |
| POST | `/api/chat/flashcards/:topicId` | Generate flashcards |
| POST | `/api/chat/quiz/:syllabusId` | Generate syllabus-wide quiz |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress/:syllabusId` | Get study progress |
| PUT | `/api/progress/:syllabusId/complete/:topicId` | Mark topic complete |
| PUT | `/api/progress/:syllabusId/bookmark/:topicId` | Toggle bookmark |
| POST | `/api/progress/:syllabusId/quiz-score` | Save quiz score |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search?q=term` | Global search |
| GET | `/api/shared/:syllabusId` | Public syllabus view |
| GET | `/api/health` | Health check |

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `AI_API_KEY` | Yes | Groq or OpenAI API key |
| `AI_BASE_URL` | Yes | API base URL |
| `AI_MODEL` | Yes | Model name for text generation |
| `AI_VISION_MODEL` | No | Model name for vision tasks |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |
| `NODE_ENV` | No | `development` or `production` |

---

## 🎮 Gamification System

| Event | XP Earned |
|---|---|
| Generate a note | +10 XP |
| Complete a topic | +20 XP |
| Pass a quiz (≥70%) | +30 XP |
| Fail a quiz | +5 XP |
| Daily login | +15 XP |
| Flashcard session | +10 XP |

**Level up** every 100 XP. Unlock 12 achievements including:
`First Note`, `Note Taker`, `Knowledge Base`, `Perfect Score`, `Week Warrior`, `Study Machine`, and more.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Open global search |
| `Ctrl + /` | Open keyboard shortcuts help |
| `Escape` | Close modals |

---

## 🐛 Known Limitations

- Rate limiting is **in-memory** — resets if the server restarts. Use Redis for production.
- Gamification (XP/streaks) is stored in **localStorage** — does not sync across devices.
- Groq free tier has **rate limits** — if you hit them, wait a minute and retry.
- Scanned PDFs (image-only) cannot be parsed — use the paste text option instead.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ using Node.js, React, MongoDB, and Groq AI*
