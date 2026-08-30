# ScopeSprint

ScopeSprint is an AI Engineering Manager that protects developers from impossible project scope.
"Ship the right scope. Not the biggest scope."

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AI (Gemini):**
   Copy `.env.example` to `.env` and add your Gemini API key.
   ```bash
   cp .env.example .env
   ```
   *Note: If no API key is provided, the app will gracefully fall back to a mock demo state.*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

## Production Build & Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deployment (Vercel / Netlify):**
   This is a standard Vite React application. You can deploy it to Vercel or Netlify simply by pointing them to the repository.
   
   **IMPORTANT:** Be sure to set the `VITE_GEMINI_API_KEY` environment variable in your deployment platform's dashboard. Never commit your real API key to version control.

## Core Features
*   **AI Scope Analysis:** Evaluates project ideas against available time constraints.
*   **MVP Recommendations:** Classifies requested features into BUILD, SIMPLIFY, and CUT categories.
*   **What-If Scope Simulator:** Experiment with toggling features and applying AI simplification recommendations, instantly recalculating time budgets and project risk levels fully client-side.