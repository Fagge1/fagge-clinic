export type Gender = 'male' | 'female' | 'other'

export interface Patient {
  id: string
  fullName: string
  dateOfBirth: string
  gender: Gender
  phone: string
  email: string
  address: string
  emergencyContact: { name: string; phone: string }
  assignedDoctorId?: string
  medicalHistory: string
  createdAt: string
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  dateTime: string
  durationMinutes: number
  type: string
  reason: string
  status: AppointmentStatus
  notes?: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  date: string
  diagnosis: string
  prescription: string
  notes: string
}

export const medicalTheme = {
  primary: '#0d9488',
  primaryLight: '#14b8a6',
  primaryDark: '#0f766e',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
}
