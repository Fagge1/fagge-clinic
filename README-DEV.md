Development notes

1. Install dependencies

```bash
npm install
# or yarn
```

2. Run development server

```bash
npm run dev
```

3. Type-check

```bash
npm run type-check
```

4. Tailwind

Tailwind is configured via `tailwind.config.js` and `postcss.config.js`. Styles are included in `src/index.css`.

Notes:
- The project has been migrated to TypeScript incrementally (`tsconfig.json` allows JS). Many pages and components are under `src/pages` and `src/components`.
- Data is persisted to `localStorage` via `zustand` persist middleware. Use the UI to create doctors, patients, and appointments.
