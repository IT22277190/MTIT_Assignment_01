# Task Management Project

A simple full-stack task management application connecting a **FastAPI** backend with a **React** frontend component.

## 🚀 Features
- **Backend:** Python FastAPI using an in-memory list for storage.
- **Frontend:** React component (`TaskBoard.jsx`) displaying tasks in a grid layout.
- **Functionality:** Create, Read, Update, and Delete (CRUD) tasks.

## 🛠️ Setup & Installation

### Backend (FastAPI)

1.  **Install Dependencies**
    ```bash
    pip install fastapi uvicorn
    ```

2.  **Start the Server**
    Run the following command in your terminal:
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### Frontend (React)

1.  **Navigate to the frontend directory**
    ```bash
    cd frontend
    ```
2.  **Install Dependencies** (if not already installed)
    ```bash
    npm install
    ```
3.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📡 API Endpoints

The backend provides the following RESTful endpoints at `http://localhost:8000`:

| Method | Endpoint          | Description               |
| :----- | :---------------- | :------------------------ |
| `GET`  | `/tasks`          | Retrieve all tasks        |
| `GET`  | `/tasks/{id}`     | Retrieve a specific task  |
| `POST` | `/tasks`          | Create a new task         |
| `PUT`  | `/tasks/{id}`     | Update an existing task   |
| `DELETE`| `/tasks/{id}`    | Delete a task             |

> **Note:** Since this uses in-memory storage, all data will be reset when the server restarts.
