import { Appointment } from '../types'
import { parseISO, addMinutes, isBefore, isAfter } from 'date-fns'

export const checkAppointmentOverlap = (
  newAppt: { dateTime: string; durationMinutes: number; doctorId: string },
  existingAppointments: Appointment[]
) => {
  const newStart = parseISO(newAppt.dateTime)
  const newEnd = addMinutes(newStart, newAppt.durationMinutes)

  return existingAppointments
    .filter((a) => a.doctorId === newAppt.doctorId && a.status !== 'cancelled')
    .filter((a) => {
      const existingStart = parseISO(a.dateTime)
      const existingEnd = addMinutes(existingStart, a.durationMinutes)

      // Check if intervals overlap
      return isBefore(newStart, existingEnd) && isAfter(newEnd, existingStart)
    })
}

export const getAppointmentConflicts = (appointments: Appointment[]) => {
  const conflicts: Appointment[] = []
  for (let i = 0; i < appointments.length; i++) {
    for (let j = i + 1; j < appointments.length; j++) {
      const a = appointments[i]
      const b = appointments[j]

      if (a.doctorId !== b.doctorId || a.status === 'cancelled' || b.status === 'cancelled') continue

      const aStart = parseISO(a.dateTime)
      const aEnd = addMinutes(aStart, a.durationMinutes)
      const bStart = parseISO(b.dateTime)
      const bEnd = addMinutes(bStart, b.durationMinutes)

      if (isBefore(aStart, bEnd) && isAfter(aEnd, bStart)) {
        if (!conflicts.find((c) => c.id === a.id)) conflicts.push(a)
        if (!conflicts.find((c) => c.id === b.id)) conflicts.push(b)
      }
    }
  }
  return conflicts
}
