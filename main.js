document.addEventListener('DOMContentLoaded', () => {
    const createTaskForm = document.getElementById('createTaskForm');
    const taskList = document.getElementById('taskList');
  
    // Function to fetch all tasks and render them in the task list
    const fetchTasks = async () => {
      try {
        const response = await fetch('/tasks');
        const tasks = await response.json();
  
        taskList.innerHTML = '';
  
        tasks.forEach(task => {
          const listItem = document.createElement('li');
          listItem.textContent = `ID: ${task.id}, Title: ${task.task}, Priority: ${task.taskPriority}`;
          taskList.appendChild(listItem);
        });
      } catch (error) {
        console.error(error);
      }
    };
  
    // Event listener for form submission to create a new task
    createTaskForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const taskTitle = document.getElementById('taskTitle').value;
      const taskDetails = document.getElementById('taskDetails').value;
      const taskPriority = document.getElementById('taskPriority').value;
  
      try {
        const response = await fetch('/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            task: taskTitle,
            details: taskDetails,
            taskPriority: taskPriority
          })
        });
  
        if (response.ok) {
          console.log('Task created successfully');
          createTaskForm.reset();
          fetchTasks();
        } else {
          console.error('Failed to create task');
        }
      } catch (error) {
        console.error(error);
      }
    });
  
    // Fetch all tasks when the page loads
    fetchTasks();
  });
  