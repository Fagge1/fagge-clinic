import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { useConfirm } from '../../components/ConfirmProvider'
import { useToast } from '../../components/ToastProvider'
import { Trash2, Eye } from 'lucide-react'

const DoctorsList: React.FC = () => {
  const doctors = useStore((s) => s.doctors)
  const removeDoctor = useStore((s) => s.removeDoctor)
  const confirm = useConfirm()
  const toast = useToast()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-teal-700">Doctors</h2>
        <Link
          to="/doctors/new"
          className="px-4 py-2 rounded bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition text-center"
        >
          Add Doctor
        </Link>
      </div>

      {doctors.length === 0 ? (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
          No doctors yet.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-teal-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Name</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Specialization</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Phone</th>
                  <th className="px-4 py-3 text-xs md:text-sm font-semibold text-teal-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm">
                      <Link to={`/doctors/${d.id}`} className="text-teal-600 font-medium hover:underline">
                        {d.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.specialization}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{d.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Link
                          to={`/doctors/${d.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={async () => {
                            const ok = await confirm.confirm('Delete this doctor? This will remove their upcoming appointments.')
                            if (!ok) return
                            removeDoctor(d.id)
                            toast.toast('Doctor deleted')
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
            {doctors.map((d) => (
              <div key={d.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Link to={`/doctors/${d.id}`} className="text-teal-600 font-semibold hover:underline text-sm flex-1">
                    {d.name}
                  </Link>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      to={`/doctors/${d.id}`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={async () => {
                        const ok = await confirm.confirm('Delete this doctor? This will remove their upcoming appointments.')
                        if (!ok) return
                        removeDoctor(d.id)
                        toast.toast('Doctor deleted')
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><span className="font-medium">Specialization:</span> {d.specialization}</div>
                  <div><span className="font-medium">Phone:</span> {d.phone}</div>
                  <div><span className="font-medium">Email:</span> {d.email}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default DoctorsList
