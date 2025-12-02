import React from 'react'
import { useStore } from '../store/useStore'
import { exportPatientsToCSV, exportAppointmentsToCSV, downloadCSV } from '../utils/csvExport'
import { Download, Upload } from 'lucide-react'

const DataManagement: React.FC = () => {
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)
  const appointments = useStore((s) => s.appointments)

  const handleExportPatients = () => {
    const csv = exportPatientsToCSV(patients, doctors)
    downloadCSV(csv, `patients_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const handleExportAppointments = () => {
    const csv = exportAppointmentsToCSV(appointments, patients, doctors)
    downloadCSV(csv, `appointments_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-teal-700">Data Management</div>
      <div className="flex gap-4">
        <button
          onClick={handleExportPatients}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          <Download size={16} />
          Export Patients (CSV)
        </button>
        <button
          onClick={handleExportAppointments}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          <Download size={16} />
          Export Appointments (CSV)
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Total: {patients.length} patients, {appointments.length} appointments
      </div>
    </div>
  )
}

export default DataManagement
