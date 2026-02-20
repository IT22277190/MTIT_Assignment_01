# Task Management Project

This project is a simple Task Management application with:
- **FastAPI backend** for CRUD APIs using an in-memory task list.
- **React frontend** to list tasks, add new tasks, edit existing tasks, and delete tasks.

## Frontend Setup (React + Vite)

Open a terminal in the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend app:

```bash
npm run dev
```

The frontend runs at: `http://localhost:5173` (or the next available port such as `5174`)

## Backend Setup (FastAPI)

Install dependencies:

```bash
pip install fastapi uvicorn
```

Start the API server (from the folder containing `main.py`):

```bash
uvicorn main:app --reload
```

The backend runs at: `http://localhost:8000`

## Frontend Features

- Display all tasks in a responsive card grid.
- Add a task using a form (`title`, `description`, `is_completed`).
- Edit a task using the same form in edit mode.
- Delete a task from each card.

## API Endpoints (`/tasks`)

- `GET /tasks` - Return all tasks.
- `POST /tasks` - Create a new task (requires `id`, `title`, `description`, `is_completed`).
- `PUT /tasks/{task_id}` - Update an existing task by ID.
- `DELETE /tasks/{task_id}` - Delete a task by ID.
