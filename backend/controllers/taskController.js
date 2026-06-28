import Task from '../models/Task.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    // Server-side validation for past due date
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(dueDate);
      if (inputDate < today) {
        return res.status(400).json({ message: 'Due date cannot be in the past' });
      }
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If updating due date, ensure it's not in the past
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(dueDate);
      if (inputDate < today) {
        return res.status(400).json({ message: 'Due date cannot be in the past' });
      }
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.priority = priority !== undefined ? priority : task.priority;
    task.status = status !== undefined ? status : task.status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};
