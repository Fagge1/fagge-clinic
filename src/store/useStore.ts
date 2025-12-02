import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Patient, Doctor, Appointment } from '../types'

interface AppState {
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  addPatient: (p: Patient) => void
  addDoctor: (d: Doctor) => void
  addAppointment: (a: Appointment) => void
  updatePatient: (id: string, patch: Partial<Patient>) => void
  removePatient: (id: string) => void
  updateDoctor: (id: string, patch: Partial<Doctor>) => void
  removeDoctor: (id: string) => void
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  removeAppointment: (id: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      patients: [],
      doctors: [],
      appointments: [],
      addPatient: (p: Patient) => set((s) => ({ patients: [p, ...s.patients] })),
      updatePatient: (id: string, patch: Partial<Patient>) => set((s) => ({ patients: s.patients.map((p) => p.id === id ? { ...p, ...patch } : p) })),
      removePatient: (id: string) => set((s) => ({ patients: s.patients.filter((p) => p.id !== id) })),
      addDoctor: (d: Doctor) => set((s) => ({ doctors: [d, ...s.doctors] })),
      updateDoctor: (id: string, patch: Partial<Doctor>) => set((s) => ({ doctors: s.doctors.map((d) => d.id === id ? { ...d, ...patch } : d) })),
      removeDoctor: (id: string) => set((s) => ({ doctors: s.doctors.filter((d) => d.id !== id) })),
      addAppointment: (a: Appointment) => set((s) => ({ appointments: [a, ...s.appointments] })),
      updateAppointment: (id: string, patch: Partial<Appointment>) => set((s) => ({ appointments: s.appointments.map((a) => a.id === id ? { ...a, ...patch } : a) })),
      removeAppointment: (id: string) => set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
    }),
    {
      name: 'clinic-storage',
    },
  ),
)
