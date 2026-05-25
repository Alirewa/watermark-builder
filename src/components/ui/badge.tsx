// Developed by @Alirewa — https://github.com/Alirewa
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        destructive: 'bg-destructive/15 text-destructive border border-destructive/20',
        success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
        outline: 'border border-border text-foreground',
        glass: 'glass text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
