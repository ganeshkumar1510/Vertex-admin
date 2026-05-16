'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

const ModeContext = createContext({
  mode: 'quasar',
  isAether: false,
  toggle: () => {},
  setMode: () => {},
})

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState('quasar')

  useEffect(() => {
    const saved = localStorage.getItem('vertex-mode')
    if (saved === 'aether' || saved === 'quasar') {
      setModeState(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.className = mode
    localStorage.setItem('vertex-mode', mode)
  }, [mode])

  const toggle = () => setModeState(m => (m === 'aether' ? 'quasar' : 'aether'))
  const setMode = (m) => setModeState(m)

  return (
    <ModeContext.Provider value={{ mode, isAether: mode === 'aether', toggle, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export const useMode = () => useContext(ModeContext)
