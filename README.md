# EduConnect CRM — Student Inquiry & Enrollment Management System
### Powered by K12 Hunar · Full-Stack Technical Assessment

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E)](https://supabase.com)

---

## Project Overview

**EduConnect CRM** is a production-quality full-stack web application built as a technical hiring assessment for K12 Hunar. It provides:

- A **public inquiry portal** where parents, students, and schools can submit educational inquiries
- A **secure admin CRM dashboard** for managing, filtering, searching, and resolving those inquiries
- Custom **JWT authentication** (no third-party auth services)
- A fully normalized **Supabase PostgreSQL** database
- **Real-time filtering and search** via parameterized SQL queries

---

## Features

### Public Portal
- ✅ Professional landing page with hero section
- ✅ Multi-field inquiry form with complete client-side validation
- ✅ Real-time inline validation messages
- ✅ Success/error feedback after submission
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Form reset and duplicate submission prevention

### Admin CRM Dashboard
- ✅ Secure login with bcrypt-hashed passwords and JWT tokens
- ✅ Dashboard statistics (Total, New, In Progress, Resolved) — database-driven
- ✅ Paginated inquiry table with sorting
- ✅ Filter by Category (Scholarship, Concert, Admission, General Query)
- ✅ Filter by User Type (Parent, Student, School)
- ✅ Case-insensitive search by name or phone
- ✅ Combined multi-filter support
- ✅ Inquiry detail modal with full information
- ✅ Inline status update (New → In Progress → Resolved)
- ✅ Responsive mobile sidebar navigation
- ✅ Logout with cookie/token clearing

### Security
- ✅ bcrypt password hashing (salt rounds: 12)
- ✅ JWT with configurable expiry
- ✅ HttpOnly cookie authentication
- ✅ Helmet security headers
- ✅ Rate limiting (login + public inquiry endpoints)
- ✅ Parameterized SQL (prevents SQL injection)
- ✅ CORS restricted to deployed frontend URL
- ✅ No credentials in frontend code

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM v6, Axios |
| Styling | Tailwind CSS, Inter / Plus Jakarta Sans |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Auth | bcrypt + jsonwebtoken (custom implementation) |
| Database | Supabase PostgreSQL (via `pg` package) |
| Security | helmet, express-rate-limit, express-validator |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| DB Host | Supabase |

---

## Folder Structure

```
k12-hunar-crm/
├── frontend/                    # React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Public site navigation
│   │   │   ├── Footer.jsx       # Public site footer
│   │   │   ├── Sidebar.jsx      # Admin dashboard sidebar
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── InquiryTable.jsx # Main data table + pagination
│   │   │   ├── FilterBar.jsx    # Search + filter controls
│   │   │   ├── StatusBadge.jsx  # Colored status indicators
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page + inquiry form
│   │   │   ├── InquiryForm.jsx  # Standalone inquiry page
│   │   │   ├── Login.jsx        # Admin login
│   │   │   ├── Dashboard.jsx    # Admin CRM dashboard
│   │   │   └── NotFound.jsx     # 404 page
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + API functions
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── utils/
│   │   │   └── helpers.js       # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # PostgreSQL pool configuration
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── inquiryController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── inquiryRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   └── inquiryValidator.js
│   │   └── server.js
│   ├── scripts/
│   │   └── createAdmin.js       # Admin seeding script
│   ├── .env.example
│   └── package.json
│
├── schema.sql                   # Complete PostgreSQL schema
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Supabase** account (free tier works)
- A **Vercel** account (for frontend deployment)
- A **Render** account (for backend deployment)

---

## 1. Supabase Database Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"** and fill in the project name and database password
3. Wait for the project to be provisioned (~2 minutes)

### Step 2: Run the Schema
1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of [`schema.sql`](./schema.sql) from this repository
4. Paste it into the SQL Editor and click **"Run"**
5. You should see: `Success. No rows returned.`

### Step 3: Get the Connection String
1. In Supabase, go to **Project Settings → Database**
2. Scroll to **"Connection string"**
3. Select the **"URI"** tab
4. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. This is your `DATABASE_URL` value

---

## 2. Backend Setup

### Installation
```bash
cd backend
npm install
```

### Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
JWT_SECRET=your_super_secure_random_256_bit_secret_here
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@k12hunar.edu
ADMIN_PASSWORD=Admin@123456
```

> **Generate a secure JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Create the First Admin
```bash
npm run create-admin
```
This reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file, hashes the password, and inserts the admin into the database.

### Start the Backend
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

## 3. Frontend Setup

### Installation
```bash
cd frontend
npm install
```

### Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Start the Frontend
```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 4. Admin Login

1. Open `http://localhost:5173/admin/login`
2. Enter the credentials you set in `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. You will be redirected to the dashboard on successful login

---

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-render-app.onrender.com/api`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | None | Admin login — returns JWT |
| GET | `/auth/me` | ✅ JWT | Get current admin info |
| POST | `/auth/logout` | None | Clear auth cookie |

#### POST /auth/login
```json
// Request
{
  "email": "admin@k12hunar.edu",
  "password": "Admin@123456"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": { "id": "uuid", "email": "admin@k12hunar.edu" }
}
```

### Inquiry Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/inquiries` | None | Submit a new inquiry (rate limited) |
| GET | `/inquiries` | ✅ JWT | List inquiries with filters |
| GET | `/inquiries/stats` | ✅ JWT | Dashboard statistics |
| GET | `/inquiries/:id` | ✅ JWT | Get single inquiry |
| PATCH | `/inquiries/:id/status` | ✅ JWT | Update inquiry status |

#### POST /inquiries
```json
// Request
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "user_type": "Parent",
  "category": "Admission",
  "message": "I would like to know more about the admission process for Grade 6."
}

// Response 201
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "data": { "id": "uuid", "name": "Rahul Sharma", ... }
}
```

#### GET /inquiries (with filters)
```
GET /api/inquiries?category=Scholarship&userType=Student&search=John&page=1&limit=10
```

```json
// Response 200
{
  "success": true,
  "data": [ { "id": "...", "name": "...", ... } ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### PATCH /inquiries/:id/status
```json
// Request
{ "status": "In Progress" }

// Response 200
{ "success": true, "message": "Status updated", "data": { ... } }
```

#### GET /inquiries/stats
```json
// Response 200
{
  "success": true,
  "data": {
    "total": 42,
    "new": 15,
    "in_progress": 12,
    "resolved": 15
  }
}
```

---

## Testing Checklist

Run through these manually after setup:

### Public Form
- [ ] Landing page loads at `http://localhost:5173`
- [ ] Submitting empty form shows validation errors
- [ ] Invalid email format shows error
- [ ] Invalid phone shows error  
- [ ] Valid submission shows success message
- [ ] Form clears after successful submission
- [ ] Inquiry appears in Supabase `inquiries` table

### Admin Authentication
- [ ] `/admin/login` loads correctly
- [ ] Wrong password shows error message
- [ ] Correct credentials redirect to dashboard
- [ ] Passwords in Supabase are bcrypt hashed (not plain text)
- [ ] Direct access to `/admin/dashboard` without login redirects to login

### Dashboard
- [ ] Stats cards show real numbers from database
- [ ] All inquiries display in the table
- [ ] Category filter works (try "Scholarship")
- [ ] User Type filter works (try "Student")
- [ ] Name search works (case-insensitive)
- [ ] Phone search works
- [ ] Combined filters work together
- [ ] Clicking "View" opens detail modal
- [ ] Status dropdown updates inquiry in database
- [ ] Pagination works when more than 10 inquiries
- [ ] Logout clears session and redirects to login

### Responsive
- [ ] Mobile nav hamburger works
- [ ] Form fields stack properly on mobile
- [ ] Dashboard table is readable on mobile
- [ ] No horizontal scroll on mobile

---

## Deployment

### Frontend → Vercel

1. Push your code to GitHub (without `.env` files)
2. Import the repository in [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
5. Click **Deploy**
6. After deploy, note your Vercel URL (e.g., `https://k12-hunar-crm.vercel.app`)

The `vercel.json` in the frontend directory handles React Router fallbacks automatically.

### Backend → Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add **Environment Variables** in Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=1d
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
7. Click **Create Web Service**
8. Wait for deployment (~5 minutes for first deploy)
9. Note your Render URL

### Create Production Admin
After backend is deployed, create the admin via Render Shell:
1. Go to your Render service → **Shell**
2. Run:
   ```bash
   ADMIN_EMAIL=admin@k12hunar.edu ADMIN_PASSWORD=YourSecurePass npm run create-admin
   ```

### Post-Deployment
- Update `VITE_API_URL` in Vercel to your Render backend URL
- Test the live site end-to-end using the Testing Checklist above

---

## Live Application

- **Frontend**: `https://YOUR-APP.vercel.app` *(update after deployment)*
- **Backend API**: `https://YOUR-APP.onrender.com/api` *(update after deployment)*
- **Health Check**: `https://YOUR-APP.onrender.com/api/health`

---

## GitHub Repository

`https://github.com/YOUR-USERNAME/k12-hunar-crm` *(update with actual URL)*

---

## Security Notes

- Passwords are stored as bcrypt hashes with 12 salt rounds — never plain text
- JWT secrets are stored in environment variables only — never in code
- All protected routes require a valid JWT in the `Authorization` header or `auth_token` cookie
- SQL injection is prevented via parameterized queries throughout
- CORS is restricted to the configured frontend URL in production
- Rate limiting is applied to the login endpoint (5 attempts/15min) and public inquiry endpoint (10/15min)

---

## Built By

This project was built as a complete full-stack technical assessment for **K12 Hunar**, demonstrating production-quality full-stack development skills.

**Stack**: React + Node.js + Express + PostgreSQL (Supabase) + JWT Auth + Vercel + Render
