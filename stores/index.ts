// Central export for all Zustand stores
export * from './portfolioStore';
export * from './goalsStore';
export * from './chatStore';
export * from './uiStore';

// Re-export commonly used types
export type { Period } from '@/types';
export type { GoalWithProgress } from '@/components/GoalManager';
export type { ChatMessage } from '@/types';