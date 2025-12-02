import React, { createContext, useContext, useState } from 'react'

type ConfirmContextType = {
  confirm: (message: string) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{ open: boolean; message: string; resolve?: (v: boolean) => void }>({ open: false, message: '' })

  const confirm = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, message, resolve })
    })
  }

  const handle = (v: boolean) => {
    if (state.resolve) state.resolve(v)
    setState({ open: false, message: '' })
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow p-6 w-96">
            <div className="mb-4 font-semibold">Confirm</div>
            <div className="mb-6 text-sm text-gray-700">{state.message}</div>
            <div className="flex justify-end gap-2">
              <button onClick={() => handle(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={() => handle(true)} className="px-3 py-1 bg-red-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider
