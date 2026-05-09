import React from 'react'
import { cn } from '../../lib/utils'

export function StatusDot({ variant = 'neutral', className }) {
  const variants = {
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]',
    violet: 'bg-violet-vertex',
    neutral: 'bg-text-muted',
  }

  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        variants[variant],
        className
      )}
    />
  )
}
