### 📝 Journal Buddy
AI-powered journaling platform for emotional insight and self-growth.

# 🌟 Overview
Journal Buddy is a full-stack journaling web app that lets users write daily reflections while leveraging AI to gain deep emotional insights. Using Gemini AI, it predicts mood sentiments and provides supportive remarks, helping users track their emotional well-being over time.

🧠 Achieves 90%+ sentiment analysis accuracy with an interactive dashboard to visualize trends.

## 🚀 Features
✍️ Journal Entry Form
Write down your feelings and reflections in a dedicated space.

# 🤖 Mood Prediction & Emotional Feedback
Entries are analyzed by Gemini AI API, and emotional sentiments (e.g., happy, sad, neutral) are predicted with tailored responses.

# 💬 AI Chatbot
Get real-time conversations with a Gemini-powered chatbot for advice or emotional support.

# 📧 Automated Email Reminders
If no journal entry is submitted within 24 hours, a gentle reminder is emailed.

# 📊 Mood Dashboard
Track emotional trends with an interactive sentiment dashboard and view:

Total number of entries

Average sentiment scores

Visual mood trends over time

# 🔐 User Authentication
Secure login/signup using JWT (JSON Web Tokens).

### 🛠️ Tech Stack

React.js + Vite	Node.js + Express
Gemini AI API
CSS (custom styling)	
MongoDB (Mongoose)	
JWT Authentication
Nodemailer (email)

### 📁 Project Structure
```bash
├── journal-client/       # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── JournalForm.jsx
│   │   ├── MoodDashboard.jsx
│   │   └── ...
│   └── .env
│
├── server/               # Backend (Node.js)
│   ├── controller/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── server.js
│   ├── geminiService.js
│   └── .env
│
└── README.md
```

Mood Dashboard & Sentiment Stats:


Journal Form with Sentiment Feedback:


### 📦 Setup & Run

# 1. Clone the Repo
```bash
git clone https://github.com/amishikaushal/journal-buddy.git
cd journal-buddy
```

# 2. Configure Environment Variables:

```bash

/journal-client/.env

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


/server/.env

PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_token
```

# 3. Install Dependencies
```bash
cd journal-client
npm install

cd ../server
npm install
```

### 4. Run the App
```bash
#Run frontend


cd journal-client
npm run dev

# Run backend
cd ../server
node server.js
```

### 🙌 Acknowledgements:

Google Gemini API
Supabase
JWT
Nodemailer

### 📬 Contact
Built with ❤️ by Amishi Kaushal
Let’s connect on LinkedIn