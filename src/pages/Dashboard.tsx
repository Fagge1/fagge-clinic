import React from 'react'
import { useStore } from '../store/useStore'
import DataManagement from '../components/DataManagement'

const Dashboard: React.FC = () => {
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)
  const appointments = useStore((s) => s.appointments)

  const today = new Date().toISOString().slice(0, 10)
  const todaysAppointments = appointments.filter((a) => a.dateTime.startsWith(today) && a.status === 'scheduled')
  const pending = appointments.filter((a) => a.status === 'scheduled')
  const completed = appointments.filter((a) => a.status === 'completed')

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1">Dashboard</h2>
        <p className="text-sm md:text-base text-gray-600">Welcome to your clinic management system</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-teal-600">
          <p className="text-gray-600 text-xs md:text-sm">Total Patients</p>
          <p className="text-2xl md:text-3xl font-bold text-teal-700">{patients.length}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-gray-600 text-xs md:text-sm">Total Doctors</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{doctors.length}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-600 text-xs md:text-sm">Today's Appointments</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{todaysAppointments.length}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-amber-500">
          <p className="text-gray-600 text-xs md:text-sm">Pending</p>
          <p className="text-2xl md:text-3xl font-bold text-amber-600">{pending.length}</p>
        </div>
      </div>

      {/* Recent Activity & Data Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-teal-700 mb-4">Recent Appointments</h3>
          {appointments.slice(0, 5).length === 0 ? (
            <p className="text-xs md:text-sm text-gray-500">No appointments scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {appointments.slice(0, 5).map((a) => (
                <li key={a.id} className="text-xs md:text-sm py-2 border-b pb-2">
                  <div className="font-medium text-gray-800">{a.type}</div>
                  <div className="text-gray-600 text-xs">{a.dateTime} — {a.durationMinutes} min</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <DataManagement />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-teal-700 mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <p className="text-gray-600 text-xs md:text-sm">Completed</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{completed.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs md:text-sm">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-amber-600">{pending.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs md:text-sm">Total</p>
            <p className="text-xl md:text-2xl font-bold text-teal-600">{appointments.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
