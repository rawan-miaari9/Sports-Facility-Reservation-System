# 🏟️ Sports Facility Reservation System

> A modern, full-stack web application designed to simplify court and facility bookings for customers while providing robust management controls for administrators.

---

## 📌 Table of Contents
- [Overview & Purpose](#-overview--purpose)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Setup & Installation](#-setup--installation)
- [Testing & Deployment](#-testing--deployment)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Overview & Purpose

Managing sports facility reservations through manual schedules, paper records, or phone calls often causes scheduling conflicts, double bookings, and heavy administrative overhead. 

The **Sports Facility Reservation System** automates the entire booking lifecycle:
* **For Customers:** Easily explore available courts (Football, Basketball, Padel, etc.), check real-time hourly slot availability, and place instant reservations online.
* **For Admins:** Manage court listings, control pricing and availability, monitor active bookings, and handle registered user accounts from a single centralized dashboard.

---

## ✨ Key Features

### 🌐 1. Public Portal
* **Center Showcase:** Introduces the sports complex, available amenities, and operating hours.
* **Facility Catalog:** Displays courts with hourly pricing, sport categories, and imagery.
* **Quick Access:** Direct navigation to login, registration, and facility detail pages.

### 👤 2. User Dashboard
* **Authentication:** Secure account registration, sign-in, and session management.
* **Interactive Booking:** Select dates and view available time slots dynamically with conflict prevention.
* **Reservation History:** Review upcoming and past bookings with total cost details.
* **Self-Service Cancellation:** Cancel eligible upcoming bookings directly from the portal.

### 🛡️ 3. Admin Dashboard
* **System Overview:** View total reservation metrics, user accounts, and operational status.
* **Facility Management (CRUD):** Add new courts, update hourly rates and information, or decommission facilities.
* **Reservation Control:** Filter, inspect, and manage all customer bookings system-wide.
* **User Management:** Access and manage registered customer and administrator accounts.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS | React framework for responsive, performant client and server rendering |
| **Backend** | Next.js API Routes / Server Actions | Server-side endpoints handling authentication and logic |
| **Database** | [MongoDB](https://www.mongodb.com/) / Mongoose ODM | Flexible NoSQL document database for schema modeling |
| **Authentication** | NextAuth.js / JWT & bcryptjs | Secure token-based session management and password hashing |
| **Tools & Management** | Git, GitHub, Postman, Jira | Version control, API testing, and project management |

---

## 📂 Project Structure

```text
sports-facility-reservation/
├── public/                  # Static assets & images
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── auth/            # Login & Registration pages
│   │   ├── dashboard/       # User & Admin protected views
│   │   ├── facilities/      # Public court listings & details
│   │   └── api/             # REST API endpoints
│   ├── components/          # Reusable UI components & layouts
│   ├── lib/                 # DB connection helper & utility scripts
│   ├── models/              # Mongoose database schemas
│   └── types/               # TypeScript interfaces & declarations
├── .env.example             # Environment configuration template
├── package.json             # Scripts & project dependencies
└── README.md                # Project documentation

🗄️ Database Schema
1. Users (users)
TypeScript
interface IUser {
  _id: string;
  name: string;
  email: string;          // Unique indexed email address
  password?: string;      // Password hashed with bcryptjs
  role: 'User' | 'Admin'; // Role-based permission indicator
  createdAt: Date;
  updatedAt: Date;
}
2. Facilities (facilities)
TypeScript
interface IFacility {
  _id: string;
  name: string;           // e.g., "Court A - Indoor Padel"
  sportType: string;      // e.g., "Padel", "Football", "Basketball"
  description: string;
  pricePerHour: number;
  image: string;
  isAvailable: boolean;   // Active status for bookings
  createdAt: Date;
  updatedAt: Date;
}
3. Reservations (reservations)
TypeScript
interface IReservation {
  _id: string;
  userId: ObjectId;       // Reference to Users collection
  facilityId: ObjectId;   // Reference to Facilities collection
  reservationDate: Date;  // Target date
  startTime: string;      // e.g., "14:00"
  endTime: string;        // e.g., "15:00"
  totalPrice: number;     // Calculated rate based on duration
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}
🔒 Authentication & Authorization
User Auth: Passwords are hashed using bcryptjs before persisting to MongoDB.

Sessions: NextAuth.js or JWT session cookies manage authenticated user states.

Middleware Guard: middleware.ts intercepts requests:

Restricts /user/* routes to logged-in accounts.

Restricts /admin/* routes strictly to accounts where role === 'Admin'.

🌐 API Endpoints
Auth
POST /api/auth/register — Register a new account

POST /api/auth/login — Authenticate user

GET /api/auth/logout — Logout the user

Facilities
GET /api/facilities — Retrieve all active facilities

GET /api/facilities/[id] — Retrieve single facility details

POST /api/facilities — Add a new facility (Admin only)

PUT /api/facilities/[id] — Update facility information (Admin only)

DELETE /api/facilities/[id] — Delete facility (Admin only)

Reservations
GET /api/reservations — Retrieve reservations (Filtered by user or all for Admin)

POST /api/reservations — Create a new court booking

🔑 Environment Variables
Create a .env.local file in the root directory and add the following keys:

Bash
# Application Port
PORT=3000

# App Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB Atlas / Local Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sports_reservation?retryWrites=true&w=majority

# NextAuth Secret & URL
NEXTAUTH_SECRET=your_jwt_secret_key_here
NEXTAUTH_URL=http://localhost:3000
🚀 Setup & Installation
Clone the repository:

Bash
git clone [https://github.com/your-username/sports-facility-reservation.git](https://github.com/your-username/sports-facility-reservation.git)
cd sports-facility-reservation
Install dependencies:

Bash
npm install
Configure environment variables:
Create a .env.local file and fill in your database URI and secrets.

Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.

🧪 Testing & Deployment
API Testing: Endpoints can be tested using Postman.

Deployment: Pre-configured for seamless deployment on Vercel. Simply link your GitHub repository, supply the environment variables in the project settings, and deploy.

🔮 Future Enhancements
[ ] Automated email/SMS booking confirmations and reminders.

[ ] Support for recurring weekly or monthly league bookings.
