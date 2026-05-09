'use client'

import React from 'react'
import { useMode } from '../providers/ModeProvider'

export function Logo({ height = 24, className }) {
  const { isAether } = useMode()

  return (
    <img
      src={isAether ? '/logo/tesseract-mark-white.svg' : '/logo/tesseract-mark.svg'}
      alt="Tesseract Vertex"
      style={{ height: `${height}px`, width: 'auto' }}
      className={className}
    />
  )
}
