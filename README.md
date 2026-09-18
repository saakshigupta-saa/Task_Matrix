# 🚀 TaskMatrix

### Agile Project Management Platform

TaskMatrix is a full-stack Agile project management platform designed to help software teams manage projects, tasks, team members, deadlines, progress, notifications, and team activity in one place.

---

## 👩‍💻 Track

**Fullstack Developer**

---
## 📸 Screenshots

###  Dashboard :
<img width="1892" height="980" alt="Screenshot 2026-09-18 200913" src="https://github.com/user-attachments/assets/3c1c4d4f-ad44-4f8f-a3de-fbe36403ffb3" />

###  Projects:
<img width="1917" height="990" alt="Screenshot 2026-09-18 201004" src="https://github.com/user-attachments/assets/d57698d1-f14a-415b-9187-881cf32cb570" />

### Tasks:
<img width="1917" height="978" alt="Screenshot 2026-09-18 201018" src="https://github.com/user-attachments/assets/b89f0b86-bf76-46e9-b9e9-818fa4975d13" />

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected application routes
* Secure password hashing using bcrypt

### 📁 Project Management

* Create projects
* Edit projects
* Delete projects
* Add team members by email
* View project members
* Track project task count
* Track project completion progress

### 📋 Task Management

* Create tasks
* Edit tasks
* Delete tasks
* Assign tasks to team members
* Set task priority
* Set task deadlines
* Update task status
* View detailed task information

### 📌 Kanban Board

Tasks are organized into:

* 📝 To Do
* 🔄 In Progress
* ✅ Done

Tasks can be moved between columns using drag-and-drop.

### ⚡ Real-Time Updates

Task status updates are supported using **Socket.IO**, allowing connected clients to receive task updates without manually refreshing the page.

### 👥 Team Management

* View project team members
* Display member names and email addresses
* Assign tasks to project members

### 🔔 Notifications

* Task assignment notifications
* Notification list
* Unread notification indicator
* Mark notifications as read

### 📝 Activity Feed

* Track project activities
* Record task creation
* Record task status changes
* Display recent project activity

### 📊 Dashboard

The dashboard provides:

* Total projects
* Total tasks
* Completed tasks
* Overdue tasks
* Active project progress
* Upcoming deadlines
* Recent activity

### 🤖 AI Productivity Feature

TaskMatrix includes a prepared **OpenAI-powered AI task assistant**.

The AI feature is designed to convert a task idea into:

* Clear task title
* Detailed description
* Suggested subtasks
* Suggested priority

The backend AI integration is prepared and can be used when an OpenAI API account with available credits is configured.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* Zustand
* Socket.IO Client
* @dnd-kit/core
* @dnd-kit/sortable
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Socket.IO
* OpenAI API

---

## 🗄️ Database

TaskMatrix uses MongoDB with the following collections:

### Users

Stores registered user information and authentication details.

### Projects

Stores project information, ownership, and team members.

### Tasks

Stores task information including:

* Project
* Assignee
* Status
* Priority
* Deadline

### Activities

Stores project activity history.

### Notifications

Stores user notifications and read/unread status.

---

## 🏗️ Application Architecture

```text
                    ┌──────────────────┐
                    │   React + Vite   │
                    │   Tailwind CSS   │
                    └────────┬─────────┘
                             │
                      Axios / REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │  Node + Express  │
                    │    REST APIs     │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
          ┌──────────────┐        ┌──────────────┐
          │   MongoDB    │        │  Socket.IO   │
          │   Database   │        │ Real-time    │
          └──────────────┘        └──────────────┘
```

---

## 📂 Project Structure

```text
Task_Matrix/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   ├── server.js
│   └── package.json
│
├── README.md
└── Prompts.md
```

---

## 🔄 Application Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
JWT Authentication
 │
 ▼
Dashboard
 │
 ├── Projects
 │     ├── Create Project
 │     ├── Edit Project
 │     ├── Add Members
 │     └── Track Progress
 │
 ├── Tasks
 │     ├── Create Task
 │     ├── Assign Member
 │     ├── Set Priority
 │     ├── Set Deadline
 │     └── Kanban Drag & Drop
 │
 ├── Team
 │
 ├── Notifications
 │
 └── Activity Feed
```

---

## 📱 Responsive Design

TaskMatrix is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

Responsive improvements include:

* Mobile-friendly navigation
* Responsive project cards
* Responsive dashboard cards
* Mobile-friendly forms
* Responsive buttons
* Mobile Kanban layout
* Text wrapping for long content

---

## 📅 Development Roadmap

### Sprint 13 — Planning & Architecture

* Project planning
* PRD
* Database planning
* Application architecture
* UI planning

### Sprint 14 — MVP Development

* Authentication
* Project management
* Task management
* Kanban board

### Sprint 15 — Feature Completion

* Team management
* Task assignment
* Activity feed
* Notifications
* Progress tracking
* Drag-and-drop

### Sprint 16 — AI & UX

* OpenAI integration
* AI productivity assistant
* Responsive UI
* UX improvements
* Socket.IO real-time updates

### Sprint 17 — Testing & Deployment

* Final testing
* Deployment
* CI/CD
* Documentation
* Final demo preparation

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/saakshigupta-saa/Task_Matrix.git
cd Task_Matrix
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🔒 Security

TaskMatrix uses:

* bcrypt for password hashing
* JWT for authentication
* Protected API routes
* Project membership authorization
* Environment variables for sensitive credentials

**Never commit `.env` files or API keys to GitHub.**

---

## 🚀 Future Improvements

* AI task assistant frontend
* Advanced project analytics
* Real-time notifications
* Socket.IO project-specific rooms
* Email notifications
* Advanced role-based permissions
* Automated testing
* Production deployment
* CI/CD pipeline

---

## 👩‍💻 Author

**Sakshi Gupta**

GitHub: https://github.com/saakshigupta-saa

---

## 📌 Repository

**TaskMatrix**

https://github.com/saakshigupta-saa/Task_Matrix
