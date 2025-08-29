const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
let currentFilter = "all";

// Load tasks + theme from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => renderTask(task.text, task.completed));

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  applyFilter();
};

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Please enter a task!");
  
  renderTask(taskText, false);
  saveTasks();
  applyFilter();
  taskInput.value = "";
}

// Render Task
function renderTask(text, completed) {
  const li = document.createElement("li");
  li.textContent = text;
  if (completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
    applyFilter();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.classList.add("delete-btn");
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

// Save Tasks
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-box button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`filter-${filter}`).classList.add("active");
  applyFilter();
}

function applyFilter() {
  const searchQuery = searchInput.value.toLowerCase();

  document.querySelectorAll("#taskList li").forEach(li => {
    let matchesFilter = false;

    switch (currentFilter) {
      case "all":
        matchesFilter = true;
        break;
      case "pending":
        matchesFilter = !li.classList.contains("completed");
        break;
      case "completed":
        matchesFilter = li.classList.contains("completed");
        break;
    }

    let matchesSearch = li.firstChild.textContent.toLowerCase().includes(searchQuery);

    li.style.display = (matchesFilter && matchesSearch) ? "flex" : "none";
  });
}

// 🌙 Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// 🔍 Search Filter
searchInput.addEventListener("input", applyFilter);
