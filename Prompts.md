# 🤖 Prompts.md

## TaskMatrix — AI Usage Documentation

This document records the prompts used during the development of **TaskMatrix**, a full-stack Agile project management platform.

AI assistance was used as a **learning, debugging, and development-support tool** to understand concepts, troubleshoot issues, review implementation approaches, and improve the application.

The developer reviewed, implemented, tested, and integrated the changes into the TaskMatrix project.

---

# 1. Project Planning & Architecture

### Prompt

```text
I am building a full-stack Agile project management application called TaskMatrix.

Help me plan the project architecture, major features, frontend pages, backend APIs, database collections, and development roadmap.

The application should support users, projects, tasks, team members, notifications, activity tracking, and real-time updates.
```

### Purpose

Used to understand the overall architecture and divide the project into manageable development stages.

---

# 2. MongoDB Database Design

### Prompt

```text
For a project management application with Users, Projects, Tasks, Activities, and Notifications collections, explain how these MongoDB collections should be structured and related using Mongoose references.
```

### Purpose

Used to understand MongoDB schema design and relationships between collections.

---

# 3. Express.js REST API

### Prompt

```text
Explain how to structure REST API routes and controllers in an Express.js application for creating, reading, updating, and deleting projects and tasks.
```

### Purpose

Used to understand backend API organization and CRUD operations.

---

# 4. JWT Authentication

### Prompt

```text
Explain how JWT authentication works in a Node.js and Express.js application.

Show how registration and login can generate a JWT and how middleware can verify a Bearer token before allowing access to protected routes.
```

### Purpose

Used to understand authentication and protected backend routes.

---

# 5. Password Hashing

### Prompt

```text
Explain how bcrypt password hashing works in a Node.js registration and login system and why passwords should never be stored as plain text.
```

### Purpose

Used to understand secure password handling.

---

# 6. React and Axios API Integration

### Prompt

```text
Explain how to connect a React frontend to an Express REST API using Axios.

Include how to send a JWT token, handle loading states, handle errors, and display API data.
```

### Purpose

Used to understand frontend-backend communication.

---

# 7. Protected React Routes

### Prompt

```text
Explain how to create a ProtectedRoute component in React Router that checks whether a JWT token exists in localStorage and redirects unauthenticated users to the login page.
```

### Purpose

Used to understand frontend route protection.

---

# 8. Kanban Board

### Prompt

```text
Explain how to build a Kanban task board in React using @dnd-kit/core and @dnd-kit/sortable.

The board should have three columns:
To Do, In Progress, and Done.

Explain how dragging a task between columns can update its status.
```

### Purpose

Used to understand drag-and-drop functionality and Kanban task management.

---

# 9. Task Assignment

### Prompt

```text
Explain how a project management application can restrict task assignment so that a task can only be assigned to a user who belongs to that project.
```

### Purpose

Used to understand authorization and project-member validation.

---

# 10. Activity Feed

### Prompt

```text
Explain how to design an Activity collection for a project management application.

The activity should record the project, user, action, optional task, and creation time.

Give examples such as task creation and changing task status.
```

### Purpose

Used to understand activity tracking and audit-style records.

---

# 11. Notifications

### Prompt

```text
Explain how to implement user-specific notifications when a task is assigned to a team member.

The notification should contain the user, message, type, read/unread status, and timestamp.
```

### Purpose

Used to understand notification creation and user-specific notification retrieval.

---

# 12. Socket.IO Setup

### Prompt

```text
Explain how to integrate Socket.IO with an existing Express server and React frontend.

I want connected clients to receive real-time task updates when a task status changes.
```

### Purpose

Used to understand real-time communication between the frontend and backend.

---

# 13. Socket.IO Debugging

### Prompt

```text
My Socket.IO client connects successfully, but I need to make sure task updates are emitted from the backend after a task is updated and received by the React Tasks page.

Explain what I should check in:
1. server setup
2. socket configuration
3. task controller
4. React Socket.IO listener
5. cleanup when the component unmounts
```

### Purpose

Used to debug and verify the real-time task update flow.

---

# 14. Dashboard Calculations

### Prompt

```text
Explain how to calculate the following values from project and task data in a React dashboard:

- Total projects
- Total tasks
- Completed tasks
- Overdue tasks
- Project progress
- Upcoming deadlines
- Recent activity
```

### Purpose

Used to understand dashboard data processing and derived statistics.

---

# 15. Responsive UI

### Prompt

```text
Review this React and Tailwind CSS page and suggest improvements for mobile, tablet, and desktop responsiveness.

Preserve the existing functionality and focus on spacing, text wrapping, button layout, forms, cards, and overflow issues.
```

### Purpose

Used to improve responsive layouts across TaskMatrix pages.

---

# 16. Tailwind CSS UI Review

### Prompt

```text
Review this Tailwind CSS component for unnecessary styles, inconsistent spacing, excessive padding, text overflow, and mobile layout problems.

Suggest simple improvements while keeping the existing design and functionality.
```

### Purpose

Used during UI polish and responsive refinement.

---

# 17. OpenAI AI Task Assistant

### Prompt

```text
I am building an AI productivity feature for a project management application.

Explain how an OpenAI API endpoint in an Express.js backend could convert a user's task idea into a structured task containing:

1. A clear task title
2. A detailed description
3. 3 to 5 useful subtasks
4. Suggested priority: low, medium, or high

The response should be practical and concise.
```

### Purpose

Used to understand how the OpenAI API could be integrated into TaskMatrix as an AI-assisted productivity feature.

---

# 18. OpenAI API Error Debugging

### Prompt

```text
My OpenAI API request is returning a 429 error saying that there are no credits remaining.

Explain what this error means and what should be checked before changing the application code.
```

### Purpose

Used to understand the API usage/billing error and distinguish an account-credit issue from an application-code issue.

---

# 19. Git Workflow

### Prompt

```text
Explain a clean Git workflow for a full-stack project.

I want to make small logical commits instead of putting all project changes into one large commit.

Give examples of how frontend, backend, feature, bug-fix, and documentation changes can be committed separately.
```

### Purpose

Used to understand better version-control practices.

---

# 20. Code Debugging

### Prompt

```text
I have an existing React or Express.js component that is not behaving as expected.

Help me debug it step by step.

First identify the likely issue, explain why it happens, and then suggest the smallest change needed without unnecessarily rewriting the rest of the application.
```

### Purpose

Used as general debugging guidance during development.

---

# 21. Code Review

### Prompt

```text
Review this existing code for:

- bugs
- unnecessary changes
- duplicated logic
- responsive issues
- potential overflow
- maintainability

Preserve the existing functionality and suggest only relevant improvements.
```

### Purpose

Used to review existing implementation and improve code quality.

---

# 🧠 AI Usage Approach

AI was used throughout development as a **learning and debugging assistant**.

The development process involved:

```text
Understand Concept
       ↓
Ask AI for Explanation
       ↓
Review the Suggested Approach
       ↓
Implement the Feature
       ↓
Run and Test the Application
       ↓
Debug Issues
       ↓
Refine the Implementation
```

AI assistance was mainly used for:

* Understanding programming concepts
* Debugging development issues
* Understanding API integration
* Understanding Socket.IO
* Understanding database relationships
* Reviewing UI implementation
* Improving responsive design
* Understanding OpenAI API integration

The developer remained responsible for the project implementation, testing, integration, and final decisions.
