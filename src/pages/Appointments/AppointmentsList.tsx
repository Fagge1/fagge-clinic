import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useConfirm } from '../../components/ConfirmProvider'
import { useToast } from '../../components/ToastProvider'
import { AlertCircle, Check, X, Trash2 } from 'lucide-react'
import { getAppointmentConflicts } from '../../utils/appointmentOverlap'

const AppointmentsList: React.FC = () => {
  const appointments = useStore((s) => s.appointments)
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)
  const removeAppointment = useStore((s) => s.removeAppointment)
  const updateAppointment = useStore((s) => s.updateAppointment)
  const confirm = useConfirm()
  const toast = useToast()

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')

  const conflicts = getAppointmentConflicts(appointments)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return appointments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (!q) return true
      const patient = patients.find((p) => p.id === a.patientId)
      const doctor = doctors.find((d) => d.id === a.doctorId)
      return (
        a.type.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q) ||
        a.dateTime.toLowerCase().includes(q) ||
        patient?.fullName.toLowerCase().includes(q) ||
        doctor?.name.toLowerCase().includes(q)
      )
    })
  }, [appointments, query, statusFilter, patients, doctors])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1">Appointments</h2>
        <p className="text-xs md:text-sm text-gray-600">Manage and track patient appointments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg shadow-md items-stretch sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search appointments..."
            className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Link
            to="/appointments/new"
            className="px-3 py-2 rounded bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition text-center flex-1 sm:flex-none"
          >
            New
          </Link>
          <Link
            to="/appointments/calendar"
            className="px-3 py-2 rounded bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition text-center flex-1 sm:flex-none"
          >
            Calendar
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
          No appointments found.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-50 text-left border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">When</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Patient</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Doctor</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Type</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Duration</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Status</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((a) => {
                  const isConflict = conflicts.some((c) => c.id === a.id)
                  return (
                    <tr key={a.id} className={`hover:bg-gray-50 transition ${isConflict ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3 text-xs md:text-sm">{a.dateTime}</td>
                      <td className="px-4 py-3 text-xs md:text-sm">{patients.find((p) => p.id === a.patientId)?.fullName ?? '-'}</td>
                      <td className="px-4 py-3 text-xs md:text-sm">{doctors.find((d) => d.id === a.doctorId)?.name ?? '-'}</td>
                      <td className="px-4 py-3 text-xs md:text-sm">{a.type}</td>
                      <td className="px-4 py-3 text-xs md:text-sm">{a.durationMinutes} min</td>
                      <td className="px-4 py-3 text-xs md:text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            a.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : a.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm">
                        <div className="flex gap-1 items-center">
                          {isConflict && (
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0" title="Scheduling conflict" />
                          )}
                          <button
                            onClick={() => {
                              updateAppointment(a.id, { status: 'completed' })
                              toast.toast('Appointment marked completed')
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                            title="Complete"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              const ok = await confirm.confirm('Cancel this appointment?')
                              if (!ok) return
                              updateAppointment(a.id, { status: 'cancelled' })
                              toast.toast('Appointment cancelled')
                            }}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded transition"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              const ok = await confirm.confirm('Delete this appointment? This cannot be undone.')
                              if (!ok) return
                              removeAppointment(a.id)
                              toast.toast('Appointment deleted')
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filtered.map((a) => {
              const isConflict = conflicts.some((c) => c.id === a.id)
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg shadow-md border border-gray-200 ${isConflict ? 'bg-red-50 border-red-300' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{a.type}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{a.dateTime}</div>
                    </div>
                    {isConflict && (
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0" title="Scheduling conflict" />
                    )}
                  </div>

                  <div className="space-y-1 mb-3 text-xs text-gray-600">
                    <div><span className="font-medium">Patient:</span> {patients.find((p) => p.id === a.patientId)?.fullName ?? '-'}</div>
                    <div><span className="font-medium">Doctor:</span> {doctors.find((d) => d.id === a.doctorId)?.name ?? '-'}</div>
                    <div><span className="font-medium">Duration:</span> {a.durationMinutes} min</div>
                    {a.reason && <div><span className="font-medium">Reason:</span> {a.reason}</div>}
                  </div>

                  <div className="mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        a.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : a.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateAppointment(a.id, { status: 'completed' })
                        toast.toast('Appointment marked completed')
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded transition flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Complete
                    </button>
                    <button
                      onClick={async () => {
                        const ok = await confirm.confirm('Cancel this appointment?')
                        if (!ok) return
                        updateAppointment(a.id, { status: 'cancelled' })
                        toast.toast('Appointment cancelled')
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded transition flex items-center justify-center gap-1"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={async () => {
                        const ok = await confirm.confirm('Delete this appointment? This cannot be undone.')
                        if (!ok) return
                        removeAppointment(a.id)
                        toast.toast('Appointment deleted')
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default AppointmentsList
