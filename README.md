# AI Memory Book — MERN

An AI-powered digital memory book / scrapbook application built with MongoDB, Express.js, React and Node.js.

## Core idea

Users can:
- Create a personal memory from a title, description and date.
- Upload/select memory images.
- Choose how the memory should be transformed:
  - Story
  - Poetry
  - Magazine
  - Short Memory Book
- Generate AI-assisted content from the memory.
- Save generated memories in their personal dashboard.
- View, edit and delete memories.

## Tech Stack

### Frontend
- React + Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Multer
- OpenAI-compatible AI service hook

## Project Structure

AI-Memory-Book-MERN/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md

## Requirements

- Node.js 18+
- MongoDB local installation OR MongoDB Atlas
- An AI API key if you want real AI generation

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-memory-book
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173

# Optional AI integration
AI_API_KEY=
AI_MODEL=
AI_BASE_URL=
```

Run:

```bash
npm run dev
```

### 2. Frontend

Open another terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## AI Integration

The server contains an AI service abstraction in:

`server/services/aiService.js`

If no AI key is configured, the application uses a local demo generator so the project remains runnable without an API key.

When you are ready, connect an OpenAI-compatible provider by setting:

```env
AI_API_KEY=your_key
AI_MODEL=your_model
AI_BASE_URL=https://api.openai.com/v1
```

The application sends the user's memory to the backend and the backend asks the AI service to generate the selected format.

## Important

This is a strong academic/final-year MVP foundation, not a production deployment. Before public deployment add:
- Cloud image storage
- Rate limiting
- Email verification
- Password reset
- Content moderation
- Image optimization
- Database indexes
- Request validation with a schema library
- Secure production cookies/token strategy
- Logging/monitoring
- AI cost/rate controls
