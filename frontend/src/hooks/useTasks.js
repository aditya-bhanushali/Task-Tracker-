import { useState, useEffect, useCallback } from 'react'
import { STATUS } from '../constants'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks'

// Helper to map MongoDB _id to frontend id
const mapTask = (task) => {
  if (!task) return task;
  return {
    ...task,
    id: task._id,
  };
};

export function useTasks() {
  const [tasks, setTasks] = useState([])

  // Fetch all tasks from backend on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await response.json()
        setTasks(data.map(mapTask))
      } catch (error) {
        console.error('Error loading tasks from backend:', error)
      }
    }
    fetchTasks()
  }, [])

  const addTask = useCallback(
    async (taskData) => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to add task')
        }

        const newTask = await response.json()
        const mapped = mapTask(newTask)
        setTasks((prev) => [mapped, ...prev])
        return mapped
      } catch (error) {
        console.error('Error adding task:', error)
        throw error
      }
    },
    []
  )

  const updateTask = useCallback(
    async (id, updates) => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to update task')
        }

        const updated = await response.json()
        const mapped = mapTask(updated)
        setTasks((prev) => prev.map((t) => (t.id === id ? mapped : t)))
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },
    []
  )

  const deleteTask = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Failed to delete task')
        }

        setTasks((prev) => prev.filter((t) => t.id !== id))
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },
    []
  )

  const restoreTask = useCallback(
    async (task, originalIndex) => {
      try {
        // Strip out ID properties so backend treats it as a new task
        const { id, _id, createdAt, updatedAt, ...rest } = task
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rest),
        })

        if (!response.ok) {
          throw new Error('Failed to restore task')
        }

        const restored = await response.json()
        const mapped = mapTask(restored)

        setTasks((prev) => {
          const next = [...prev]
          const safeIndex = Math.min(originalIndex, next.length)
          next.splice(safeIndex, 0, mapped)
          return next
        })
      } catch (error) {
        console.error('Error restoring task:', error)
      }
    },
    []
  )

  const toggleStatus = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const newStatus = task.status === STATUS.COMPLETED ? STATUS.TODO : STATUS.COMPLETED
      await updateTask(id, { status: newStatus })
    },
    [tasks, updateTask]
  )

  const setPriority = useCallback(
    async (id, priority) => {
      await updateTask(id, { priority })
    },
    [updateTask]
  )

  const setStatus = useCallback(
    async (id, status) => {
      await updateTask(id, { status })
    },
    [updateTask]
  )

  return { tasks, addTask, updateTask, deleteTask, restoreTask, toggleStatus, setPriority, setStatus }
}
