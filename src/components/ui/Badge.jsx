import React from 'react'
import { cn } from '../../lib/utils'

export function Badge({ variant = 'neutral', className, ...props }) {
  const variants = {
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]',
    error: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)]',
    violet: 'bg-[rgba(124,58,237,0.15)] text-violet-aether',
    neutral: 'bg-surface-elevated text-text-muted border border-border-subtle',
    purple: 'bg-[rgba(124,58,237,0.15)] text-violet-aether',
    green: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]',
    amber: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]',
    gray: 'bg-surface-elevated text-text-muted border border-border-subtle',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-tight',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
