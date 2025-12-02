import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { parse, startOfWeek, getDay, format, addMinutes } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useStore } from '../../store/useStore'
import { getAppointmentConflicts } from '../../utils/appointmentOverlap'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
})

const BigCalendarView: React.FC = () => {
  const appointments = useStore((s) => s.appointments)
  const patients = useStore((s) => s.patients)
  const doctors = useStore((s) => s.doctors)

  const conflicts = getAppointmentConflicts(appointments)

  const events = appointments.map((a) => {
    const isConflict = conflicts.some((c) => c.id === a.id)
    const patient = patients.find((p) => p.id === a.patientId)
    const doctor = doctors.find((d) => d.id === a.doctorId)
    
    return {
      id: a.id,
      title: `${a.type} (${patient?.fullName || 'Unknown'})`,
      start: new Date(a.dateTime),
      end: addMinutes(new Date(a.dateTime), a.durationMinutes || 30),
      resource: { isConflict, doctor: doctor?.name, status: a.status },
    }
  })

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#0d9488' // teal-600 (primary)
    
    if (event.resource?.isConflict) {
      backgroundColor = '#ef4444' // red for conflicts
    } else if (event.resource?.status === 'completed') {
      backgroundColor = '#10b981' // green for completed
    } else if (event.resource?.status === 'cancelled') {
      backgroundColor = '#6b7280' // gray for cancelled
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-2">Appointment Calendar</h2>
        <p className="text-xs md:text-sm text-gray-600">Red appointments indicate scheduling conflicts</p>
      </div>
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}>
        <Calendar 
          localizer={localizer} 
          events={events} 
          startAccessor="start" 
          endAccessor="end" 
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  )
}

export default BigCalendarView
