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

