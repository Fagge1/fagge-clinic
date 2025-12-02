import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PatientsList from './pages/Patients/PatientsList'
import PatientForm from './pages/Patients/PatientForm'
import PatientProfile from './pages/Patients/PatientProfile'
import DoctorsList from './pages/Doctors/DoctorsList'
import DoctorForm from './pages/Doctors/DoctorForm'
import DoctorProfile from './pages/Doctors/DoctorProfile'
import AppointmentsList from './pages/Appointments/AppointmentsList'
import AppointmentForm from './pages/Appointments/AppointmentForm'
import AppointmentCalendar from './pages/Appointments/AppointmentCalendar'
import BigCalendarView from './pages/Appointments/BigCalendar'
import NotFound from './pages/NotFound'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients">
          <Route index element={<PatientsList />} />
          <Route path="new" element={<PatientForm />} />
          <Route path=":id" element={<PatientProfile />} />
        </Route>
        <Route path="appointments">
          <Route index element={<AppointmentsList />} />
          <Route path="new" element={<AppointmentForm />} />
          <Route path="calendar" element={<BigCalendarView />} />
        </Route>
        <Route path="doctors">
          <Route index element={<DoctorsList />} />
          <Route path="new" element={<DoctorForm />} />
          <Route path=":id" element={<DoctorProfile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      </Routes>
    </div>
  )
}

export default App
