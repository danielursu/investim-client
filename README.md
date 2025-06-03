# Investim Client

A mobile-first, modern investment assistant app built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features
- **Mobile-optimized UI** using Tailwind CSS and Inter font
- **Conversational chatbot** integrated with a FastAPI RAG backend
- **Risk assessment quiz** with asset allocation recommendations
- **Investment goal tracking** with progress visualization
- **Portfolio performance charts** with interactive period selection
- **Secure API routing**: Next.js API route proxies all RAG queries to FastAPI (no direct browser calls)
- **shadcn/ui & Radix UI** for accessible, beautiful components
- **User profile picture support** in chat
- **Animated chat bubbles** with timestamps and collapsible sources
- **Environment variable validation** for backend URL (`FASTAPI_RAG_URL`)
- **Type-safe development** with comprehensive TypeScript support

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
```
├── app/                     # Next.js App Router pages and API routes
├── components/
│   ├── Dashboard/          # Dashboard-specific components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── [features]/         # Feature-specific components
├── constants/              # Shared constants (colors, icons)
├── data/                   # Mock data and configuration
├── lib/                    # Utility functions and configuration
├── types/                  # Shared TypeScript type definitions
└── public/                 # Static assets

Key files:
- `/app/api/rag/route.ts` — API route proxying RAG queries to FastAPI
- `/lib/env.ts` — Environment variable validation
- `/constants/colors.ts` — Centralized color system
- `/types/index.ts` — Shared type definitions
```

## Development Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint for code quality checks


## License
MIT
