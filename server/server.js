const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection string (with URL-encoded password)
const mongoURI = 'mongodb+srv://vitsha:VITSHa%4097@todolist.o8nhn.mongodb.net/?retryWrites=true&w=majority&appName=Todolist';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

// Task schema and model
const taskSchema = new mongoose.Schema({ 
  description: String,
  completed: { type: Boolean, default: false }  // New field for task completion status
});
const Task = mongoose.model('Task', taskSchema);

app.put('/tasks/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Update task description
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { description: req.body.description },
      { new: true } // Return the updated task
    );

    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});


// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ description: req.body.description });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
