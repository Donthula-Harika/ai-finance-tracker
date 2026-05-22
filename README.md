<div align="center">
  <br />
  <img src="https://img.icons8.com/color/120/000000/activity-history.png" alt="FinFlow Logo" />
  <h1>FinFlow: AI-Powered Personal Finance Tracker</h1>
  <p>
    <strong>A premium, full-stack financial command center that turns raw income and expense entries into structured insights, predictions, and automated PDF reports.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

<br />

## 🌟 The Problem We Solve
Every month, millions of people stare at banking apps with no idea where their money went. Generic statements fail to provide category-level budgets, AI-driven insights, or early-warning spending predictions. 

**FinFlow solves this by providing:**
- 📊 **Categorized Breakdowns:** Know exactly how much went to food, rent, or entertainment.
- 🚨 **Overspending Alerts:** Monthly and per-category budgets with visual progress bars.
- 🧠 **Personalized Advice:** AI insights generated from your actual transaction history.
- 📄 **Beautiful Reports:** Generate and download summarized monthly PDF reports on demand.

## 🚀 Key Features
- **Secure Authentication:** JWT-based stateless authentication with `bcrypt` password hashing.
- **Advanced CRUD & Filtering:** Manage transactions with search, sorting, and pagination.
- **Dual-Engine AI Insights:** Uses **OpenAI (`gpt-4o-mini`)** for natural language insights. If no API key is provided, gracefully falls back to a custom **Deterministic Heuristic Engine**.
- **Spending Prediction Engine:** Averages monthly expense buckets to forecast spend, attaching a confidence score and budget-risk flag.
- **Premium Glassmorphism UI:** Edge-to-edge docked sidebar, ambient radial glows, and cohesive frosted-glass data cards built with Tailwind CSS and Framer Motion.
- **Server-Side PDFs:** Monthly summaries compiled directly on the Node server using PDFKit and streamed to the client.

## 🛠 Tech Stack

### Frontend (Client)
- **React 18 & Vite:** Lightning-fast component rendering and hot module replacement.
- **Redux Toolkit:** Scalable global state management.
- **React Router v6:** Protected routes and seamless nested layouts.
- **Recharts:** Dynamic data visualizations (Area, Bar, and Pie charts).
- **Tailwind CSS:** Custom design system enforcing high-contrast typography and complex drop-shadow layers.

### Backend (Server)
- **Node.js & Express:** Robust REST API built with ES Modules.
- **MongoDB & Mongoose:** Highly indexed NoSQL data models ensuring isolated per-user data.
- **Security:** Helmet (HTTP headers), Express-Rate-Limit (DDoS protection), CORS.
- **OpenAI SDK:** Connects transaction aggregates to LLM-driven financial advising.
- **PDFKit:** Dynamic document generation without heavy client-side libraries.

---

## 💻 Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB Atlas](https://cloud.mongodb.com/) account (or local MongoDB instance)
- (Optional) [OpenAI API Key](https://platform.openai.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-finance-tracker.git
cd ai-finance-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@cluster0.xxxxx.mongodb.net/ai-finance-tracker
JWT_SECRET=your_super_secret_jwt_string
JWT_EXPIRE=7d

# Optional AI Integration
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the frontend Vite server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser. Create an account, log in, and start tracking!

---

## 🛡 Database Security & Architecture
- **Per-User Isolation:** Every controller strictly applies `userId: req.userId` to all database queries, meaning a user can never access or leak another user's financial data.
- **Compound Indexing:** Indexes on `(userId, transactionDate)`, `(userId, type)`, and `(userId, category)` keep the dashboard queries blazing fast as the database scales.
- **Self-Healing Auth:** On any 401 unauthorized response, an Axios interceptor immediately purges the local token to protect the application state.

## 🎨 UI/UX Design Philosophy
FinFlow rejects the standard flat-gray dashboard. The application leans heavily into **Cinematic Glassmorphism**:
- Soft ambient background blobs (`blur-[150px]`) project color beneath frosted panels.
- Highly legible pure-black (`#000000`) typography anchors numeric data against a warm cream (`#f7f0e4`) base.
- Data cards employ subtle Y-axis translations (`hover:-translate-y-1.5`) and layered glow shadows (`hover:shadow-glow-ai`) to respond physically to user interaction.

---
*Built with ❤️ for modern personal finance management.*
