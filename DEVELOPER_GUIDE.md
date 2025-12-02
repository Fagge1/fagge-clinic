# Developer Guide & Setup Instructions

## Table of Contents
1. [Quick Start](#quick-start)
2. [Development Environment](#development-environment)
3. [Project Initialization](#project-initialization)
4. [Development Workflow](#development-workflow)
5. [Adding New Features](#adding-new-features)
6. [Testing the Application](#testing-the-application)
7. [Debugging](#debugging)
8. [Code Style & Conventions](#code-style--conventions)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

## Quick Start

### For Experienced Developers

```bash
# 1. Install dependencies
yarn install

# 2. Start development server
yarn dev

# 3. Open browser to localhost:5173
# 4. Start developing!
```

### For New Developers

Follow the [Development Environment](#development-environment) and [Project Initialization](#project-initialization) sections below.

## Development Environment

### System Requirements

```
Node.js:     v16.0.0 or higher (v18+ recommended)
npm/yarn:    Included with Node.js / Install separately
Git:         For version control
Modern Browser: Chrome, Firefox, Safari, or Edge
```

### Step 1: Install Node.js

**macOS:**
```bash
brew install node
# or download from https://nodejs.org/
```

**Windows:**
- Download from https://nodejs.org/
- Run installer, follow prompts
- Restart terminal/command prompt

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version      # v18.x.x
npm --version       # 8.x.x or higher
```

### Step 2: Install yarn (Optional but Recommended)

```bash
npm install -g yarn

# Verify
yarn --version      # 1.22.x or higher
```

### Step 3: Install Git (For Version Control)

**macOS:**
```bash
brew install git
```

**Windows:**
- Download from https://git-scm.com/
- Run installer

**Linux:**
```bash
sudo apt-get install git
```

**Verify:**
```bash
git --version       # git version 2.x.x
```

### Step 4: Choose Code Editor

**Recommended: Visual Studio Code (VS Code)**
- Download: https://code.visualstudio.com/
- Extensions to install:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - ESLint
  - Prettier

## Project Initialization

### Clone the Repository

```bash
# If available on GitHub
git clone https://github.com/your-org/clinic-management.git
cd clinic-management-application

# OR create locally
mkdir clinic-management-application
cd clinic-management-application
```

### Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# OR using npm
npm install

# Verify installation
ls node_modules | wc -l    # Should be 200+
```

### Create .env.local (Optional)

```bash
# Create file
touch .env.local

# Add any environment variables needed
# VITE_API_URL=http://localhost:3000
```

### Verify Setup

```bash
# Build check
yarn build

# Should output:
# ✓ 2000+ modules transformed
# ✓ built in 8.78s
```

### Start Development Server

```bash
yarn dev

# Output:
# VITE v7.2.0  running at:
# 
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

**Open browser to http://localhost:5173/**

## Development Workflow

### Daily Workflow

```bash
# 1. Start of day: pull latest code
git pull origin main

# 2. Start dev server
yarn dev

# 3. Make changes to files
#    (auto-refresh on save with HMR)

# 4. Test in browser
#    (http://localhost:5173)

# 5. Commit changes
git add .
git commit -m "feat: add new feature"

# 6. Push to repository
git push origin feature-branch
```

### File Watching

**Vite automatically watches for changes:**
- `.tsx` files → Hot Module Replacement (HMR)
- `.css` files → Instant update
- `index.html` → Page refresh

**Manual trigger:**
- Save file → Instant update in browser
- No manual refresh needed (in most cases)

### Browser DevTools

**Open DevTools:**
```
Chrome/Edge: F12 or Ctrl+Shift+I
Firefox: F12 or Ctrl+Shift+I
Safari: Cmd+Option+I
```

**Key Tabs:**
1. **Elements/Inspector:** View DOM structure, debug styling
2. **Console:** View JavaScript errors, logs
3. **Sources:** Set breakpoints, step through code
4. **Network:** Check API calls (for future backend integration)
5. **Application:** View localStorage, inspect `clinic-storage`

## Adding New Features

### Adding a New Page

**Step 1: Create page component**
```bash
touch src/pages/Reports/ReportsList.tsx
```

**Step 2: Implement component**
```typescript
// src/pages/Reports/ReportsList.tsx
import React from 'react'

const ReportsList: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4">Reports</h2>
      {/* page content */}
    </div>
  )
}

export default ReportsList
```

**Step 3: Add route**
```typescript
// src/App.tsx
import ReportsList from './pages/Reports/ReportsList'

// In routes:
{ path: 'reports', element: <ReportsList /> }
```

**Step 4: Add navigation link**
```typescript
// src/components/Sidebar.tsx
<NavLink to="/reports" className="...">
  📊 Reports
</NavLink>
```

### Adding a New Type/Interface

**Step 1: Add to types.ts**
```typescript
// src/types.ts
export interface Report {
  id: string
  title: string
  createdAt: string
  data: Record<string, unknown>
}
```

**Step 2: Use in components**
```typescript
import { Report } from '../types'

const MyComponent = () => {
  const report: Report = {
    id: '123',
    title: 'Monthly Report',
    createdAt: new Date().toISOString(),
    data: {}
  }
}
```

### Adding Store Functionality

**Step 1: Extend useStore**
```typescript
// src/store/useStore.ts
type AppState = {
  // existing state...
  reports: Report[]
  addReport: (report: Report) => void
  removeReport: (id: string) => void
  updateReport: (id: string, updates: Partial<Report>) => void
}

// Add actions:
addReport: (report: Report) => set(
  (state) => ({
    reports: [...state.reports, report]
  })
),
```

**Step 2: Use in component**
```typescript
const addReport = useStore((s) => s.addReport)

addReport({
  id: uuidv4(),
  title: 'New Report',
  createdAt: new Date().toISOString(),
  data: {}
})
```

### Adding Validation Utility

**Step 1: Create utility file**
```typescript
// src/utils/validation.ts
export function validateReport(report: Report): string[] {
  const errors: string[] = []
  
  if (!report.title) errors.push('Title is required')
  if (!report.data) errors.push('Data is required')
  
  return errors
}
```

**Step 2: Use in forms**
```typescript
import { validateReport } from '../utils/validation'

const onSubmit = (data: FormValues) => {
  const errors = validateReport(data)
  if (errors.length > 0) {
    toast.toast(errors[0])
    return
  }
  
  addReport(data)
}
```

## Testing the Application

### Manual Testing Checklist

**Patient Management:**
- [ ] Create patient (valid data)
- [ ] Create patient (missing required field) - should error
- [ ] Search patients by name
- [ ] Search patients by phone
- [ ] View patient profile
- [ ] Delete patient (with confirmation)

**Doctor Management:**
- [ ] Add doctor
- [ ] View doctor list
- [ ] Search doctors
- [ ] Delete doctor

**Appointment Management:**
- [ ] Schedule appointment (no conflicts)
- [ ] Schedule appointment (with conflicts) - should error
- [ ] View appointment list
- [ ] Filter appointments by status
- [ ] Mark appointment complete
- [ ] Cancel appointment
- [ ] Delete appointment
- [ ] View 7-day calendar
- [ ] View month calendar

**Data Export:**
- [ ] Export patients CSV (verify format)
- [ ] Export appointments CSV (verify format)
- [ ] Open CSV in Excel (verify formatting)

**Mobile Responsiveness:**
- [ ] Test on iPhone 12 (390px)
- [ ] Test on iPad (768px)
- [ ] Test sidebar toggle on mobile
- [ ] Test forms on mobile (single column)
- [ ] Test tables convert to cards on mobile

**Data Persistence:**
- [ ] Add patient
- [ ] Refresh page (data persists)
- [ ] Open DevTools → Application → localStorage
- [ ] Verify `clinic-storage` key contains data
- [ ] Clear localStorage, refresh (data gone)

### Browser Testing

```bash
# Test in different browsers
# Chrome: Desktop + mobile emulation
# Firefox: Developer edition
# Safari: macOS & iOS devices
# Edge: Windows
```

## Debugging

### Console Logging

**Basic logging:**
```typescript
console.log('Message:', value)
console.warn('Warning:', issue)
console.error('Error:', error)
```

**Object inspection:**
```typescript
const patient = { id: '123', name: 'John' }
console.table(patients)  // Table format
console.log('%c Patient', 'color: blue', patient)  // Styled
```

### React DevTools

**Install extension:**
- Chrome: React Developer Tools
- Firefox: React Developer Tools

**Features:**
- Inspect component tree
- View props & state
- Trigger re-renders
- Highlight updates

### Store Debugging

**Log store state:**
```typescript
const store = useStore.getState()
console.log('Current store:', store)
```

**Monitor store changes:**
```typescript
useStore.subscribe(
  (state) => state.patients,
  (patients) => console.log('Patients changed:', patients)
)
```

### Network Debugging (Future Backend)

**Check network requests:**
1. Open DevTools → Network
2. Perform action (submit form, etc.)
3. See request details:
   - Method: GET, POST, PUT, DELETE
   - Status: 200, 400, 500, etc.
   - Response: JSON data or error

### Breakpoint Debugging

**Set breakpoint:**
1. Open DevTools → Sources
2. Click line number to set breakpoint
3. Trigger action that runs code
4. Execution pauses at breakpoint
5. Step through code (F10)
6. Inspect variables

## Code Style & Conventions

### Naming Conventions

**Files:**
```
Components:     PascalCase.tsx           (PatientsList.tsx)
Utilities:      camelCase.ts            (appointmentOverlap.ts)
Config:         descriptive-kebab.js    (tailwind.config.cjs)
```

**Variables:**
```typescript
// Constants
const MAX_PATIENT_AGE = 120

// Booleans (prefix with is/has)
const isValid = true
const hasErrors = false

// Arrays (plural)
const patients = []
const doctors: Doctor[] = []

// Functions (verb prefix)
const handleClick = () => {}
const formatDate = (date: Date) => {}
const checkConflict = (appt: Appointment) => {}
```

**CSS Classes:**
```typescript
// Descriptive, kebab-case
className="flex items-center gap-2"
className="bg-teal-600 text-white rounded"
```

### Code Organization

**Single Responsibility Principle:**
```typescript
// GOOD: Each component has one job
<PatientForm />           // Handle form input
<PatientsList />          // Display patients
<PatientProfile />        // Show patient details

// BAD: Component does too much
<PatientsManager />       // Form + List + Details
```

**Component Structure:**
```typescript
import React from 'react'                    // 1. Imports
import { useStore } from '../store/useStore'
import { useToast } from '../components/ToastProvider'

interface Props {                             // 2. Type definitions
  id?: string
}

const MyComponent: React.FC<Props> = () => {  // 3. Component definition
  const [state, setState] = React.useState()  // 4. Hooks
  const data = useStore((s) => s.data)
  
  const handleAction = () => {                 // 5. Functions/Handlers
    // logic
  }
  
  return (                                     // 6. JSX
    <div>
      {/* content */}
    </div>
  )
}

export default MyComponent                    // 7. Export
```

### TypeScript Best Practices

```typescript
// Use interfaces for objects
interface Patient {
  id: string
  name: string
}

// Use types for unions
type Status = 'active' | 'inactive'

// Use generics for reusability
function find<T>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}

// Avoid 'any' type
// BAD:  const data: any = {}
// GOOD: const data: Record<string, unknown> = {}
```

### React Best Practices

```typescript
// Use functional components (not class components)
const MyComponent: React.FC = () => {
  // hooks
}

// Use destructuring
const { name, email } = patient

// Use arrow functions for handlers
const handleClick = () => {}

// Extract components when logic gets complex
<UserProfile />      // Better than inline JSX in another component
```

## Common Tasks

### Task: Add a New Field to Patient

**1. Update type**
```typescript
// src/types.ts
export interface Patient {
  // ... existing fields
  insuranceId?: string    // Add new field
}
```

**2. Update form**
```typescript
// src/pages/Patients/PatientForm.tsx
<input
  {...register('insuranceId')}
  placeholder="Insurance ID"
/>
```

**3. Update display**
```typescript
// src/pages/Patients/PatientProfile.tsx
<div>Insurance ID: {patient.insuranceId}</div>
```

**4. Update CSV export**
```typescript
// src/utils/csvExport.ts
// Add to CSV headers and data
```

### Task: Change Color Theme

**1. Update theme constant**
```typescript
// src/types.ts
export const medicalTheme = {
  primary: 'blue-600',    // was teal-600
  success: 'green-500',   // was emerald-500
  // ...
}
```

**2. Find & replace in components**
```bash
# Replace teal-600 with blue-600
grep -r "teal-600" src/
# Update each occurrence
```

**3. Update Tailwind config (optional)**
```javascript
// tailwind.config.cjs
theme: {
  extend: {
    colors: {
      primary: '#1e40af',  // blue-600
    }
  }
}
```

### Task: Add Confirmation to Delete

```typescript
// Already implemented pattern
const handleDelete = async () => {
  const ok = await confirm.confirm('Delete this item?')
  if (!ok) return
  
  removeItem(id)
  toast.toast('Item deleted')
}
```

### Task: Add Notification

```typescript
// Use toast hook
const { toast } = useToast()

// In handler
try {
  addPatient(data)
  toast.toast('Patient created successfully!')
} catch (error) {
  toast.toast('Error creating patient')
}
```

## Troubleshooting

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# OR use different port
yarn dev --port 3000
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
yarn install

# Check TypeScript version
tsc --version  # Should be 5.6+

# Run type check
yarn build
```

### Issue: Modules Not Found

**Solution:**
```bash
# Reinstall dependencies
yarn install

# Clear Vite cache
rm -rf dist node_modules/.vite

# Restart dev server
yarn dev
```

### Issue: localStorage Data Lost

**Solution:**
```bash
# Check if in Private/Incognito mode (doesn't persist)
# Use regular browsing mode

# Check localStorage manually
# DevTools → Application → Storage → Local Storage → http://localhost:5173
# Should see 'clinic-storage' key
```

### Issue: Styles Not Applying

**Solution:**
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Check Tailwind import
# src/index.css should have: @import "tailwindcss";

# Rebuild
yarn build
```

### Issue: Component Not Rendering

**Solution:**
```bash
# Check console for errors (F12 → Console)

# Verify component is exported
// MyComponent.tsx
export default MyComponent  // Required

// Import and use
import MyComponent from './MyComponent'

// Verify route exists (if page)
{ path: 'mypage', element: <MyComponent /> }
```

### Issue: Form Data Not Persisting

**Solution:**
```bash
// Verify useStore hook is called
const addPatient = useStore((s) => s.addPatient)

// Verify action is called with valid data
addPatient({
  id: uuidv4(),           // Must have UUID
  fullName: 'John',
  // ... all required fields
  createdAt: new Date().toISOString()
})

// Check localStorage has data
localStorage.getItem('clinic-storage')
```

---

## Getting Help

**Documentation:**
- README.md - Project overview
- ARCHITECTURE.md - System design
- API_REFERENCE.md - Function API docs

**Resources:**
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- Zustand: https://github.com/pmndrs/zustand

**Questions?**
- Check error messages in console (F12)
- Search for similar issues online
- Ask team lead or senior developer

---

**Developer Guide Version:** 1.0.0  
**Last Updated:** December 2, 2025
