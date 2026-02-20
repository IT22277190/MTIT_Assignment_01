from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the allowed origins (e.g., ["http://localhost:5173"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Task Model
class Task(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool

# In-memory storage
tasks: List[Task] = []

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    """Retrieve all tasks."""
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    """Retrieve a specific task by ID."""
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    """Create a new task."""
    # Check if ID already exists to prevent duplicates
    for t in tasks:
        if t.id == task.id:
            raise HTTPException(status_code=400, detail="Task with this ID already exists")
    
    tasks.append(task)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    """Update an existing task."""
    for index, task in enumerate(tasks):
        if task.id == task_id:
            # Update the task at the found index
            # Ensure the ID in the updated object matches the URL or remains consistent
            if task_id != updated_task.id:
                 raise HTTPException(status_code=400, detail="Path ID and Request Body ID must match")
            
            tasks[index] = updated_task
            return updated_task
            
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Delete a task."""
    for index, task in enumerate(tasks):
        if task.id == task_id:
            del tasks[index]
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")
