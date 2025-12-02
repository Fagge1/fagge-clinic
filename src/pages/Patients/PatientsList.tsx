import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useConfirm } from '../../components/ConfirmProvider'
import { useToast } from '../../components/ToastProvider'
import { Trash2, Eye } from 'lucide-react'

const PatientsList: React.FC = () => {
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)
  const removePatient = useStore((s) => s.removePatient)
  const confirm = useConfirm()
  const toast = useToast()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return patients
    return patients.filter((p) => p.fullName.toLowerCase().includes(q) || p.phone.includes(q) || p.email.toLowerCase().includes(q))
  }, [patients, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-teal-700">Patients</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Link
            to="/patients/new"
            className="px-4 py-2 rounded bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition text-center"
          >
            New Patient
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
          No patients found.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Name</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Phone</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Email</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Assigned Doctor</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/patients/${p.id}`} className="text-teal-600 font-medium hover:underline">
                        {p.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {doctors.find((d) => d.id === p.assignedDoctorId)?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Link
                          to={`/patients/${p.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={async () => {
                            const ok = await confirm.confirm('Delete this patient? This action cannot be undone.')
                            if (!ok) return
                            removePatient(p.id)
                            toast.toast('Patient deleted')
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Link to={`/patients/${p.id}`} className="text-teal-600 font-semibold hover:underline text-sm flex-1">
                    {p.fullName}
                  </Link>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      to={`/patients/${p.id}`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={async () => {
                        const ok = await confirm.confirm('Delete this patient? This action cannot be undone.')
                        if (!ok) return
                        removePatient(p.id)
                        toast.toast('Patient deleted')
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><span className="font-medium">Phone:</span> {p.phone}</div>
                  <div><span className="font-medium">Email:</span> {p.email}</div>
                  <div>
                    <span className="font-medium">Doctor:</span> {doctors.find((d) => d.id === p.assignedDoctorId)?.name ?? '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PatientsList
