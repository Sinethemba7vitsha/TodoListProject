// Fetch and display all tasks from the backend
async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const tasks = await response.json();
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = ''; // Clear the list
  
      // Display each task
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.description;
  
        // Create a delete button for each task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task._id);
        li.appendChild(deleteBtn);
  
        taskList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  
  // Add a new task to the backend
  async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const description = taskInput.value.trim();
  
    if (!description) {
      alert('Please enter a task description');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
  
      const newTask = await response.json();
      taskInput.value = ''; // Clear the input field
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  
  // Delete a task from the backend
  async function deleteTask(taskId) {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  // Initialize the task list when the page loads
  document.addEventListener('DOMContentLoaded', fetchTasks);
  