from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI(title="Task Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------

class TaskCreate(BaseModel):
    title: str

class Task(BaseModel):
    id: str
    title: str
    completed: bool = False

# ---------- IN-MEMORY STORAGE ----------
tasks: List[Task] = []

# ---------- APIs ----------

# Add a task
@app.post("/tasks", response_model=Task)
def add_task(task: TaskCreate):
    new_task = Task(
        id=str(uuid.uuid4()),
        title=task.title,
        completed=False
    )
    tasks.append(new_task)
    return new_task


@app.get("/")
def root():
    return {
        "message": "Task Board FastAPI Backend is running",
        "docs": "/docs",
        "tasks": "/tasks"
    }

# List all tasks
@app.get("/tasks", response_model=List[Task])
def list_tasks():
    return tasks


# Mark task complete / incomplete
@app.put("/tasks/{task_id}", response_model=Task)
def toggle_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            task.completed = not task.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")


# Delete a task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global tasks
    tasks = [task for task in tasks if task.id != task_id]
    return {"message": "Task deleted successfully"}
