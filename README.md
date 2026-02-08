# 🌌 EduSparkz: The Knowledge Galaxy

**EduSparkz** is a premium, AI-driven educational platform designed to bridge the gap between static learning materials and interactive mastery. By leveraging cutting-edge Large Language Models (LLMs) and a cinematic "Knowledge Galaxy" aesthetic, it transforms PDFs and documents into dynamic, personalized learning experiences.

---

##  Key Features

### AI-Powered Intelligence
- **Dynamic Quiz Generation**: Instantly transform any PDF, document, or image into comprehensive MCQs using **Google Gemini AI**.
- **Chat with Docs**: Interactive AI assistant that lets you "talk" to your learning materials for real-time clarification.
- **Intelligent Feedback**: Receive deep-dive explanations for quiz answers, moving beyond simple correct/incorrect scores.

### Premium User Experience
- **Cinematic Interface**: A state-of-the-art dark theme featuring "Knowledge Galaxy" animations, glassmorphism, and smooth Framer Motion transitions.
- **Micro-interactions**: High-end hover effects, orbital loader animations, and confetti celebrations upon achievement.
- **Professional Analytics**: Track your progress with detailed performance charts and retention metrics.

### Secure & Scalable
- **Robust Authentication**: Secure login/signup system powered by **Supabase Auth**.
- **Real-time Synchronization**: Instant data persistence across sessions for learning history and saved materials.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Styling** | Framer Motion, Lucide React, Radix UI (Shadcn) |
| **AI/ML** | Google Gemini Generative AI, Tesseract.js (OCR) |
| **Backend/DB** | Supabase (PostgreSQL, Realtime, Functions) |
| **Persistence** | Supabase Storage, Local Storage persistence |

---

## 📂 Project Structure

```text
EduSparkz/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── features/       # Modular features (Auth, Dashboard, Landing)
│   │   ├── components/     # Reusable Shadcn/custom UI
│   │   ├── pages/          # Full page components
│   │   └── lib/            # Third-party configs (Supabase, AI)
├── supabase/               # SQL migrations and Edge Functions
└── backend/                # Shared utilities and legacy migrations
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / bun
- Supabase account & project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OsamaAbdul/EduSparkz.git
   cd EduSparkz/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_google_ai_key
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Developer
**Osama Abdullahi Ibrahim**  
*Full-Stack Developer | AI Integration Specialist*

> "Dedicated to building the next generation of intelligent educational tools."

---

## 📄 License
MIT License © 2025 EduSparkz
