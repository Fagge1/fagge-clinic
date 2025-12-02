import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'

const PatientProfile: React.FC = () => {
  const { id } = useParams()
  const patient = useStore((s) => s.patients.find((p) => p.id === id))
  const appointments = useStore((s) => s.appointments.filter((a) => a.patientId === id))

  if (!patient) return <div className="p-4">Patient not found</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{patient.fullName}</h2>
        <Link to="/patients" className="px-3 py-1 border rounded">Back</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Contact</h3>
          <p>{patient.phone}</p>
          <p>{patient.email}</p>
          <p>{patient.address}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Emergency Contact</h3>
          <p>{patient.emergencyContact?.name}</p>
          <p>{patient.emergencyContact?.phone}</p>
        </div>
      </div>
      <div className="p-4 border rounded mb-4">
        <h3 className="font-semibold mb-2">Medical History</h3>
        <p className="whitespace-pre-wrap">{patient.medicalHistory || 'No medical history.'}</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments for this patient.</p>
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

export default PatientProfile
