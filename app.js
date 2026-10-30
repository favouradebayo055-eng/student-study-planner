// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskSubjectInput = document.getElementById('task-subject');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const validationMsg = document.getElementById('validation-msg');

// Load tasks from localStorage or initialize empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initial render
renderTasks();

// Event Listener for Adding Tasks
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const subject = taskSubjectInput.value.trim() || 'General Study';

  // Validation: Blank title check
  if (!title) {
    showValidation('Please enter a valid task title.');
    return;
  }

  // Create Task Object
  const newTask = {
    id: Date.now().toString(),
    title: title,
    subject: subject,
    completed: false
  };

  // Add to array & update localStorage
  tasks.push(newTask);
  saveTasks();

  // Reset Form
  taskTitleInput.value = '';
  taskSubjectInput.value = '';
  hideValidation();

  renderTasks();
});

// Render Tasks Function
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <div class="task-info">
          <span class="task-title">${escapeHTML(task.title)}</span>
          <span class="task-subject">📘 ${escapeHTML(task.subject)}</span>
        </div>
        <div class="task-actions">
          <button class="btn-complete" onclick="toggleTask('${task.id}')">
            ${task.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="btn-delete" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  }
}

// Toggle Task Completion State
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Delete Task Function
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper: Show Validation Alert
function showValidation(message) {
  validationMsg.textContent = message;
  validationMsg.style.display = 'block';
}

// Helper: Hide Validation Alert
function hideValidation() {
  validationMsg.style.display = 'none';
}

// Helper: Prevent HTML Injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}