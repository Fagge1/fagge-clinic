import React from 'react'
import { Plus } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="w-full border-b p-3 md:p-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="text-lg md:text-xl font-bold text-teal-700">Clinic Management</h1>
      </div>
    </header>
  )
}

export default Header
