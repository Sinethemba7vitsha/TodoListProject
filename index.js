let editTaskId = null; // Store the task ID being edited

// Fetch and display all tasks from the backend
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the list

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.setAttribute('data-id', task._id);

      // Add 'completed' class if the task is marked as done
      if (task.completed) {
        li.classList.add('completed');
      }

      // Checkbox to mark as done
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.classList.add('done-checkbox');
      checkbox.onchange = () => toggleDone(task._id);

      const taskText = document.createElement('span');
      taskText.textContent = task.description;
      taskText.classList.add('task-text');

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit-btn');
      editBtn.onclick = () => openModal(task._id, task.description);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.onclick = () => deleteTask(task._id);

      // Append elements to the task item
      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// Open the edit modal with the task description
function openModal(taskId, currentDescription) {
  editTaskId = taskId; // Set the task ID to be edited
  document.getElementById('editTaskInput').value = currentDescription;
  document.getElementById('editModal').style.display = 'flex';
}

// Close the modal
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
  editTaskId = null;
}

// Save the edited task
async function saveEdit() {
  const newDescription = document.getElementById('editTaskInput').value.trim();
  if (!newDescription) return; // Prevent saving if the input is empty

  try {
    // Make a PUT request to update the task
    const response = await fetch(`http://localhost:3000/tasks/${editTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: newDescription }),
    });

    // Check if the update was successful
    if (response.ok) {
      closeModal(); // Close the modal on success
      fetchTasks(); // Refresh the task list
    } else {
      console.error('Failed to save task');
    }
  } catch (error) {
    console.error('Error saving task:', error);
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

    await response.json();
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

// Toggle task completion status
async function toggleDone(taskId) {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}/toggle`, {
      method: 'PUT',
    });

    if (response.ok) {
      fetchTasks(); // Refresh the task list to reflect the change
    } else {
      console.error('Failed to toggle task status');
    }
  } catch (error) {
    console.error('Error toggling task status:', error);
  }
}

// Initialize the task list when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);
