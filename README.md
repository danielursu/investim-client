# Investim Client

A mobile-first, modern investment assistant app built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features
- **Mobile-optimized UI** using Tailwind CSS and Inter font
- **Conversational chatbot** integrated with a FastAPI RAG backend
- **Secure API routing**: Next.js API route proxies all RAG queries to FastAPI (no direct browser calls)
- **shadcn/ui & Radix UI** for accessible, beautiful components
- **User profile picture support** in chat
- **Animated chat bubbles** with timestamps and collapsible sources
- **Environment variable** for backend URL (`FASTAPI_RAG_URL`)

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env.local` file and set your FastAPI backend URL:
   ```env
   FASTAPI_RAG_URL=http://127.0.0.1:8000/query
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `/app` — Next.js App Router pages and API routes
- `/components` — Global and feature UI components
- `/app/api/rag/route.ts` — API route proxying RAG queries to FastAPI
- `/public` — Static assets (including profile pictures)


## License
MIT
