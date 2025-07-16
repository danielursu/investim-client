# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Testing
- **No Testing Framework**: Currently no test setup exists in this project
- **No Test Commands**: Project lacks Jest/Vitest configuration and test scripts

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
- **Color System**: Centralized colors defined in `/constants/colors.ts`

## Key Files and Patterns

### Environment Configuration
- **Environment Validation**: `/lib/env.ts` handles validation of required environment variables
- **Required Variables**: `FASTAPI_RAG_URL` (defaults to `http://127.0.0.1:8000/query`)
- **Validation**: Environment variables are validated at request time in API routes

### Data Management
- **Static Data**: Mock data and configurations stored in `/data/` directory
- **Type Definitions**: Centralized in `/types/index.ts` with comprehensive TypeScript interfaces
- **Constants**: Colors, icons, and other constants in `/constants/` directory

### Component Structure
- **UI Components**: shadcn/ui components in `/components/ui/` (auto-generated, avoid manual edits)
- **Feature Components**: Application-specific components in `/components/`
- **Dashboard Components**: Organized in `/components/Dashboard/` with barrel exports via `index.ts`

## Deployment
- **Netlify**: Configured for deployment with `netlify.toml`
- **Node Version**: Uses Node.js 20 in production
- **Static Generation**: Next.js static site generation for optimal performance
- **Build Configuration**: Uses Next.js 15 with experimental features enabled for performance

---

# 🤖 Claude Code Best Practices (Solo Development)

## Daily Development Commands

### Before Starting Work
```bash
# Quick health check (30 seconds)
npm run lint && npm run build

# Check bundle size
npm run build:analyze

# Clean up build artifacts
rm -rf .next/ .netlify/ coverage/ logs/
```

### Before Committing
```bash
# Essential quality checks
npm run lint --fix          # Fix linting issues
npm run build               # Ensure build works
npm run test:ci             # Run tests if available

# Quick cleanup
find . -name ".DS_Store" -delete
```

## Weekly Maintenance (5 minutes)

### Monday Health Check
```bash
# Check for security vulnerabilities
npm audit --audit-level=moderate

# Update patch versions only (safe)
npm update --save-dev

# Check for unused dependencies
npx depcheck --ignores="@types/*,eslint-*"

# Repository size check
du -sh . && git gc --prune=now
```

## Monthly Deep Maintenance (15 minutes)

### Dependency Management
```bash
# Check outdated packages
npm outdated

# Update development dependencies
npm update --save-dev

# Clean reinstall (if issues)
rm -rf node_modules package-lock.json && npm install
```

### Performance Monitoring
```bash
# Bundle analysis
npm run build:analyze

# Check build performance
time npm run build

# Lighthouse audit (if available)
npx lighthouse-ci --upload.target=filesystem
```

## Quality Gates

### Pre-Push Checklist
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Bundle size < 800KB
- [ ] No console.log in production files
- [ ] No .DS_Store files committed

### Performance Budgets
- **Bundle Size**: Keep under 800KB total
- **Build Time**: Should be under 30 seconds
- **Dependencies**: Review if >100 packages
- **Repository Size**: Keep under 50MB

## Quick Fixes

### Common Issues
```bash
# Fix TypeScript errors
npx tsc --noEmit

# Fix import issues
npm run lint -- --fix

# Clear Next.js cache
rm -rf .next/

# Reset dependencies
rm -rf node_modules && npm install
```

### Performance Issues
```bash
# Check large files
find . -size +1M -type f -not -path "./node_modules/*"

# Analyze bundle
npm run build:analyze

# Check for unused code
npx depcheck
```

## Emergency Procedures

### Rollback Process
```bash
# Revert last commit
git reset --hard HEAD~1

# Clean workspace
rm -rf .next/ node_modules/
npm install && npm run build
```

### Quick Debug Commands
```bash
# Check environment
echo $NODE_ENV
cat .env.local

# Verify API connectivity
curl -I $FASTAPI_RAG_URL/health || echo "API down"

# Check port conflicts
lsof -i :3000
```

## Development Workflow with Claude Code

### Session-Based Development
1. **Start Session**: Run health check commands
2. **Development**: Use Claude Code for features/fixes
3. **Pre-Commit**: Run quality checks
4. **End Session**: Clean up artifacts

### Code Quality Automation
```bash
# Add to package.json scripts for convenience
"health": "npm run lint && npm run build",
"cleanup": "rm -rf .next/ .netlify/ coverage/ logs/ && find . -name '.DS_Store' -delete",
"audit": "npm audit --audit-level=moderate && npx depcheck"
```

### Claude Code Optimization Tips
- Always run `npm run lint` before asking Claude to fix issues
- Use `npm run build:analyze` to check bundle impact of changes
- Keep sessions focused on single features/fixes
- Document architectural decisions in session notes

## Architecture Decision Guidelines

### When to Add Dependencies
- **Bundle impact**: Check size with `npm run build:analyze`
- **Maintenance burden**: Prefer established, well-maintained packages
- **Alternative**: Consider if feature can be built in-house
- **Security**: Run `npm audit` after adding

### Code Organization Rules
- Keep components under 150 lines
- Use TypeScript for all new code
- Prefer composition over inheritance
- Keep business logic separate from UI components

### Performance Considerations
- Lazy load heavy components
- Use React.memo() for expensive renders
- Monitor bundle size after changes
- Optimize images and assets

## Security Checklist

### Environment Security
- [ ] No secrets in .env files committed
- [ ] Use .env.local for local development
- [ ] Validate all environment variables
- [ ] Use HTTPS in production

### Code Security
- [ ] Sanitize user inputs (DOMPurify)
- [ ] No eval() or dangerous functions
- [ ] Validate API responses
- [ ] Use TypeScript for type safety