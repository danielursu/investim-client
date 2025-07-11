import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Period } from '@/types';

interface DialogState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIState {
  // Navigation
  activeTab: string;
  
  // Period selection for charts and data
  selectedPeriod: Period;
  
  // Dialog management
  dialogs: Record<string, DialogState>;
  
  // Toast notifications
  toasts: ToastState[];
  
  // Loading states for different UI sections
  loadingStates: Record<string, boolean>;
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  
  // Mobile-specific states
  isMobile: boolean;
  bottomNavVisible: boolean;
  
  // Feature flags
  features: Record<string, boolean>;
  
  // Cache control
  lastRefresh: Record<string, Date>;
}

interface UIActions {
  // Navigation
  setActiveTab: (tab: string) => void;
  
  // Period selection
  setSelectedPeriod: (period: Period) => void;
  
  // Dialog management
  openDialog: (dialogId: string, type: string, data?: any) => void;
  closeDialog: (dialogId: string) => void;
  closeAllDialogs: () => void;
  
  // Toast notifications
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (toastId: string) => void;
  clearAllToasts: () => void;
  
  // Loading states
  setLoading: (key: string, loading: boolean) => void;
  clearAllLoading: () => void;
  
  // Theme and preferences
  setTheme: (theme: UIState['theme']) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  
  // Mobile states
  setIsMobile: (mobile: boolean) => void;
  setBottomNavVisible: (visible: boolean) => void;
  
  // Feature flags
  toggleFeature: (feature: string) => void;
  setFeature: (feature: string, enabled: boolean) => void;
  
  // Cache control
  updateLastRefresh: (key: string) => void;
  isStale: (key: string, maxAge: number) => boolean;
  
  // Utility
  resetUI: () => void;
}

type UIStore = UIState & UIActions;

// Initial state
const initialState: UIState = {
  activeTab: 'portfolio',
  selectedPeriod: '3M',
  dialogs: {},
  toasts: [],
  loadingStates: {},
  theme: 'system',
  sidebarCollapsed: false,
  compactMode: false,
  isMobile: false,
  bottomNavVisible: true,
  features: {
    darkMode: true,
    notifications: true,
    beta: false,
    analytics: true,
  },
  lastRefresh: {},
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Navigation
        setActiveTab: (tab) =>
          set(
            (state) => ({
              ...state,
              activeTab: tab,
            }),
            false,
            'setActiveTab'
          ),

        // Period selection
        setSelectedPeriod: (period) =>
          set(
            (state) => ({
              ...state,
              selectedPeriod: period,
            }),
            false,
            'setSelectedPeriod'
          ),

        // Dialog management
        openDialog: (dialogId, type, data) =>
          set(
            (state) => ({
              ...state,
              dialogs: {
                ...state.dialogs,
                [dialogId]: {
                  isOpen: true,
                  type,
                  data,
                },
              },
            }),
            false,
            'openDialog'
          ),

        closeDialog: (dialogId) =>
          set(
            (state) => ({
              ...state,
              dialogs: {
                ...state.dialogs,
                [dialogId]: {
                  ...state.dialogs[dialogId],
                  isOpen: false,
                },
              },
            }),
            false,
            'closeDialog'
          ),

        closeAllDialogs: () =>
          set(
            (state) => {
              const updatedDialogs = Object.keys(state.dialogs).reduce(
                (acc, key) => ({
                  ...acc,
                  [key]: {
                    ...state.dialogs[key],
                    isOpen: false,
                  },
                }),
                {}
              );
              return {
                ...state,
                dialogs: updatedDialogs,
              };
            },
            false,
            'closeAllDialogs'
          ),

        // Toast notifications
        addToast: (toast) =>
          set(
            (state) => {
              const newToast: ToastState = {
                ...toast,
                id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              };
              return {
                ...state,
                toasts: [...state.toasts, newToast],
              };
            },
            false,
            'addToast'
          ),

        removeToast: (toastId) =>
          set(
            (state) => ({
              ...state,
              toasts: state.toasts.filter((toast) => toast.id !== toastId),
            }),
            false,
            'removeToast'
          ),

        clearAllToasts: () =>
          set(
            (state) => ({
              ...state,
              toasts: [],
            }),
            false,
            'clearAllToasts'
          ),

        // Loading states
        setLoading: (key, loading) =>
          set(
            (state) => ({
              ...state,
              loadingStates: {
                ...state.loadingStates,
                [key]: loading,
              },
            }),
            false,
            'setLoading'
          ),

        clearAllLoading: () =>
          set(
            (state) => ({
              ...state,
              loadingStates: {},
            }),
            false,
            'clearAllLoading'
          ),

        // Theme and preferences
        setTheme: (theme) =>
          set(
            (state) => ({
              ...state,
              theme,
            }),
            false,
            'setTheme'
          ),

        setSidebarCollapsed: (collapsed) =>
          set(
            (state) => ({
              ...state,
              sidebarCollapsed: collapsed,
            }),
            false,
            'setSidebarCollapsed'
          ),

        setCompactMode: (compact) =>
          set(
            (state) => ({
              ...state,
              compactMode: compact,
            }),
            false,
            'setCompactMode'
          ),

        // Mobile states
        setIsMobile: (mobile) =>
          set(
            (state) => ({
              ...state,
              isMobile: mobile,
            }),
            false,
            'setIsMobile'
          ),

        setBottomNavVisible: (visible) =>
          set(
            (state) => ({
              ...state,
              bottomNavVisible: visible,
            }),
            false,
            'setBottomNavVisible'
          ),

        // Feature flags
        toggleFeature: (feature) =>
          set(
            (state) => ({
              ...state,
              features: {
                ...state.features,
                [feature]: !state.features[feature],
              },
            }),
            false,
            'toggleFeature'
          ),

        setFeature: (feature, enabled) =>
          set(
            (state) => ({
              ...state,
              features: {
                ...state.features,
                [feature]: enabled,
              },
            }),
            false,
            'setFeature'
          ),

        // Cache control
        updateLastRefresh: (key) =>
          set(
            (state) => ({
              ...state,
              lastRefresh: {
                ...state.lastRefresh,
                [key]: new Date(),
              },
            }),
            false,
            'updateLastRefresh'
          ),

        isStale: (key, maxAge) => {
          const { lastRefresh } = get();
          const lastRefreshTime = lastRefresh[key];
          if (!lastRefreshTime) return true;
          
          const now = new Date();
          const diffMs = now.getTime() - lastRefreshTime.getTime();
          return diffMs > maxAge;
        },

        // Utility
        resetUI: () =>
          set(
            () => ({
              ...initialState,
              // Keep some persistent states
              theme: get().theme,
              features: get().features,
            }),
            false,
            'resetUI'
          ),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          // Persist user preferences but not transient states
          activeTab: state.activeTab,
          selectedPeriod: state.selectedPeriod,
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          compactMode: state.compactMode,
          features: state.features,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

// Selector hooks for better performance
export const useActiveTab = () =>
  useUIStore((state) => state.activeTab);

export const useSelectedPeriod = () =>
  useUIStore((state) => state.selectedPeriod);

export const useDialogs = () =>
  useUIStore((state) => state.dialogs);

export const useDialog = (dialogId: string) =>
  useUIStore((state) => state.dialogs[dialogId] || { isOpen: false, type: null });

export const useToasts = () =>
  useUIStore((state) => state.toasts);

export const useLoadingStates = () =>
  useUIStore((state) => state.loadingStates);

export const useLoading = (key: string) =>
  useUIStore((state) => state.loadingStates[key] || false);

export const useTheme = () =>
  useUIStore((state) => ({
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    compactMode: state.compactMode,
  }));

export const useMobileState = () =>
  useUIStore((state) => ({
    isMobile: state.isMobile,
    bottomNavVisible: state.bottomNavVisible,
  }));

export const useFeatures = () =>
  useUIStore((state) => state.features);

export const useFeature = (feature: string) =>
  useUIStore((state) => state.features[feature] || false);

export const useUIActions = () =>
  useUIStore((state) => ({
    setActiveTab: state.setActiveTab,
    setSelectedPeriod: state.setSelectedPeriod,
    openDialog: state.openDialog,
    closeDialog: state.closeDialog,
    closeAllDialogs: state.closeAllDialogs,
    addToast: state.addToast,
    removeToast: state.removeToast,
    clearAllToasts: state.clearAllToasts,
    setLoading: state.setLoading,
    clearAllLoading: state.clearAllLoading,
    setTheme: state.setTheme,
    setSidebarCollapsed: state.setSidebarCollapsed,
    setCompactMode: state.setCompactMode,
    setIsMobile: state.setIsMobile,
    setBottomNavVisible: state.setBottomNavVisible,
    toggleFeature: state.toggleFeature,
    setFeature: state.setFeature,
    updateLastRefresh: state.updateLastRefresh,
    isStale: state.isStale,
    resetUI: state.resetUI,
  }));