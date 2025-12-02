import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '../../store/useStore'
import { Appointment } from '../../types'
import { formatISO } from 'date-fns'
import { checkAppointmentOverlap } from '../../utils/appointmentOverlap'
import { useToast } from '../../components/ToastProvider'
import { AlertCircle } from 'lucide-react'

type FormValues = {
  patientId: string
  doctorId: string
  date: string
  time: string
  durationMinutes: number
  type: string
  reason: string
}

const AppointmentForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)
  const appointments = useStore((s) => s.appointments)
  const addAppointment = useStore((s) => s.addAppointment)
  const navigate = useNavigate()
  const toast = useToast()
  const [conflictMessage, setConflictMessage] = useState('')

  const onSubmit = (data: FormValues) => {
    const dateTime = formatISO(new Date(`${data.date}T${data.time}`))
    const durationMinutes = parseInt(String(data.durationMinutes), 10)

    // Check for overlaps using interval detection
    const overlaps = checkAppointmentOverlap(
      { dateTime, durationMinutes, doctorId: data.doctorId },
      appointments
    )

    if (overlaps.length > 0) {
      const conflictTimes = overlaps.map((a) => a.dateTime).join(', ')
      setConflictMessage(`Doctor has conflicting appointments at: ${conflictTimes}`)
      return
    }

    const newAppt: Appointment = {
      id: uuidv4(),
      patientId: data.patientId,
      doctorId: data.doctorId,
      dateTime,
      durationMinutes,
      type: data.type,
      reason: data.reason,
      status: 'scheduled',
    }

    addAppointment(newAppt)
    toast.toast('Appointment scheduled successfully')
    navigate('/appointments')
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-4 md:mb-6">Schedule Appointment</h2>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Patient *</label>
              <select
                {...register('patientId', { required: 'Patient is required' })}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.fullName}</option>
                ))}
              </select>
              {errors.patientId && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.patientId.message}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Doctor *</label>
              <select
                {...register('doctorId', { required: 'Doctor is required' })}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
                ))}
              </select>
              {errors.doctorId && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.doctorId.message}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.date && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.date.message}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                {...register('time', { required: 'Time is required' })}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.time && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.time.message}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Duration (minutes) *</label>
              <input
                type="number"
                defaultValue="30"
                {...register('durationMinutes', { required: 'Duration is required', min: { value: 15, message: 'Minimum 15 minutes' } })}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.durationMinutes && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.durationMinutes.message}</span>}
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Type *</label>
              <input
                type="text"
                {...register('type', { required: 'Type is required' })}
                placeholder="e.g., Checkup"
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.type && <span className="text-xs md:text-sm text-red-500 mt-1 block">{errors.type.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1">Reason</label>
            <textarea
              {...register('reason')}
              placeholder="Additional notes..."
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
          </div>

          {conflictMessage && (
            <div className="p-3 md:p-4 bg-red-50 border border-red-300 text-red-700 rounded flex gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm">{conflictMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 transition"
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentForm
