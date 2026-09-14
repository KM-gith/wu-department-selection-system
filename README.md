# Wallaga University — Department Selection System (CS / IT / IS)

A working full-stack prototype of the Department Selection System described in Chapters 3 and 7,
scoped to three departments: **Computer Science, Information Technology, Information System**.

- **Backend:** Node.js, Express, MongoDB (Atlas) via Mongoose, JWT authentication, bcrypt password hashing
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts, Axios

Two roles are implemented: **student** and **registrar** (the registrar account covers the
admin/dean/department-head responsibilities from Chapter 7 for simplicity — see "Extending" below).

---

## 1. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Under **Database Access**, create a database user with a username and password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` while developing).
4. Click **Connect → Drivers → Node.js** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add a database name to the path, e.g. `.../wu_dss?retryWrites=true&w=majority`.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — the Atlas connection string from step 1
- `JWT_SECRET` — any long random string
- `ADMIN_SIGNUP_KEY` — a private key you'll share with registrar/dean staff so they can create accounts
- `CLIENT_ORIGIN` — leave as `http://localhost:5173` for local development

```bash
npm install
npm run seed   # creates the CS / IT / IS departments and default settings
npm run dev    # starts the API on http://localhost:4000
```

Health check: `GET http://localhost:4000/api/health` should return `{"ok": true}`.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # VITE_API_BASE=http://localhost:4000/api
npm install
npm run dev             # starts the app on http://localhost:5173
```

Open `http://localhost:5173`.

## 4. Try it out

1. Go to **Registrar / Dean → Register (staff only)**, enter the `ADMIN_SIGNUP_KEY` from your `.env`, and create a
   registrar account.
2. In the registrar's **Students** tab, click **Add 15 sample applicants** to generate demo data (or register
   real students from the **Student** login screen).
3. In **Capacity**, adjust seats per department and the affirmative-action weight if needed.
4. In **Run Placement**, click **Run placement (draft)** to preview the allocation, then **Approve & publish**
   to make it visible to students.
5. Sign in as a student (sample accounts use password `changeme123`) to see the assigned department and file an
   appeal if needed. Registrars review appeals under **Appeals**.

## Project structure

```
backend/
  server.js               Express entrypoint
  src/
    config/db.js           MongoDB connection
    models/                User, StudentProfile, Department, Settings
    middleware/             JWT auth + role guard
    controllers/            Request handlers
    routes/                  Route wiring
    utils/placementAlgorithm.js   Pure allocation function
    seed/seed.js             Creates CS/IT/IS + default settings

frontend/
  src/
    api/client.js           Axios instance with JWT attached
    context/AuthContext.jsx  Login/register/logout state
    components/              Shared UI + admin tab components
    pages/                    Landing, auth, student & registrar dashboards
```

## Extending toward the full Chapter 7 design

This prototype merges Admin, Dean, and Department Head into a single **registrar** role to keep the
first version manageable. To match Chapter 7 exactly:
- Split `role` into `admin | dean | departmentHead | student` in `User.js`.
- Add an `Application` status flow (`pending → reviewed → approved/rejected`) per department before the
  placement algorithm runs, handled by a department-head-only route.
- Add a dean-only `approveAllocation` step between "run placement" and "publish."
- Add report generation (PDF/Excel) — `pdfkit` or `exceljs` on the backend are good fits.
- Add audit logging for capacity/manual-override changes, per the Security & Validation section (7.8).
