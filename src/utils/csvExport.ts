import { Patient, Appointment, Doctor } from '../types'

export const exportPatientsToCSV = (patients: Patient[], doctors: Doctor[]) => {
  const headers = ['ID', 'Full Name', 'DOB', 'Gender', 'Phone', 'Email', 'Address', 'Emergency Contact', 'Assigned Doctor', 'Medical History']
  const rows = patients.map((p) => [
    p.id,
    p.fullName,
    p.dateOfBirth,
    p.gender,
    p.phone,
    p.email,
    p.address,
    `${p.emergencyContact?.name || ''} (${p.emergencyContact?.phone || ''})`,
    doctors.find((d) => d.id === p.assignedDoctorId)?.name || '-',
    p.medicalHistory,
  ])
  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export const exportAppointmentsToCSV = (appointments: Appointment[], patients: Patient[], doctors: Doctor[]) => {
  const headers = ['ID', 'Patient', 'Doctor', 'Date & Time', 'Duration (min)', 'Type', 'Reason', 'Status', 'Notes']
  const rows = appointments.map((a) => [
    a.id,
    patients.find((p) => p.id === a.patientId)?.fullName || '-',
    doctors.find((d) => d.id === a.doctorId)?.name || '-',
    a.dateTime,
    a.durationMinutes,
    a.type,
    a.reason,
    a.status,
    a.notes || '',
  ])
  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
