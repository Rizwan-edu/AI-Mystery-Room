# 🕵️‍♂️ AI Mystery Room — Interactive Investigation Game

> Built for the **NxtWave Build Your Own AI Investigation Room** Workshop.
> An interactive full-stack detective game where players investigate AI-generated mysteries, discover forensic clues, request hints, and solve crimes.

---

## 🌟 Key Features

* **Dynamic AI Case Generation**: Powered by Google Gemini via the official `@google/genai` SDK with strict Zod schema validation and fallbacks.
* **Authentic Investigation Room**:
  * Suspect dossiers with detailed backgrounds, motives, and alibis.
  * Interactive evidence board with forensic inspection (+5 bonus points per discovered clue).
  * Progressive hint bureau (-10 points per hint penalty).
* **Strict Solution Privacy (Zero-Leak Security)**: The true culprit, solution explanation, and forensic proofs are strictly omitted from client responses until an official accusation is submitted.
* **Server-Side Scoring Authority**:
  $$\text{Final Score} = \max(0, \text{Base Points} + (\text{Clues} \times 5) - (\text{Hints} \times 10))$$
  * Correct Accusation: Full calculated score.
  * Incorrect Accusation: 0 points.
  * Duplicate clue abuse and repeated accusations are strictly blocked.
* **Three Adaptive Difficulty Tiers**:
  * **Easy**: 3 suspects, 5 clues, 2 hints, 100 base points.
  * **Medium**: 4 suspects, 7 clues, 3 hints, 150 base points.
  * **Hard**: 5 suspects, 9 clues, 3 hints, 200 base points.
* **Cinematic Detective UI/UX**: Dark charcoal noir aesthetic with gold/amber accents, Lucide iconography, and responsive design.

---

## 📸 Screenshots Showcase

*(Screenshots captured during live investigation verification)*

| Screen | Description |
|---|---|
| **Home Page** | Cinematic hero, investigation blueprint, and difficulty cards |
| **Case Commission** | Custom premise input, inspiration chips, and difficulty selection |
| **Investigation Room** | Active dossier, suspect cards, hints bureau, and evidence board |
| **Accusation Modal** | Binding accusation selection with final confirmation check |
| **Results & Verdict** | Final score breakdown, culprit revelation, and forensic deduction |

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, Axios, Lucide React
* **Backend**: Node.js (ESM), Express.js 4, Mongoose 8, `@google/genai`, Zod, Helmet, Express Rate Limit, CORS, dotenv
* **Database**: MongoDB Atlas
* **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

```text
AI-Mystery-Room/
├── client/                      # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── assets/              # Icons and static media
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── ClueCard.jsx
│   │   │   ├── DifficultyCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedError.jsx
│   │   │   └── SuspectCard.jsx
│   │   ├── pages/               # Application Pages
│   │   │   ├── CreateMystery.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InvestigationRoom.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── App.jsx              # Routes configuration
│   │   ├── index.css            # Tailwind theme & noir styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                      # Backend REST API (Node.js + Express)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   └── caseController.js    # Business logic & DTO serializers
│   ├── middleware/
│   │   └── errorHandler.js      # Centralized error handling
│   ├── models/
│   │   └── Case.js              # Mongoose Case model & hybrid repository
│   ├── routes/
│   │   └── caseRoutes.js        # API endpoints
│   ├── services/
│   │   └── geminiService.js     # @google/genai integration & Zod parser
│   ├── tests/                   # Automated unit & integration tests
│   │   ├── apiIntegration.test.js
│   │   └── scoringAndSecurity.test.js
│   ├── utils/
│   │   └── scoring.js           # Scoring logic & difficulty configs
│   ├── validators/
│   │   └── caseValidator.js     # Zod schemas
│   ├── app.js                   # Express application setup
│   ├── server.js                # Server entry point
│   ├── .env.example
│   └── package.json
├── .gitignore
├── .env.example
├── SPEC.md                      # Complete Technical Specification
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- (Optional) MongoDB Atlas account or local MongoDB instance

---

### 2. Backend Setup
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   CLIENT_URL=http://localhost:5173
   ```
   *(Note: If `GEMINI_API_KEY` or `MONGODB_URI` are omitted, the server operates in resilient development mode with procedural case generation and in-memory persistence).*

4. Run automated tests:
   ```bash
   npm test
   ```
5. Start the backend server:
   ```bash
   npm start
   # Or for auto-reloading dev mode:
   npm run dev
   ```
   The backend will be live at `http://localhost:5000`.

---

### 3. Frontend Setup
1. Open a second terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure frontend environment:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Verify the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Service status check |
| `/api/cases` | `POST` | Generate and save a new mystery (`{ premise, difficulty }`) |
| `/api/cases/:id` | `GET` | Get case details (redacted if active, full if completed) |
| `/api/cases/:id/clues/:clueId/discover` | `POST` | Discover a forensic clue (+5 score bonus) |
| `/api/cases/:id/hints` | `POST` | Unlock progressive hint (-10 point penalty) |
| `/api/cases/:id/accuse` | `POST` | Submit binding accusation (`{ suspectId }`) |
| `/api/cases/:id/result` | `GET` | Retrieve complete verdict, score, and explanation |

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository and set the **Root Directory** to `client`.
4. Configure Build Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
6. Click **Deploy**.

### Backend Deployment (Render)
1. Sign in to [Render](https://render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `server`.
3. Configure Service Settings:
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `CLIENT_URL`: Your deployed Vercel frontend URL (`https://your-frontend.vercel.app`)
5. Click **Create Web Service**.

---

## ⚖️ Scoring Formula
$$\text{Final Score} = \max\Big(0, \text{Base Points} + (\text{Discovered Clues} \times 5) - (\text{Hints Used} \times 10)\Big)$$

* **Easy**: 100 Base Points
* **Medium**: 150 Base Points
* **Hard**: 200 Base Points
* **Incorrect Accusation**: **0 Points** (Regardless of clues or base points)

---

## 📄 License
Created for academic and evaluation purposes in the **NxtWave Build Your Own AI Investigation Room** Workshop.
