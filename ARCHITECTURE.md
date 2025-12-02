# System Architecture & Design Documentation

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Application Layers](#application-layers)
3. [Data Flow](#data-flow)
4. [Component Hierarchy](#component-hierarchy)
5. [State Management](#state-management)
6. [Routing Architecture](#routing-architecture)
7. [Provider Pattern](#provider-pattern)
8. [Type System](#type-system)
9. [Design Patterns](#design-patterns)
10. [Performance Considerations](#performance-considerations)

## High-Level Architecture

### Conceptual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                        │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (SPA)                  │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         React Router (Navigation)               │ │ │
│  │  ├──────────────────────────────────────────────────┤ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │      Provider Tree (Context)               │ │ │ │
│  │  │  ├────────────────────────────────────────────┤ │ │ │
│  │  │  │  • ConfirmProvider (confirmation dialogs)  │ │ │ │
│  │  │  │  • ToastProvider (notifications)           │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │ │ │
│  │  │  │  │      Component Tree                 │ │ │ │ │
│  │  │  │  ├──────────────────────────────────────┤ │ │ │ │
│  │  │  │  │  Layout (Sidebar, Header, Outlet)  │ │ │ │ │
│  │  │  │  │                                      │ │ │ │ │
│  │  │  │  │  ┌────────────────────────────────┐ │ │ │ │ │
│  │  │  │  │  │    Page Components            │ │ │ │ │ │
│  │  │  │  │  │  (Dashboard, Lists, Forms)    │ │ │ │ │ │
│  │  │  │  │  │                                │ │ │ │ │ │
│  │  │  │  │  │  ⬇ useStore() hook ⬇          │ │ │ │ │ │
│  │  │  │  │  │                                │ │ │ │ │ │
│  │  │  │  │  └────────────────────────────────┘ │ │ │ │ │
│  │  │  │  └──────────────────────────────────────┘ │ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ⬇                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      Zustand Store (Global State Management)          │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  State:  patients, doctors, appointments             │ │
│  │  Actions: add*, update*, remove* for each entity     │ │
│  │  Middleware: persist → localStorage                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ⬇                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Browser localStorage API                    │ │
│  │    (Persists clinic-storage JSON key)                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Application Layers

### Layer 1: Presentation Layer (Components)
**Responsibility:** Render UI, handle user interactions

**Components:**
- Layout & Navigation (Layout, Sidebar, Header)
- Pages (Dashboard, PatientsList, DoctorForm, etc.)
- Providers (ConfirmProvider, ToastProvider)
- Utilities (DataManagement)

**Key Characteristics:**
- React components (JSX/TSX)
- Tailwind CSS for styling
- Responsive design with mobile-first approach
- Use hooks to access state & actions

### Layer 2: State Management Layer (Zustand Store)
**Responsibility:** Manage application state, coordinate data changes

**Components:**
- `useStore()` hook
- State: patients[], doctors[], appointments[]
- Actions: CRUD operations for each entity
- Selectors: Granular store subscriptions

**Key Characteristics:**
- Single source of truth
- Immutable state updates
- Automatic re-render on state changes (via React subscriptions)
- Persist middleware for localStorage

### Layer 3: Persistence Layer (localStorage)
**Responsibility:** Long-term data storage

**Storage:**
- Key: `clinic-storage`
- Value: Serialized JSON of entire store state
- Loaded on app startup, saved on every state change

**Key Characteristics:**
- Synchronous read/write
- Browser-specific (not shared across tabs instantly)
- 5-10MB limit per domain
- No network required

### Layer 4: Utility Layer
**Responsibility:** Business logic & helper functions

**Modules:**
- `appointmentOverlap.ts` - Conflict detection logic
- `csvExport.ts` - Data export utilities

**Key Characteristics:**
- Pure functions (no side effects)
- Reusable across components
- Testable independently

## Data Flow

### Create Patient (Write Flow)

```
User fills form & clicks "Create"
        ↓
Form validation (React Hook Form)
        ↓
PatientForm.onSubmit() called
        ↓
Generate UUID & timestamp
        ↓
useStore().addPatient(newPatient)
        ↓
Zustand store updates state
        ↓
persist middleware intercepts
        ↓
localStorage.setItem('clinic-storage', JSON.stringify(state))
        ↓
React detects state change
        ↓
All subscribed components re-render
        ↓
navigate('/patients')  ← redirect to list
        ↓
toast.toast('Patient created')  ← notification
```

### Display Patient List (Read Flow)

```
User navigates to /patients
        ↓
PatientsList component mounts
        ↓
useStore((s) => s.patients)  ← subscription
        ↓
Zustand returns current patients[]
        ↓
Component renders list
        ↓
Search query state change
        ↓
useMemo() filters patients in real-time
        ↓
Component re-renders with filtered results
```

### Delete Patient with Confirmation (Delete Flow)

```
User clicks delete icon
        ↓
useConfirm().confirm('Delete patient?')
        ↓
ConfirmProvider shows modal
        ↓
User clicks "Yes"
        ↓
Promise resolves with true
        ↓
useStore().removePatient(patientId)
        ↓
Zustand updates state (patients array filtered)
        ↓
localStorage updates
        ↓
All components re-render
        ↓
PatientsList updates (patient removed from display)
        ↓
toast.toast('Patient deleted')
```

## Component Hierarchy

```
<BrowserRouter>
  ↓
<main>
  ↓
<ToastProvider>
  ↓
<ConfirmProvider>
  ↓
<App>
  ├─ <Routes>
  │  └─ <Route path="/" element={<Layout>}>
  │     ├─ <Header />
  │     ├─ <Sidebar />
  │     ├─ <Outlet /> ← page content
  │     └─ Routes to:
  │        ├─ Dashboard
  │        ├─ Patients/PatientsList
  │        ├─ Patients/PatientForm
  │        ├─ Patients/PatientProfile
  │        ├─ Doctors/DoctorsList
  │        ├─ Doctors/DoctorForm
  │        ├─ Doctors/DoctorProfile
  │        ├─ Appointments/AppointmentsList
  │        ├─ Appointments/AppointmentForm
  │        ├─ Appointments/AppointmentCalendar
  │        └─ Appointments/BigCalendar
```

## State Management

### Zustand Store Structure

```typescript
type AppState = {
  // State
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
  
  // Patient Actions
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, updates: Partial<Patient>) => void
  removePatient: (id: string) => void
  
  // Doctor Actions
  addDoctor: (doctor: Doctor) => void
  updateDoctor: (id: string, updates: Partial<Doctor>) => void
  removeDoctor: (id: string) => void
  
  // Appointment Actions
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  removeAppointment: (id: string) => void
}
```

### Subscription & Re-render Logic

```typescript
// Component subscribes to specific slice
const patients = useStore((state) => state.patients)

// Zustand tracks subscription
// On state change, Zustand determines if this component's slice changed
// If changed: component re-renders
// If not changed: component NOT re-rendered (optimization)

// Example: Multiple components
const Comp1 = () => {
  const patients = useStore(s => s.patients)  // subscribes to patients only
  // Re-renders only when patients change
}

const Comp2 = () => {
  const doctors = useStore(s => s.doctors)    // subscribes to doctors only
  // Re-renders only when doctors change
}

// When addPatient() called:
// ✓ Comp1 re-renders (patients changed)
// ✗ Comp2 does NOT re-render (doctors unchanged)
```

## Routing Architecture

### Route Configuration (App.tsx)

```typescript
const router = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      
      { path: 'patients', element: <PatientsList /> },
      { path: 'patients/new', element: <PatientForm /> },
      { path: 'patients/:id', element: <PatientProfile /> },
      
      { path: 'doctors', element: <DoctorsList /> },
      { path: 'doctors/new', element: <DoctorForm /> },
      { path: 'doctors/:id', element: <DoctorProfile /> },
      
      { path: 'appointments', element: <AppointmentsList /> },
      { path: 'appointments/new', element: <AppointmentForm /> },
      { path: 'appointments/calendar', element: <AppointmentCalendar /> },
      { path: 'appointments/bigcal', element: <BigCalendar /> },
    ]
  }
]
```

### Nested Routes & Outlet Pattern

```
/patients
  ↓ matches path="patients"
  ↓ parent is Layout (renders <Outlet />)
  ↓ <Outlet /> replaced with <PatientsList />
  
/patients/new
  ↓ matches path="patients/new"
  ↓ parent is Layout (renders <Outlet />)
  ↓ <Outlet /> replaced with <PatientForm />
  
/patients/123-uuid
  ↓ matches path="patients/:id"
  ↓ parent is Layout (renders <Outlet />)
  ↓ <Outlet /> replaced with <PatientProfile id="123-uuid" />
```

## Provider Pattern

### ConfirmProvider

**Purpose:** Global confirmation dialogs

**Implementation:**
```typescript
// Define context
const ConfirmContext = createContext<ConfirmContextType | null>(null)

// Provider component
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null)
  
  const confirm = (msg: string): Promise<boolean> => {
    return new Promise((res) => {
      setMessage(msg)
      setResolve(() => res)  // store callback
      setIsOpen(true)
    })
  }
  
  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && <ConfirmModal ... />}
    </ConfirmContext.Provider>
  )
}

// Custom hook
export const useConfirm = () => {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be inside ConfirmProvider')
  return ctx
}
```

**Usage:**
```typescript
const MyComponent = () => {
  const { confirm } = useConfirm()
  
  const handleDelete = async () => {
    const ok = await confirm('Delete item?')
    if (ok) deleteItem()
  }
}
```

### ToastProvider

**Similar pattern to ConfirmProvider**
- Context stores active toasts
- `useToast()` hook returns `{ toast: (msg) => void }`
- Toast auto-dismisses after 4 seconds
- Multiple toasts can stack

## Type System

### TypeScript Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strict": true,
    "allowJs": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

**Key Settings:**
- `strict: true` - Enable all strict type checking
- `allowJs: true` - Allow JavaScript files in TypeScript project
- `jsx: "react-jsx"` - Modern JSX transform (no import React)

### Core Types (types.ts)

All domain entities defined as interfaces:

```typescript
export interface Patient { /* ... */ }
export interface Doctor { /* ... */ }
export interface Appointment { /* ... */ }
export interface MedicalRecord { /* ... */ }
```

**Benefits:**
- Compile-time type safety
- IDE auto-completion
- Self-documenting code
- Prevents runtime errors

## Design Patterns

### 1. Provider Pattern (Context API)
**Used for:** ConfirmProvider, ToastProvider  
**Benefit:** Global state without prop drilling

### 2. Custom Hooks Pattern
**Examples:** `useStore()`, `useConfirm()`, `useToast()`  
**Benefit:** Encapsulate logic, reusable across components

### 3. Composition Pattern
**Used for:** Layout wrapping pages with Header, Sidebar  
**Benefit:** Consistent structure across pages

### 4. Container/Presentational Components
**Container:** PatientsList (logic & state)  
**Presentational:** Sidebar (renders props)  
**Benefit:** Separation of concerns

### 5. Render Props (React Hook Form)
**Used in:** Forms with `register()` and `handleSubmit()`  
**Benefit:** Flexible form state management

### 6. Observer Pattern (Zustand)
**Components subscribe to store**  
**Zustand notifies on changes**  
**Benefit:** Reactive updates, optimization via selectors

## Performance Considerations

### 1. Component Memoization

**Current:**
```typescript
// PatientsList uses useMemo for filtering
const filtered = useMemo(() => {
  // expensive filter operation
}, [patients, query])
```

**Benefit:** Prevents unnecessary recalculations

### 2. Zustand Selectors

**Current:**
```typescript
// Component only subscribes to what it needs
const patients = useStore((s) => s.patients)

// NOT:
// const store = useStore()  // subscribes to entire store
```

**Benefit:** Reduces re-renders when unrelated state changes

### 3. Routing

**Current:** React Router lazy loading via code splitting (built-in with Vite)  
**Benefit:** Smaller initial bundle, faster load time

### 4. localStorage Optimization

**Current:** Entire store persisted on every change  
**Optimization Opportunity:** Debounce writes or implement selective persistence

### 5. List Rendering

**Current:**
```typescript
{filtered.map((item) => (
  <Item key={item.id} item={item} />
))}
```

**Best Practice:** Always use stable `key` (UUID, not index)  
**Benefit:** Prevents React reconciliation issues

### 6. CSS Performance

**Tailwind CSS:** Uses PurgeCSS to remove unused styles  
**Result:** Smaller CSS file in production

---

## Suggested Improvements for Scalability

### 1. Backend Integration
- Replace localStorage with API calls
- Implement error handling & retries
- Add loading states

### 2. Authentication
- Add user login
- Implement role-based access control (RBAC)
- Store auth token securely

### 3. Code Splitting
- Lazy load pages: `const Dashboard = lazy(() => import('./pages/Dashboard'))`
- Suspense boundaries for loading states

### 4. State Persistence Optimization
- Debounce localStorage writes
- Compress stored data
- Implement data versioning for migrations

### 5. Error Boundaries
- Wrap components with React Error Boundary
- Graceful error handling & recovery

### 6. Testing
- Unit tests (Jest)
- Component tests (React Testing Library)
- E2E tests (Cypress)

---

**Document Version:** 1.0.0  
**Last Updated:** December 2, 2025
