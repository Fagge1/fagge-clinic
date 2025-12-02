# API Reference & Features Documentation

## Table of Contents
1. [Store API](#store-api)
2. [Utility Functions](#utility-functions)
3. [Hooks API](#hooks-api)
4. [Components API](#components-api)
5. [Type Definitions](#type-definitions)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

## Store API

### useStore() - Global Store Hook

**Location:** `src/store/useStore.ts`

#### Overview
Zustand-based global state management with localStorage persistence.

#### State Properties

```typescript
// Current state of the application
const patients = useStore((state) => state.patients)      // Patient[]
const doctors = useStore((state) => state.doctors)        // Doctor[]
const appointments = useStore((state) => state.appointments) // Appointment[]
```

#### Patient Actions

**addPatient(patient: Patient): void**
- Creates a new patient
- Stores in state and localStorage
- Patient must have unique UUID
- Returns immediately (synchronous)

```typescript
const addPatient = useStore((s) => s.addPatient)

addPatient({
  id: uuidv4(),
  fullName: 'John Doe',
  dateOfBirth: '1990-05-15',
  gender: 'Male',
  phone: '555-0123',
  email: 'john@example.com',
  address: '123 Main St',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '555-0124'
  },
  medicalHistory: 'Hypertension',
  assignedDoctorId: 'doc-123',
  createdAt: new Date().toISOString()
})
```

**updatePatient(id: string, updates: Partial<Patient>): void**
- Updates existing patient fields
- Only specified fields are updated (partial update)
- Merges with existing data

```typescript
const updatePatient = useStore((s) => s.updatePatient)

updatePatient('patient-uuid-123', {
  phone: '555-9999',
  assignedDoctorId: 'doc-456'
})
// Other fields remain unchanged
```

**removePatient(id: string): void**
- Deletes patient from store
- Removes from localStorage
- Does not cascade delete appointments

```typescript
const removePatient = useStore((s) => s.removePatient)

removePatient('patient-uuid-123')
```

#### Doctor Actions

**addDoctor(doctor: Doctor): void**
```typescript
const addDoctor = useStore((s) => s.addDoctor)

addDoctor({
  id: uuidv4(),
  name: 'Dr. Smith',
  specialization: 'Cardiology',
  phone: '555-0200',
  email: 'smith@clinic.com'
})
```

**updateDoctor(id: string, updates: Partial<Doctor>): void**
```typescript
const updateDoctor = useStore((s) => s.updateDoctor)

updateDoctor('doc-uuid', {
  specialization: 'Pediatrics',
  phone: '555-0201'
})
```

**removeDoctor(id: string): void**
```typescript
const removeDoctor = useStore((s) => s.removeDoctor)

removeDoctor('doc-uuid')
```

#### Appointment Actions

**addAppointment(appointment: Appointment): void**
```typescript
const addAppointment = useStore((s) => s.addAppointment)

addAppointment({
  id: uuidv4(),
  patientId: 'patient-uuid',
  doctorId: 'doctor-uuid',
  dateTime: '2024-12-02T14:00:00Z',
  durationMinutes: 30,
  type: 'Checkup',
  reason: 'Annual physical',
  status: 'scheduled'
})
```

**updateAppointment(id: string, updates: Partial<Appointment>): void**
```typescript
const updateAppointment = useStore((s) => s.updateAppointment)

// Mark as completed
updateAppointment('appt-uuid', {
  status: 'completed'
})

// Cancel appointment
updateAppointment('appt-uuid', {
  status: 'cancelled'
})
```

**removeAppointment(id: string): void**
```typescript
const removeAppointment = useStore((s) => s.removeAppointment)

removeAppointment('appt-uuid')
```

### Store Persistence

**Automatic Features:**
- All state changes automatically saved to localStorage
- Key: `clinic-storage`
- Format: JSON
- Loaded on app startup

**Manual Access to localStorage:**
```typescript
// Get stored data
const stored = localStorage.getItem('clinic-storage')
const data = JSON.parse(stored)
console.log(data.state)

// Clear data (reset application)
localStorage.removeItem('clinic-storage')
// Refresh page to restart
```

## Utility Functions

### appointmentOverlap.ts

#### checkAppointmentOverlap()

**Signature:**
```typescript
function checkAppointmentOverlap(
  newAppt: {
    dateTime: string
    durationMinutes: number
    doctorId: string
  },
  existingAppointments: Appointment[]
): Appointment[]
```

**Description:**
- Checks if new appointment conflicts with existing appointments
- Uses interval arithmetic (start + duration)
- Only checks appointments for same doctor
- Returns array of conflicting appointments

**Example:**
```typescript
import { checkAppointmentOverlap } from '../utils/appointmentOverlap'

const newAppt = {
  dateTime: '2024-12-02T14:00:00Z',
  durationMinutes: 30,
  doctorId: 'doc-123'
}

const conflicts = checkAppointmentOverlap(newAppt, appointments)

if (conflicts.length > 0) {
  console.log('Conflicts found:')
  conflicts.forEach(appt => {
    console.log(`${appt.dateTime} (${appt.durationMinutes} min)`)
  })
} else {
  console.log('No conflicts!')
}
```

**Logic:**
```
Existing: [14:00 - 14:30]  (30 min duration)
New:      [14:15 - 14:45]  (30 min duration)
          ↑ Start falls within existing time
Conflict? YES

Existing: [14:00 - 14:30]
New:      [14:30 - 15:00]  (starts exactly when existing ends)
Conflict? NO (ends are aligned)

Existing: [14:00 - 14:30]
New:      [13:00 - 13:30]  (completely before)
Conflict? NO
```

#### getAppointmentConflicts()

**Signature:**
```typescript
function getAppointmentConflicts(appointments: Appointment[]): Appointment[]
```

**Description:**
- Finds all appointments that have scheduling conflicts
- Returns array of appointment objects (not IDs)
- Identifies ALL appointments involved in conflicts
- Used for visual highlighting

**Example:**
```typescript
import { getAppointmentConflicts } from '../utils/appointmentOverlap'

const conflicts = getAppointmentConflicts(appointments)
// Returns: all appointments that overlap with others

// Usage in AppointmentsList
conflicts.forEach(appt => {
  // Highlight these appointments in red
})
```

**Algorithm:**
```
1. For each appointment A:
2.   For each other appointment B:
3.     If A and B overlap (for same doctor):
4.       Add A to conflicts
5.       Add B to conflicts
6. Return unique conflicts
```

### csvExport.ts

#### exportPatientsToCSV()

**Signature:**
```typescript
function exportPatientsToCSV(
  patients: Patient[],
  doctors: Doctor[]
): string
```

**Description:**
- Generates CSV string for patients
- Resolves doctor IDs to doctor names
- Returns CSV content (not downloaded automatically)
- Format: RFC 4180 (standard CSV)

**Example:**
```typescript
import { exportPatientsToCSV } from '../utils/csvExport'

const csvContent = exportPatientsToCSV(patients, doctors)

// CSV format:
// Full Name,Date of Birth,Gender,Phone,Email,Assigned Doctor
// John Doe,1990-05-15,Male,555-0123,john@example.com,Dr. Smith
// Jane Smith,1985-03-22,Female,555-0124,jane@example.com,-
```

**Output Format:**
| Column | Type | Example |
|--------|------|---------|
| Full Name | string | John Doe |
| Date of Birth | ISO date | 1990-05-15 |
| Gender | string | Male |
| Phone | string | 555-0123 |
| Email | string | john@example.com |
| Assigned Doctor | string | Dr. Smith or - |

#### exportAppointmentsToCSV()

**Signature:**
```typescript
function exportAppointmentsToCSV(
  appointments: Appointment[],
  patients: Patient[],
  doctors: Doctor[]
): string
```

**Description:**
- Generates CSV string for appointments
- Resolves IDs to human-readable names
- Includes duration in minutes
- Returns CSV content

**Example:**
```typescript
const csvContent = exportAppointmentsToCSV(appointments, patients, doctors)

// CSV format:
// Date/Time,Patient,Doctor,Type,Duration (min),Status
// 2024-12-02T14:00:00Z,John Doe,Dr. Smith,Checkup,30,scheduled
```

#### downloadCSV()

**Signature:**
```typescript
function downloadCSV(
  content: string,
  filename: string
): void
```

**Description:**
- Creates blob from CSV content
- Triggers browser download
- Saves file to user's Downloads folder
- Uses data: URL (no server required)

**Example:**
```typescript
const csvContent = exportPatientsToCSV(patients, doctors)
downloadCSV(csvContent, 'patients-export.csv')

// Browser downloads file: patients-export.csv
```

**Implementation Details:**
```typescript
const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
const link = document.createElement('a')
link.href = URL.createObjectURL(blob)
link.download = filename
link.click()
URL.revokeObjectURL(link.href)
```

## Hooks API

### useStore() - Store Hook

See [Store API](#store-api) section above

### useConfirm() - Confirmation Hook

**Location:** `src/components/ConfirmProvider.tsx`

**Signature:**
```typescript
function useConfirm(): {
  confirm: (message: string) => Promise<boolean>
}
```

**Description:**
- Displays confirmation dialog (modal)
- User clicks Yes/No
- Returns Promise that resolves to boolean
- Blocks interaction until answered

**Example:**
```typescript
import { useConfirm } from '../components/ConfirmProvider'

const MyComponent = () => {
  const { confirm } = useConfirm()
  
  const handleDelete = async () => {
    const ok = await confirm('Are you sure you want to delete this patient?')
    
    if (ok) {
      deletePatient()
      toast.toast('Patient deleted')
    } else {
      toast.toast('Deletion cancelled')
    }
  }
}
```

**Best Practices:**
- Always await the promise
- Use clear, specific messages
- Handle both yes and no cases
- Provide feedback after action

### useToast() - Toast Notification Hook

**Location:** `src/components/ToastProvider.tsx`

**Signature:**
```typescript
function useToast(): {
  toast: (message: string) => void
}
```

**Description:**
- Shows notification message
- Positioned fixed bottom-right
- Auto-dismisses after 4 seconds
- Multiple toasts stack

**Example:**
```typescript
import { useToast } from '../components/ToastProvider'

const MyComponent = () => {
  const { toast } = useToast()
  
  const handleSuccess = () => {
    toast('Operation completed successfully!')
  }
  
  const handleError = () => {
    toast('An error occurred. Please try again.')
  }
}
```

**Display Behavior:**
```
┌─────────────────────────────────┐
│  Operation completed!           │
│  ✓ (auto-dismisses after 4s)   │
└─────────────────────────────────┘
```

**Best Practices:**
- Keep messages short & clear
- Use for feedback, not critical errors
- Don't spam (multiple toasts at once is confusing)
- Use for non-blocking operations

### useForm() - React Hook Form Hook

**Location:** Imported from `react-hook-form`

**Signature:**
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
  reset
} = useForm<FormValues>({
  defaultValues: { /* ... */ }
})
```

**Example in PatientForm:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input
      type="text"
      {...register('fullName', { required: 'Full name is required' })}
    />
    {errors.fullName && <span>{errors.fullName.message}</span>}
  </form>
)
```

**Key Methods:**
- `register(name, options)` - Register field
- `handleSubmit(onSubmit)` - Wrap form submission
- `formState.errors` - Get validation errors
- `watch(fieldName)` - Watch field value changes
- `reset()` - Reset form to default values

## Components API

### Layout Component

**Location:** `src/components/Layout.tsx`

**Props:** None (uses children via Outlet)

**Responsibilities:**
- Renders responsive sidebar & header
- Handles mobile menu toggle
- Provides consistent layout wrapper

**Usage:**
```typescript
// In App.tsx routes
<Route element={<Layout>}>
  <Route index element={<Dashboard />} />
  {/* Other routes */}
</Route>
```

### Sidebar Component

**Props:**
```typescript
interface SidebarProps {
  onClose?: () => void
}
```

**Features:**
- Navigation links
- Active link highlighting
- Icons for each section
- Mobile: closes on link click
- Desktop: always visible

### Header Component

**Props:** None

**Features:**
- Page title display
- Mobile menu toggle button
- Quick action buttons (hidden on mobile)

### ConfirmProvider Component

**Props:**
```typescript
interface ConfirmProviderProps {
  children: React.ReactNode
}
```

**Provides:**
- `useConfirm()` hook to all children
- Modal dialog overlay
- Yes/No buttons

### ToastProvider Component

**Props:**
```typescript
interface ToastProviderProps {
  children: React.ReactNode
}
```

**Provides:**
- `useToast()` hook to all children
- Toast container (fixed bottom-right)
- Auto-dismiss logic

## Type Definitions

### Core Domain Types

```typescript
// Patient
interface Patient {
  id: string
  fullName: string
  dateOfBirth: string      // ISO date: "1990-05-15"
  gender: string           // "Male" | "Female" | "Other"
  phone: string
  email: string
  address?: string
  emergencyContact: {
    name?: string
    phone?: string
  }
  medicalHistory?: string
  assignedDoctorId?: string
  createdAt: string        // ISO timestamp
}

// Doctor
interface Doctor {
  id: string
  name: string
  specialization: string
  phone: string
  email: string
}

// Appointment
interface Appointment {
  id: string
  patientId: string
  doctorId: string
  dateTime: string         // ISO timestamp
  durationMinutes: number
  type: string
  reason: string
  status: 'scheduled' | 'completed' | 'cancelled'
}
```

### Theme Type

```typescript
const medicalTheme = {
  primary: 'teal-600',     // Brand color
  success: 'emerald-500',  // Positive actions
  danger: 'red-500',       // Errors, conflicts
  warning: 'amber-500',    // Warnings
  info: 'blue-600',        // Information
  light: 'gray-50',        // Light backgrounds
  dark: 'gray-900',        // Dark text
}
```

## Error Handling

### Validation Errors

**React Hook Form:**
```typescript
const { formState: { errors } } = useForm<FormValues>()

// Display errors
{errors.fullName && (
  <span className="text-red-500 text-sm">
    {errors.fullName.message}
  </span>
)}
```

**Built-in Validations:**
```typescript
{...register('email', {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  }
})}
```

### Conflict Errors

**Appointment Scheduling:**
```typescript
const conflicts = checkAppointmentOverlap(newAppt, appointments)

if (conflicts.length > 0) {
  setConflictMessage(`Doctor has conflicting appointments at: ${conflictTimes}`)
  return  // Don't submit
}
```

### Data Access Errors

**Missing References:**
```typescript
// If patient doesn't exist, show fallback
const patient = patients.find(p => p.id === patientId)

return (
  <div>
    {patient ? patient.fullName : 'Unknown Patient'}
  </div>
)
```

## Best Practices

### 1. Store Usage

**DO:**
```typescript
// Subscribe only to needed data
const patients = useStore((s) => s.patients)
const appointments = useStore((s) => s.appointments)

// Use directly
appointments.filter(a => a.patientId === id)
```

**DON'T:**
```typescript
// Don't subscribe to entire store
const store = useStore()
// Causes re-render on ANY state change
```

### 2. Forms

**DO:**
```typescript
// Validate before submit
const onSubmit = (data: FormValues) => {
  // Validation logic
  if (!isValid(data)) return
  
  // Submit
  addPatient(data)
}
```

**DON'T:**
```typescript
// Manual form state management
const [name, setName] = useState('')
const [dob, setDob] = useState('')
// Too verbose, error-prone
```

### 3. Confirmation Dialogs

**DO:**
```typescript
const handleDelete = async () => {
  const ok = await confirm('Delete this patient?')
  if (!ok) return
  removePatient(id)
  toast.toast('Patient deleted')
}
```

**DON'T:**
```typescript
// No confirmation
const handleDelete = () => {
  removePatient(id)  // User can't undo!
}
```

### 4. Data Persistence

**DO:**
```typescript
// Let Zustand handle persistence
addPatient(newPatient)
// Automatically saved to localStorage
```

**DON'T:**
```typescript
// Manual localStorage management
addPatient(newPatient)
localStorage.setItem('clinic-storage', JSON.stringify(store.getState()))
```

### 5. Responsive Design

**DO:**
```html
<!-- Mobile-first, then enhance -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

**DON'T:**
```html
<!-- Desktop-first (requires more breakpoints) -->
<div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
```

### 6. Component Props

**DO:**
```typescript
interface Props {
  patient: Patient
  onDelete: (id: string) => void
}
```

**DON'T:**
```typescript
// Too many props (prop drilling)
<Patient patientId={id} name={name} email={email} phone={phone} ... />
```

### 7. Comments & Documentation

**DO:**
```typescript
// Calculate appointment end time based on duration
const endTime = addMinutes(new Date(appt.dateTime), appt.durationMinutes)
```

**DON'T:**
```typescript
// This calculates the time
const endTime = addMinutes(new Date(appt.dateTime), appt.durationMinutes)
```

---

**API Reference Version:** 1.0.0  
**Last Updated:** December 2, 2025
