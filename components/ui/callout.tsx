import React from 'react';
import { AlertCircle, Info, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutStyles: Record<CalloutType, {
  container: string;
  icon: React.ReactNode;
  iconColor: string;
}> = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: <Info className="h-4 w-4" />,
    iconColor: 'text-blue-600',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: <AlertCircle className="h-4 w-4" />,
    iconColor: 'text-amber-600',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle className="h-4 w-4" />,
    iconColor: 'text-emerald-600',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: <XCircle className="h-4 w-4" />,
    iconColor: 'text-red-600',
  },
  tip: {
    container: 'bg-purple-50 border-purple-200',
    icon: <Lightbulb className="h-4 w-4" />,
    iconColor: 'text-purple-600',
  },
};

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const styles = calloutStyles[type];
  
  return (
    <div className={cn(
      'rounded-lg border p-4 my-3',
      styles.container,
      className
    )}>
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconColor)}>
          {styles.icon}
        </div>
        <div className="flex-1 space-y-1">
          {title && (
            <h4 className={cn('text-sm font-medium', styles.iconColor)}>
              {title}
            </h4>
          )}
          <div className="text-sm text-gray-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}