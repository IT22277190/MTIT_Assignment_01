from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class Task(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool


tasks: List[Task] = []


@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: Task):
    if any(existing_task.id == task.id for existing_task in tasks):
        raise HTTPException(status_code=400, detail="Task with this ID already exists")
    tasks.append(task)
    return task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks[index] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            del tasks[index]
            return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")
