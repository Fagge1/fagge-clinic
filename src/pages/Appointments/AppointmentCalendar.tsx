import React from 'react'
import { addDays, formatISO, parseISO, format } from 'date-fns'
import { useStore } from '../../store/useStore'

const AppointmentCalendar: React.FC = () => {
  const appointments = useStore((s) => s.appointments)

  // show next 7 days
  const days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i))

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold text-teal-700 mb-4 md:mb-6">7-Day Calendar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-3">
        {days.map((d) => {
          const dayIso = formatISO(d, { representation: 'date' })
          const dayAppts = appointments.filter((a) => a.dateTime.startsWith(dayIso))
          return (
            <div key={dayIso} className="p-3 md:p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md transition">
              <div className="font-semibold text-xs md:text-sm text-teal-700 mb-2">{format(d, 'EEE dd')}</div>
              {dayAppts.length === 0 ? (
                <div className="text-xs text-gray-500">No appointments</div>
              ) : (
                <ul className="space-y-1">
                  {dayAppts.map((a) => (
                    <li key={a.id} className="text-xs md:text-sm py-0.5 px-1 bg-teal-50 text-teal-700 rounded truncate" title={`${format(parseISO(a.dateTime), 'HH:mm')} — ${a.type}`}>
                      {format(parseISO(a.dateTime), 'HH:mm')} — {a.type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AppointmentCalendar
