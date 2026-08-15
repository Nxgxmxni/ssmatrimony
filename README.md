# SS Matrimony 💍

SS Matrimony is a modern, full-stack matrimonial web application designed to bring souls together with trust, culture, privacy, and seamless user experience.

---

## 🔐 Phase 2 Authentication Module Overview

The platform features a production-ready, security-hardened **Phase 2 Authentication System**:

- **Bcrypt Hashing**: Secure 10-round salted password encryption.
- **JWT & HTTP-Only Refresh Token Rotation**: Dual token architecture (Short-lived Access Token in headers/cookies + 7-day Refresh Token with token rotation & revocation).
- **Google OAuth Integration**: Native Google Sign-In support for instant account creation and one-click authentication.
- **Nodemailer HTML Email Transporter**: Elegant responsive HTML emails for:
  - Email Verification Link
  - Password Reset Request (1-hour token validity)
  - Password Changed Security Alert
- **Input Validation & Password Strength Meter**: Real-time frontend checklist & backend enforcement (8+ chars, uppercase, lowercase, numbers, special characters).
- **Security Hardening**: Integrated `helmet` HTTP headers, `express-rate-limit` brute-force protection, and CORS credentials support.
- **Role-Based Access Control (RBAC)**: Route guards for Guest (`PublicRoute`), Member (`ProtectedRoute`), and Administrator (`AdminRoute`).

---

## 🏗️ Project Architecture & Folder Structure

```
c:\projects\ssmatrimony
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # AuthController (register, login, google, verify, reset, me), ProfileController, AdminController
│   │   ├── middleware/      # Auth JWT verification (protect, authorize, admin), rateLimiter
│   │   ├── models/          # User (fullName, email, mobile, password, googleId, role, emailVerified, resetToken...), Profile
│   │   ├── routes/          # API route definitions (/api/auth/*, /api/profiles/*)
│   │   ├── utils/           # Email transporter & templates (email.js), Seed script (seed.js)
│   │   └── server.js        # Express app entry point with Helmet security & CORS
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (PasswordStrengthMeter, GoogleLoginButton, Toast, Logo, Navbar, Footer)
│   │   ├── context/         # AuthContext (state management for user, profile, tokens, loading)
│   │   ├── pages/           # Pages (Home, Login, Register, ForgotPassword, ResetPassword, VerifyEmail, Unauthorized, Dashboard, Messages, Admin)
│   │   ├── services/        # Axios API client with automatic 401 token refresh interceptor (api.js)
│   │   ├── App.jsx          # React Router with PublicRoute, ProtectedRoute & AdminRoute guards
│   │   └── index.css        # Luxury theme tokens & global styling
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 📦 Installed Packages

### Backend Dependencies:
- `bcryptjs`: Password hashing
- `jsonwebtoken`: Access & refresh token generation and verification
- `cookie-parser`: Secure HTTP-Only cookie parsing
- `helmet`: Security HTTP headers
- `nodemailer`: Transactional email delivery
- `google-auth-library`: Google OAuth token verification
- `express-rate-limit`: Rate limiting & brute force mitigation
- `express-validator` & `validator`: Input validation
- `cors`, `dotenv`, `mongoose`, `morgan`

### Frontend Dependencies:
- `react`, `react-dom`, `react-router-dom`: SPA routing
- `axios`: HTTP client with interceptors
- `framer-motion`: Smooth micro-animations
- `lucide-react`: Modern SVG icons

---

## ⚙️ Required Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ssmatrimony?retryWrites=true&w=majority

# Security Keys
JWT_SECRET=ss_matrimony_super_secret_jwt_key_2026
REFRESH_SECRET=ss_matrimony_refresh_secret_key_2026

# Nodemailer Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="SS Matrimony <noreply@ssmatrimony.com>"

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🔑 Google OAuth Setup Steps

To configure Google Sign-In with real OAuth credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **SS Matrimony**.
3. Navigate to **APIs & Services > OAuth consent screen**:
   - Choose **User Type**: External.
   - App name: `SS Matrimony`.
   - Add developer email and save.
4. Go to **Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application**.
   - Authorized JavaScript origins: `http://localhost:5173`, `http://localhost:5000`.
   - Authorized redirect URIs: `http://localhost:5173/login`, `http://localhost:5000/api/auth/google/callback`.
5. Copy the generated **Client ID** and **Client Secret**.
6. Paste them into `backend/.env` under `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

*(Note: In local development mode without custom credentials, clicking "Continue with Google" uses the built-in instant OAuth fallback mode).*

---

## 📧 Email Transporter Setup Steps (Nodemailer)

To send real emails for email verification and password resets:

1. Open your Gmail Account settings.
2. Ensure **2-Step Verification** is enabled under Security.
3. Search for **App passwords** in the Google Account search bar.
4. Generate a new App Password for App: **Mail**, Device: **Web App**.
5. Copy the 16-character generated password.
6. In `backend/.env`, set:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
*(If SMTP environment variables are omitted during local dev, the backend gracefully logs formatted email content to the console with dev quick-reset links).*

---

## 🧪 Testing Authentication Flows

### 1. Register Flow
- Navigate to `http://localhost:5173/register`.
- Fill in Full Name, Email, Mobile Number, Gender, and Password (observe real-time strength meter).
- Submit form. Account is created and user is directed to the Dashboard.

### 2. Login Flow
- Navigate to `http://localhost:5173/login`.
- Enter registered email or mobile phone and password.
- Sign in with real MongoDB administrator credentials:
  - **Admin Email**: `admin@ssmatrimony.com`
  - **Admin Password**: `Admin@123`

### 3. Forgot & Reset Password Flow
- Go to `/forgot-password`, enter email, and click **Send Reset Link**.
- Click the reset link or navigate to `/reset-password/:token`.
- Enter new password (verify strength meter checks), submit, and log in with new password.

### 4. Email Verification Flow
- Visit `/verify-email/<token>` (e.g. generated during registration).
- View animated checkmark verification and return to dashboard.

### 5. Route Protection
- Try accessing `/dashboard` or `/messages` while logged out -> Auto-redirects to `/login`.
- Try accessing `/admin` with a standard user account -> Redirects to `/unauthorized`.
- Try accessing `/login` while logged in -> Auto-redirects to `/dashboard`.

---

## 🚀 Quick Commands

```bash
# Seed database with initial real Administrator account (admin@ssmatrimony.com / Admin@123)
npm run seed:admin --prefix backend

# Seed database with sample profiles
npm run seed --prefix backend

# Start backend server (Port 5000)
npm run dev --prefix backend

# Start frontend dev server (Port 5173)
npm run dev --prefix frontend
```

---

## 📄 License
ISC © SS Matrimony Team
