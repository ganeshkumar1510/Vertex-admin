import React from 'react'
import { cn } from '../../lib/utils'

export function Card({ variant = 'base', className, ...props }) {
  const variants = {
    base: 'bg-surface-raised border-border-default',
    elevated: 'bg-surface-elevated border-border-strong',
    selected: 'bg-surface-elevated border-2 border-border-active',
    overlay: 'bg-surface-overlay border-border-active',
    stat: 'bg-surface-raised border-border-default',
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-lg transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 mb-md', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('font-display text-h3 font-semibold text-text-primary leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('', className)} {...props} />
}
