# ⭐ Store Ratings & Review System

A full-stack web application that enables users to browse stores, submit ratings, and manage reviews through secure role-based access control. Built with NestJS, React, PostgreSQL, and JWT authentication.

## 🚀 Features

### 👨‍💼 Admin

* Manage users and stores
* Assign store owners
* View system statistics
* Monitor ratings and reviews

### 🏪 Store Owner

* View owned stores
* Track average ratings
* Monitor customer feedback
* Access store-specific analytics

### 👤 Normal User

* Browse and search stores
* Submit ratings (1–5 stars)
* Update existing ratings
* View store reviews and ratings

---

## 🛠️ Tech Stack

### Backend

* NestJS
* TypeScript
* PostgreSQL
* TypeORM
* Passport JWT
* Bcrypt
* Class Validator

### Frontend

* React 19
* Vite
* Tailwind CSS v4
* React Router v7
* TanStack Query v5
* Axios
* React Hook Form
* Zod

---

## 📂 Project Structure

```text
Store-Ratings-System/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── stores/
│   │   ├── ratings/
│   │   ├── admin/
│   │   └── database/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── assets/
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

### User

* id (UUID)
* name
* email
* password
* address
* role (Admin, Store Owner, User)

### Store

* id (UUID)
* name
* email
* address
* ownerId

### Rating

* id (UUID)
* userId
* storeId
* value (1–5)

**Constraint:** A user can rate a store only once.

---

## 🔐 Authentication & Security

* JWT Authentication
* Role-Based Access Control (RBAC)
* Password Hashing with Bcrypt
* Protected API Routes
* Request Validation using Class Validator

---

## 📡 API Modules

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

### Users

```http
POST  /api/users
GET   /api/users
GET   /api/users/:id
PATCH /api/users/me/password
```

### Stores

```http
GET  /api/stores
GET  /api/stores/:id
POST /api/stores
GET  /api/stores/owner/dashboard
```

### Ratings

```http
POST  /api/ratings
PATCH /api/ratings/:storeId
GET   /api/ratings/stats
```

### Admin

```http
GET /api/admin/dashboard
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/store-ratings-system.git
cd store-ratings-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=store_ratings

JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Run migrations and seed data:

```bash
npm run migration:run
npm run seed
npm run start:dev
```

Backend runs at:

```text
http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🔑 Default Admin Account

```text
Email    : admin@example.com
Password : Admin@123
```

---

## 📜 Available Scripts

### Backend

```bash
npm run start:dev
npm run build
npm run migration:run
npm run migration:revert
npm run seed
npm run test
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

## 🎯 Key Highlights

* Full-Stack Monorepo Architecture
* Role-Based Access Control (RBAC)
* Secure JWT Authentication
* PostgreSQL Database
* Store Rating Management
* Real-Time Dashboard Analytics
* Responsive UI with Tailwind CSS
* Production-Ready Code Structure

---

## 👨‍💻 Author

**Jayesh Ghevare**

🌐 Portfolio: https://jayesh-ghevare.vercel.app

💼 LinkedIn: https://linkedin.com/in/jayesh-ghevare

🐙 GitHub: https://github.com/jayeshghevare
