import React, { createContext, useContext, useState } from 'react'

type Toast = { id: string; message: string }

type ToastContextType = { toast: (message: string) => void }

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (message: string) => {
    const id = String(Date.now())
    setToasts((s) => [...s, { id, message }])
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 4000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
