# PerFin AI - Personal Finance Copilot

PerFin AI is an intelligent, AI-powered personal finance management application that helps users track their financial health and provides tailored advice through dedicated AI financial advisors. With a clean, premium "Mossy Hollow" aesthetic, it offers a seamless way to manage your income, expenses, assets, liabilities, and financial goals.

## Features

- **Comprehensive Financial Tracking**: Input and manage your detailed financial data, including income, expenses, assets, liabilities, and credit health.
- **Goal Setting**: Set and monitor your financial goals (e.g., building an Emergency Fund).
- **AI Financial Advisors**: Powered by the Gemini API, get personalized advice from specialized MVP advisors:
  - 🛡️ **Insurance Advisor**
  - 🧾 **Tax Advisor**
  - 📈 **Credit Score Advisor**
- **Interactive Dashboard**: Visualize your finances with dynamic charts and graphs.
- **Premium UI/UX**: Built with a sleek, minimalist olive color palette to provide a calming, intuitive user experience.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 / React 19
- **Styling**: Tailwind CSS V4, Framer Motion (for animations)
- **State Management**: Zustand
- **Charting**: Recharts
- **Components**: Radix UI Primitives

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (motor & pymongo)
- **AI Integration**: Google Generative AI (Gemini), Groq
- **Authentication**: JWT, bcrypt, passlib
- **Data Validation**: Pydantic

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)
- MongoDB Database (e.g., MongoDB Atlas)
- Google Gemini API Key

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in your configuration:
   - `MONGODB_URL`
   - `GEMINI_API_KEY`
   - Authentication secrets, etc.
5. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Update `.env.local` with necessary environment variables (e.g., your backend API URL).
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## Deployment

The application is configured to be deployed using industry-standard cloud providers:
- **Backend**: Recommended to deploy on [Render](https://render.com/) or similar Python hosting platform.
- **Frontend**: Recommended to deploy on [Vercel](https://vercel.com/).
- **Database**: Recommended to use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for a managed cloud database solution.

## License
[MIT License](LICENSE)
