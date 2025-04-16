# Changelog — Investim Client

## [Unreleased]
- Initial project setup with Next.js App Router and TypeScript.
- Mobile-first UI with Tailwind CSS and Inter font.
- Integrated chatbot with RAG backend via `/app/api/rag/route.ts`.
- Added shadcn/ui and Radix UI components for modern, accessible UI.
- Chatbot improvements: animated chat bubbles, avatars, timestamps, sources collapsible, auto-scroll.
- Enhanced error handling and loading states in chat.
- Environment variable support for FastAPI backend URL.

## [2025-04-16] AddGoalForm & GoalManager Major UX/UI Update
- AddGoalForm now uses a branded slider for target amount, with K-formatting (e.g., 15K).
- Added icon selector with 5 green Lucide icons (Home, Target, Car, Book, Gift) and a generic Circle; user selection is required and validated.
- Add Goal and Cancel buttons are on the same row; Add Goal button uses #079669 for brand consistency.
- GoalManager now displays the selected icon on each card, using the correct green Lucide icon.
- The Add New Goal button is always displayed at the bottom of the list.
- Improved accessibility: Dialog now includes DialogTitle for screen readers.
- All UI elements match mobile-first, Tailwind-based app design.
- No backend persistence; all data is client-only and modular.

---
See previous commits for detailed code-level changes.
