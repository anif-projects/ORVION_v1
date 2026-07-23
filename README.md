# Orvion LMS - Modern Production Learning Management System

Orvion LMS is an enterprise-grade, full-stack Learning Management System platform engineered using **Clean Architecture** (Controllers, Services, Repositories, Middlewares, DTOs, Validators) and a premium **Glassmorphism React UI System** with Framer Motion.

---

## Technical Features

### Backend Architecture (`/server`)
- **Clean Architecture Layers**:
  - `controllers/`: Handles HTTP requests, DTO validation, and response serialization.
  - `services/`: Business logic, payment strategy adapters (Stripe & Razorpay), email OTP verification, Cloudinary signed streaming URLs, and SHA-256 certificate generation.
  - `repositories/`: Decoupled Mongoose database operations with optimized aggregate pipeline indexing.
  - `models/`: Mongoose schemas for Users, Profiles, Courses, Modules, Lessons, Enrollments, Payments, Certificates, Events, Discussions, Audit Logs, Settings, OTPs, and Refresh Tokens.
  - `middlewares/`: JWT authentication, RBAC authorization (`super_admin`, `admin`, `student`), security sanitization (Helmet, MongoSanitize, Rate Limiter), and immutable audit logger.

### Frontend Architecture (`/frontend`)
- **Tech Stack**: Vite + React 18, Tailwind CSS, Framer Motion, Redux Toolkit, React Query, Lucide Icons, Recharts, React Player, React Hot Toast.
- **Glassmorphism Design System**: Custom Tailwind tokens (`#4F46E5` primary, `#06B6D4` secondary, glass blur panels, dark/light mode toggle).
- **Modules**:
  - **Public**: Landing Page (Hero, animated stats, category cards, course catalog), Course Detail with preview modal, Login/Signup with OTP verification, Certificate Hash Verification portal.
  - **Student Portal**: Student Dashboard (learning streak, progress bar), My Courses, Distraction-Free Learning Player (Cloudinary signed stream playback, notes, PDF downloads, completion toggle), Community Q&A discussion board.
  - **Admin Portal**: Executive Analytics Dashboard (Recharts revenue graphs & enrollment trends), Course Manager & Curriculum Drag-and-Drop Builder, Student Management (block/unblock controls), Audit Logs viewer, System Settings.

### DevOps & Deployment (`/devops`, Docker, Nginx)
- **Multi-Stage Dockerfile**: Builds optimized frontend static assets and server runtime.
- **Docker Compose**: Orchestrates Express API, MongoDB database container, and Nginx reverse proxy.
- **CI/CD Pipeline**: GitHub Actions workflow for linting, testing, building Docker containers.
- **PM2 Ecosystem**: Multi-core cluster process manager configuration (`ecosystem.config.js`).

---

## Quick Start Guide

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Seed initial demo data (Admin: admin@lms.com / password123, Student: student@lms.com / password123)
npm run seed
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application will launch on `http://localhost:5173`.

### 3. Production Docker Deployment
```bash
docker-compose up --build -d
```
