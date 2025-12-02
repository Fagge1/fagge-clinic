import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, Calendar, Stethoscope } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded transition-colors ${
      isActive ? 'bg-teal-100 text-teal-800 font-semibold' : 'text-gray-700 hover:bg-gray-100'
    }`

  const handleNavClick = () => onClose?.()

  return (
    <aside className="w-full h-full border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-teal-700">Fagge Clinic</h2>
      </div>
      <nav className="flex-1 overflow-y-auto flex flex-col gap-1 p-4">
        <NavLink to="/" end className={linkClass} onClick={handleNavClick}>
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/patients" className={linkClass} onClick={handleNavClick}>
          <Users size={18} />
          <span>Patients</span>
        </NavLink>
        <NavLink to="/appointments" className={linkClass} onClick={handleNavClick}>
          <Calendar size={18} />
          <span>Appointments</span>
        </NavLink>
        <NavLink to="/doctors" className={linkClass} onClick={handleNavClick}>
          <Stethoscope size={18} />
          <span>Doctors</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
