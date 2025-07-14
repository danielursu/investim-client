// Color constants for the application
export const COLORS = {
  // Primary brand colors
  PRIMARY: '#079669',
  PRIMARY_HOVER: '#067d5a',
  PRIMARY_DARK: '#065f4e',
  
  // Emerald variations
  EMERALD_50: '#ecfdf5',
  EMERALD_100: '#d1fae5',
  EMERALD_500: '#10b981',
  EMERALD_600: '#059669',
  EMERALD_700: '#047857',
  
  // Chart colors for asset allocation
  CHART: {
    STOCKS: '#10b981',      // Green
    BONDS: '#3b82f6',       // Blue  
    REAL_ESTATE: '#f59e0b', // Amber
    ALTERNATIVES: '#8b5cf6', // Purple
    GOLD: '#f59e0b',        // Amber/Gold
    COMMODITIES: '#ef4444', // Red
  },
  
  // Performance indicators
  POSITIVE: '#059669',  // Emerald-600 for gains (better contrast)
  POSITIVE_LIGHT: '#10b981',  // Emerald-500 for lighter contexts
  NEGATIVE: '#dc2626',  // Red-600 for losses (better contrast)
  NEGATIVE_LIGHT: '#ef4444',  // Red-500 for lighter contexts
  NEUTRAL: '#6b7280',   // Gray-500 for neutral
  
  // UI colors
  BACKGROUND: '#f9fafb',  // Gray-50
  SURFACE: '#ffffff',     // White
  BORDER: '#e5e7eb',      // Gray-200
  TEXT_PRIMARY: '#111827', // Gray-900
  TEXT_SECONDARY: '#6b7280', // Gray-500
  
  // Status colors
  SUCCESS: '#10b981',
  WARNING: '#f59e0b', 
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

// Fallback colors for charts when no specific color is provided
export const CHART_FALLBACK_COLORS = [
  '#0088FE', 
  '#00C49F', 
  '#FFBB28', 
  '#FF8042', 
  '#8884D8', 
  '#82ca9d'
] as const;