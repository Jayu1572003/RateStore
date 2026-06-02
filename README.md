# Store Ratings & Review System

A premium, full-stack Store Rating and Review web application built with a modern, high-performance tech stack. The system supports multi-role access (Admin, Store Owner, and Normal User) with secure JWT-based authentication, real-time statistical dashboards, store management, and rating controls.

---

## 🚀 Technology Stack

### Backend
* **Framework:** [NestJS](https://nestjs.com/) (Node.js framework)
* **Language:** TypeScript
* **Database ORM:** [TypeORM](https://typeorm.io/)
* **Database:** PostgreSQL
* **Authentication:** Passport.js with JWT Strategy
* **Security:** Bcrypt (password hashing)
* **Validation:** Class-validator & Class-transformer

### Frontend
* **Library:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vite.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Routing:** [React Router v7](https://reactrouter.com/)
* **Data Fetching & State:** [TanStack React Query v5](https://tanstack.com/query/latest)
* **HTTP Client:** Axios (with request/response interceptors for automatic JWT authorization and session expiration)
* **Form Management:** React Hook Form
* **Schema Validation:** Zod

---

## 👥 Role-Based Features

The application operates on three distinct user roles, each with a tailored workspace and set of capabilities:

| Role | Permissions & Features | Screen / View |
| :--- | :--- | :--- |
| **System Administrator** | • View system-wide stats (total stores, total users, total reviews)<br>• Manage users (list, search, filter, register new users, view details)<br>• Manage stores (add new stores, edit store info, assign owners, delete stores) | Admin Dashboard, User Management, Store Management |
| **Store Owner** | • View store-specific dashboard stats (average rating, review counts)<br>• View a list of stores owned by them<br>• View detailed feedback & reviews for their stores | Store Owner Dashboard, Store Detailed Reviews |
| **Normal User** | • Browse the list of all stores and search/filter them<br>• View overall ratings for stores<br>• Rate stores (1 to 5 stars) or update their existing rating | User Store Directory, Rate Store Dialog |

---

## 📂 Repository Structure

The project is structured as a monorepo containing separate frontend and backend workspaces:

```
FullStack Task/
├── backend/                  # NestJS API Backend
│   ├── src/
│   │   ├── admin/            # Admin metrics & statistics module
│   │   ├── auth/             # Passport/JWT login, register & session guards
│   │   ├── common/           # Interceptors, filters, and utilities
│   │   ├── database/         # Database datasource config & seed scripts
│   │   ├── migrations/       # TypeORM migration history
│   │   ├── ratings/          # Rating CRUD and validation module
│   │   ├── stores/           # Store CRUD and owner association module
│   │   └── users/            # User account management module
│   ├── test/                 # Integration and unit tests
│   └── package.json
│
└── frontend/                 # React Single Page Application (SPA)
    ├── src/
    │   ├── assets/           # Static logo & visual assets
    │   ├── components/       # Reusable components (Navbar, ProtectedRoute, etc.)
    │   ├── contexts/         # React Contexts (AuthContext, ToastContext)
    │   ├── lib/              # API Client configured with Axios
    │   ├── pages/            # Page templates (Login, Register, Owner/Admin Dashboards)
    │   └── App.tsx           # Router configuration and app core
    └── package.json
```

---

## 🗄️ Database Schema & Entities

The application uses **PostgreSQL** with three core entities configured via TypeORM:

### 1. User Entity (`users`)
Represents system accounts (Admin, Store Owner, or Normal User).
* `id`: UUID (Primary Key)
* `name`: Varchar (60)
* `email`: Varchar (255, Unique)
* `password`: Varchar (255, Hashed)
* `address`: Text
* `role`: Enum (`admin`, `store_owner`, `normal_user`)
* `created_at`: Timestamp
* `updated_at`: Timestamp

### 2. Store Entity (`stores`)
Represents shops/stores added to the directory.
* `id`: UUID (Primary Key)
* `name`: Varchar (60)
* `email`: Varchar (255, Unique)
* `address`: Text
* `owner_id`: UUID (Foreign Key pointing to `users`, nullable, deletes set to `SET NULL`)
* `created_at`: Timestamp
* `updated_at`: Timestamp

### 3. Rating Entity (`ratings`)
Represents store reviews/ratings left by Normal Users.
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key pointing to `users`, cascades on delete)
* `store_id`: UUID (Foreign Key pointing to `stores`, cascades on delete)
* `value`: SmallInt (1 to 5)
* `created_at`: Timestamp
* `updated_at`: Timestamp
* **Constraint:** A unique composite index `["user_id", "store_id"]` ensures a user can only rate a single store once.

---

## 🔌 API Endpoints Documentation

All backend API routes are prefixed with `/api`. Most endpoints are protected and require a `Bearer <JWT_TOKEN>` header.

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new User.
* `POST /api/auth/login` - Authenticate using email and password. Returns JWT token.
* `POST /api/auth/logout` - Clear user session.
* `GET /api/auth/profile` - Fetch the profile details of the logged-in user.

### Users Management (`/api/users`)
* `POST /api/users` - Create a new user account *(Admin Only)*.
* `GET /api/users` - Fetch users list with filter support *(Admin Only)*.
* `GET /api/users/:id` - Fetch detailed details of a user *(Admin Only)*.
* `PATCH /api/users/me/password` - Change the current user's password *(Authenticated)*.

### Stores Management (`/api/stores`)
* `GET /api/stores` - Get list of all stores. If logged-in as a `NORMAL_USER`, it includes the user's specific rating details for each store *(Authenticated)*.
* `GET /api/stores/owner/dashboard` - Get dashboard statistics for the logged-in owner's stores *(Store Owner Only)*.
* `GET /api/stores/:id` - Get details of a single store *(Authenticated)*.
* `POST /api/stores` - Create a new store *(Admin Only)*.

### Ratings (`/api/ratings`)
* `POST /api/ratings` - Submit a new store rating (1-5) *(Normal User Only)*.
* `PATCH /api/ratings/:storeId` - Update an existing store rating *(Normal User Only)*.
* `GET /api/ratings/stats` - Get system-wide rating count stats *(Admin Only)*.

### Admin Tools (`/api/admin`)
* `GET /api/admin/dashboard` - Fetch total counts of stores, users, and ratings *(Admin Only)*.

---

## 🛠️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **PostgreSQL** instance running locally or on a cloud platform

---

### Step 1: Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of the `/backend` folder based on `.env.example`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=your_postgres_password
   DB_NAME=store_ratings
   JWT_SECRET=your_jwt_secret_min_32_chars_long_and_secure
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   ```

4. Create the Database:
   Create a database named `store_ratings` in your PostgreSQL server (e.g., using pgAdmin or terminal `psql`).

5. Run Database Migrations:
   Compile the code and execute migrations to create tables:
   ```bash
   npm run migration:run
   ```

6. Seed Database:
   Generate the default Administrator account:
   ```bash
   npm run seed
   ```
   *Note: This creates the default Admin account:*
   * **Email:** `admin@example.com`
   * **Password:** `Admin@123`

7. Start the Development Server:
   ```bash
   npm run start:dev
   ```
   The backend API will start on `http://localhost:3000`.

---

### Step 2: Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root of the `/frontend` folder:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the Frontend Dev Server:
   ```bash
   npm run dev
   ```
   The frontend UI will be running on `http://localhost:5173` (or the next available port displayed in the console).

---

## 🔐 Default Admin Account
To log in immediately after setup:
* **URL:** `http://localhost:5173/login`
* **Email:** `admin@example.com`
* **Password:** `Admin@123`
From the Admin Dashboard, you can register new store owners and normal users, or create and assign stores.

---

## 📁 Development Scripts

### Backend (`/backend`)
* `npm run start:dev` - Starts the API server with live watch mode.
* `npm run build` - Compiles the TypeScript code to `/dist`.
* `npm run migration:run` - Runs pending database migrations.
* `npm run migration:revert` - Reverts the last migration.
* `npm run seed` - Seeds the database with default administrator credentials.
* `npm run test` - Runs unit tests.

### Frontend (`/frontend`)
* `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
* `npm run build` - Compiles React components and TypeScript files into an optimized production build.
* `npm run preview` - Runs a local web server to preview the production build.
* `npm run lint` - Runs ESLint to find and fix styling or code-quality issues.
#   R a t e S t o r e  
 