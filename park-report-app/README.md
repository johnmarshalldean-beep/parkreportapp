# Employee Park Report App

A worker-only maintenance reporting app with required photos, employee names, history, completed reports, Node.js backend, and Supabase database/storage.

## Folder structure

- frontend: HTML, CSS, JavaScript pages
- backend: Node.js + Express API
- database: Supabase SQL setup

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `database/supabase.sql`.
3. In Supabase Storage, create a public bucket named `report-photos`.
4. Copy `backend/.env.example` to `backend/.env`.
5. Fill in your Supabase project URL and service role key.
6. In the backend folder, run:

```bash
npm install
npm run dev
```

7. Open `frontend/index.html` in your browser.

## Notes

The frontend currently points to:

```js
http://localhost:3000/api/reports
```

When deployed, replace that with your hosted backend URL in `app.js`, `history.js`, and `completed.js`.
