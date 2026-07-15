# 🏥 MediSmart — AI-Powered Medicine Assistant

<div align="center">

![MediSmart Banner](https://img.shields.io/badge/MediSmart-AI%20Medicine%20Assistant-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMyAxN2gtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![LangChain](https://img.shields.io/badge/LangChain-Enabled-1C3C3C?style=flat-square)](https://langchain.com)
[![License](https://img.shields.io/badge/License-Educational-orange?style=flat-square)](LICENSE)

**MediSmart** is an intelligent, full-stack medical assistant app powered by Google Gemini AI.  
Scan medicine images, check drug interactions, generate PDF reports, and chat with an AI health assistant — all in one place.

[🌐 Live Demo](#) • [📖 API Docs](#api-endpoints) • [🚀 Deploy Guide](#deployment)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📸 **Medicine Scanner** | Upload a photo of any medicine strip, bottle, or package |
| 🔍 **AI-Powered OCR** | Gemini Vision extracts all visible text from the image |
| 💊 **Full Medicine Profile** | Name, ingredients, uses, dosage, side effects, warnings, expiry |
| ⚠️ **Drug Interaction Checker** | Check interactions between multiple medicines with severity rating |
| 🤖 **Medical AI Chatbot** | Chat with a knowledgeable AI medical assistant |
| 📄 **PDF Report Export** | Download a professional PDF report of any medicine scan |
| 🎨 **Modern Responsive UI** | Beautiful dark-themed UI with smooth animations |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.8+** | Runtime |
| **FastAPI** | REST API framework |
| **Google Gemini API** | Vision OCR + Text generation |
| **LangChain + LangGraph** | Structured data extraction with Pydantic |
| **ReportLab** | PDF report generation |
| **Uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **React Markdown** | Render AI chat responses |
| **CSS3** | Custom dark theme with gradients & animations |

---

## 📁 Project Structure

```
MediSmart/
├── backend/
│   ├── main.py              # FastAPI app — all routes & AI logic
│   ├── requirements.txt     # Python dependencies
│   ├── render.yaml          # Render deployment config
│   └── .env                 # API keys (not committed)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Root component & routing
│   │   ├── App.css          # Global styles & theme
│   │   ├── index.js         # React entry point
│   │   └── components/
│   │       ├── Home.js           # Landing page
│   │       ├── Extractor.js      # Medicine scanner
│   │       ├── InteractionChecker.js  # Drug interaction checker
│   │       └── Chatbot.js        # AI medical chatbot
│   ├── package.json
│   └── .env                 # Frontend env vars (not committed)
├── .gitignore
├── README.md
├── QUICK_START.md
├── start_backend.bat/.sh    # Quick-start scripts
└── start_frontend.bat/.sh
```

---

## ⚙️ Local Setup

### Prerequisites
- Python **3.8+**
- Node.js **14+** & npm
- A **Google Gemini API Key** → [Get one here](https://aistudio.google.com/app/apikey)

---

### 🐍 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create & activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
echo GEMINI_API_KEY=your_key_here > .env

# 5. Start the server
python main.py
```

Backend runs at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### ⚛️ Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo REACT_APP_API_BASE_URL=http://localhost:8000 > .env

# 4. Start dev server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/analyze-medicine` | Upload medicine image → get full profile |
| `POST` | `/api/check-interactions` | Check interactions between medicines |
| `POST` | `/api/chat` | Send message to AI medical chatbot |
| `POST` | `/api/generate-pdf` | Generate PDF report from medicine data |

### Example — Analyze Medicine
```http
POST /api/analyze-medicine
Content-Type: multipart/form-data

file: <image file>
```

### Example — Check Interactions
```json
POST /api/check-interactions
{
  "medicines": ["Aspirin", "Warfarin", "Ibuprofen"]
}
```

### Example — Chat
```json
POST /api/chat
{
  "message": "What are the side effects of Metformin?",
  "history": []
}
```

---

## 🚀 Deployment

### Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Set **Root Directory** to `backend`
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `GEMINI_API_KEY` = your key
   - `ALLOWED_ORIGINS` = your frontend URL

### Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `MediSmart` repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_BASE_URL` = your Render backend URL
4. Deploy 🎉

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key     # optional, same as above
ALLOWED_ORIGINS=*                       # set to frontend URL in production
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_BASE_URL=http://localhost:8000   # change to Render URL in production
```

---

## 🩺 Usage Guide

1. **Medicine Scanner** — Upload a clear photo of any medicine label/strip/bottle → get a complete profile in seconds
2. **Interaction Checker** — Enter 2+ medicine names → see if they're Safe / Caution / Dangerous to combine
3. **AI Chatbot** — Ask any general health or medicine-related question in natural language
4. **PDF Export** — After scanning, click "Download PDF" to get a formatted report

---

## ⚠️ Disclaimer

> This application is intended for **educational and informational purposes only**.  
> It is **not a substitute for professional medical advice, diagnosis, or treatment**.  
> Always consult a qualified healthcare professional before taking any medication.

---

## 📜 License

This project is for educational purposes. Feel free to fork and build upon it.

