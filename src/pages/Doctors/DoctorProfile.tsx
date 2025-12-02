import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const DoctorProfile: React.FC = () => {
  const { id } = useParams()
  const doctor = useStore((s) => s.doctors.find((d) => d.id === id))
  const appointments = useStore((s) => s.appointments.filter((a) => a.doctorId === id))

  if (!doctor) return <div className="p-4">Doctor not found</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Dr. {doctor.name}</h2>
        <Link to="/doctors" className="px-3 py-1 border rounded">Back</Link>
      </div>
      <div className="p-4 border rounded mb-4">
        <h3 className="font-semibold">Specialization</h3>
        <p>{doctor.specialization}</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          <ul>
            {appointments.map((a) => (
              <li key={a.id} className="py-1">{a.dateTime} — {a.type} — {a.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile
