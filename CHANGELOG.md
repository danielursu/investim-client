# Changelog — Investim Client

## [Unreleased]

## [2025-01-03] Major Codebase Refactoring
### Architecture Improvements
- **Component Breakdown**: Reduced main `app/page.tsx` from 274 lines to 28 lines (90% reduction)
- **Created Dashboard Components**: Split into 6 focused components (`UserHeader`, `PortfolioSummary`, `GoalsSection`, `PerformanceTabs`, `PeriodSelector`, `ChatInterface`)
- **Improved File Structure**: Added organized directories for `constants/`, `types/`, `data/`, and `components/Dashboard/`

### Code Quality Enhancements
- **Eliminated Code Duplication**: Removed 143 lines of duplicate `AssetAllocationChart` implementation
- **Centralized Configuration**: Created unified color system in `constants/colors.ts` and icon management in `constants/icons.ts`
- **Shared Type Definitions**: Consolidated duplicate interfaces into `types/index.ts`
- **Data Extraction**: Moved hardcoded portfolio data and quiz questions to dedicated data files

### Type Safety & Error Handling
- **Fixed TypeScript Issues**: Removed all `any` types and implemented proper error handling with custom error classes
- **Environment Validation**: Added `lib/env.ts` with proper validation and error handling for API routes
- **Enhanced API Security**: Improved error handling in RAG API route with sanitized error messages

### Developer Experience
- **Standardized Exports**: Converted all components to use named exports consistently
- **Better Maintainability**: Clear separation of concerns with single responsibility components
- **Documentation**: Created comprehensive `CLAUDE.md` for development guidance

## [2025-04-16] Initial Setup & Features
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
