# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a mobile-first investment assistant app built with Next.js 15, TypeScript, and Tailwind CSS. The application follows a modern React architecture with the following key patterns:

### Backend Integration
- **RAG API Proxy**: All chatbot queries go through `/app/api/rag/route.ts` which proxies requests to a FastAPI backend
- **Environment Variable**: `FASTAPI_RAG_URL` must be set in `.env.local` (defaults to `http://127.0.0.1:8000/query`)
- **No Direct Browser Calls**: Frontend never calls the FastAPI backend directly for security

### Component Architecture
- **shadcn/ui Components**: Extensive use of Radix UI-based components in `/components/ui/`
- **Feature Components**: Main application components in `/components/` (Chatbot, GoalManager, etc.)
- **App Router**: Uses Next.js 15 App Router with layout and page structure in `/app/`

### Key Features
- **Interactive Chatbot**: Risk assessment quiz followed by AI-powered investment advice
- **Goal Management**: Investment goal tracking with progress visualization
- **Performance Charts**: Portfolio performance visualization using Recharts
- **Asset Allocation**: Interactive pie charts with ETF breakdowns
- **Mobile-First Design**: Responsive design optimized for mobile with bottom navigation

### State Management Patterns
- **Local State**: Components use React hooks (useState, useEffect) for local state
- **Form Handling**: React Hook Form with Zod validation for forms
- **Chart Rendering**: Custom canvas-based pie charts and Recharts for line charts

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Theme System**: Uses next-themes for theme management
- **Component Variants**: class-variance-authority for component styling patterns

## Deployment
- **Netlify**: Configured for deployment with `netlify.toml`
- **Node Version**: Uses Node.js 20 in production
- **Static Generation**: Next.js static site generation for optimal performance