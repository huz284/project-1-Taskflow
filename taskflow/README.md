# TaskFlow — Production-Ready Task Management System

A full-stack task management application built with **Next.js 15**, **TypeScript**, **MongoDB**, and a premium dark UI aesthetic.

## ✨ Features

### Authentication
- JWT-based signup & login
- Password hashing with bcrypt (12 salt rounds)
- Protected API routes
- Auto-redirect logic for authenticated/unauthenticated users

### Tasks
- Create / edit / delete tasks
- Toggle completion with optimistic UI updates
- Priority levels: Low, Medium, High (with color coding)
- Due dates with overdue & due-soon detection
- Rich task cards with hover actions

### Dashboard UI
- Stats cards (total, completed, pending, high priority)
- Overall progress bar with completion rate
- Grid and list view modes
- Real-time search across title + description
- Sort by: date created, due date, priority, title
- Filter sidebar (all, pending, completed, high priority)
- Staggered animations & micro-interactions
- Responsive design (mobile → desktop)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Tailwind CSS |
| Fonts | Syne (display) + DM Sans (body) |
| Animations | CSS keyframes + Tailwind |
| Toast | react-hot-toast |
| Icons | Lucide React |

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your-super-secret-key-minimum-32-chars-long
```

**MongoDB Setup:**
1. Go to [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for Vercel)
5. Get connection string → paste as MONGODB_URI

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment on Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial TaskFlow setup"
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key (generate with `openssl rand -base64 32`)
5. Click **Deploy**

That's it! Vercel auto-deploys on every push to main.

## 📁 Project Structure

```
taskflow/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # POST /api/auth/login
│   │   │   └── register/route.ts  # POST /api/auth/register
│   │   └── tasks/
│   │       ├── route.ts           # GET, POST /api/tasks
│   │       └── [id]/route.ts      # GET, PATCH, DELETE /api/tasks/:id
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   ├── TaskCard.tsx
│   └── CreateTaskModal.tsx
├── lib/
│   ├── mongodb.ts     # DB connection with caching
│   ├── auth.ts        # JWT utilities
│   └── utils.ts       # Helpers + cn()
├── models/
│   ├── User.ts        # Mongoose User schema
│   └── Task.ts        # Mongoose Task schema
└── types/
    └── index.ts       # TypeScript interfaces
```

## 🔌 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password}` | Create account |
| POST | `/api/auth/login` | `{email, password}` | Sign in |

### Tasks (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| POST | `/api/tasks` | Create new task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

**GET /api/tasks query params:**
- `status` — `pending` | `completed`
- `priority` — `low` | `medium` | `high`
- `sort` — `createdAt` | `dueDate` | `priority` | `title`

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- All task routes verify token ownership (users can only access their own tasks)
- MongoDB indexes on userId for performance

## 📝 License

MIT © TaskFlow
