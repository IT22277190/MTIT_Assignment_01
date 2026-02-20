import { useEffect, useState } from 'react'

const TaskBoard = () => {
  const emptyForm = {
    title: '',
    description: '',
    is_completed: false,
  }

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('http://localhost:8000/tasks')

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const getNextTaskId = () => {
    if (tasks.length === 0) {
      return 1
    }

    return Math.max(...tasks.map((task) => task.id)) + 1
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingTaskId(null)
  }

  const handleAddTask = async (event) => {
    event.preventDefault()

    const trimmedTitle = formData.title.trim()
    const trimmedDescription = formData.description.trim()

    if (!trimmedTitle || !trimmedDescription) {
      setError('Title and description are required')
      return
    }

    const taskPayload = {
      id: getNextTaskId(),
      title: trimmedTitle,
      description: trimmedDescription,
      is_completed: formData.is_completed,
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to add task')
      }

      const createdTask = await response.json()
      setTasks((prevTasks) => [...prevTasks, createdTask])
      resetForm()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditTask = (task) => {
    setError('')
    setEditingTaskId(task.id)
    setFormData({
      title: task.title,
      description: task.description,
      is_completed: task.is_completed,
    })
  }

  const handleUpdateTask = async (event) => {
    event.preventDefault()

    if (editingTaskId === null) {
      return
    }

    const trimmedTitle = formData.title.trim()
    const trimmedDescription = formData.description.trim()

    if (!trimmedTitle || !trimmedDescription) {
      setError('Title and description are required')
      return
    }

    const taskPayload = {
      id: editingTaskId,
      title: trimmedTitle,
      description: trimmedDescription,
      is_completed: formData.is_completed,
    }

    try {
      setIsSubmitting(true)
      setError('')

      const response = await fetch(`http://localhost:8000/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingTaskId ? updatedTask : task))
      )
      resetForm()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (taskId) => {
    try {
      setError('')
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  if (loading) {
    return <p className='text-slate-300'>Loading tasks...</p>
  }

  return (
    <div className='min-h-screen bg-slate-900 text-slate-100 p-6'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <section className='bg-slate-800 border border-slate-700 rounded-xl p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            {editingTaskId === null ? 'Add New Task' : 'Edit Task'}
          </h2>

          <form
            onSubmit={editingTaskId === null ? handleAddTask : handleUpdateTask}
            className='space-y-4'
          >
            <input
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              placeholder='Task title'
              className='w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />

            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Task description'
              rows={3}
              className='w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />

            <label className='inline-flex items-center gap-2 text-slate-300'>
              <input
                type='checkbox'
                name='is_completed'
                checked={formData.is_completed}
                onChange={handleInputChange}
                className='h-4 w-4 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-2 focus:ring-indigo-500'
              />
              Mark as completed
            </label>

            {error && <p className='text-sm text-rose-400'>{error}</p>}

            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800'
              >
                {isSubmitting
                  ? 'Saving...'
                  : editingTaskId === null
                    ? 'Add Task'
                    : 'Update Task'}
              </button>

              {editingTaskId !== null && (
                <button
                  type='button'
                  onClick={resetForm}
                  className='rounded-lg border border-slate-600 px-4 py-2.5 text-slate-300 transition hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {tasks.map((task) => (
            <article
              key={task.id}
              className='bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4'
            >
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-slate-100'>{task.title}</h3>
                <p className='text-sm text-slate-300'>{task.description}</p>
              </div>

              <label className='inline-flex items-center gap-2 text-sm text-slate-300'>
                <input
                  type='checkbox'
                  checked={task.is_completed}
                  readOnly
                  className='h-4 w-4 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-2 focus:ring-indigo-500'
                />
                Completed
              </label>

              <div className='flex gap-2'>
                <button
                  onClick={() => startEditTask(task)}
                  className='rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800'
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className='rounded-lg border border-rose-400/30 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800'
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskBoard
