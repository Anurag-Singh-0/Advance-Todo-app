// Select elements
let taskInput = document.querySelector(".taskInput input");
let taskBox = document.querySelector(".task-box");
let filters = document.querySelectorAll(".filters span");
let clearAllTodos = document.querySelector("#all-Clear");
let editID;
let isEditedTask = false;

// Retrieve todos from localStorage
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Filter tasks (All, Pending, Completed)
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id); // Call showTodo based on filter clicked
  });
});

// Function to display tasks based on filter
function showTodo(filter = "all") {
  let li = "";
  if (todos.length > 0) {
    todos.forEach((todo, id) => {
      let isComplete = todo.status === "completed" ? "checked" : "";
      if (filter === todo.status || filter === "all") {
        li += `
          <li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isComplete}>
              <p class="${isComplete}">${todo.name}</p>
            </label>
            <div class="setting">
              <i onClick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
              <ul class="task-menu">
                <li onClick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pencil"></i>Edit</li>
                <li onClick="deleteTask(${id})"><i class="fa-solid fa-trash-can"></i>Delete</li>
              </ul>
            </div>
          </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any tasks here</span>`;
}

// Display all tasks by default
showTodo("all");

// Edit Task
function editTask(todoId, todoName) {
  editID = todoId;
  taskInput.value = todoName;
  isEditedTask = true;
}

// Delete Task
function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(document.querySelector(".filters span.active").id);
}

// Show Task Menu
function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");

  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target !== selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

// Clear All Todos
clearAllTodos.addEventListener("click", () => {
  todos.length = 0;
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

// Update Status of Todo (Pending/Completed)
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.querySelector("p");

  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed"; // Fixed typo here
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Add Task on Enter Keypress
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && taskInput.value.trim()) {
    let userInput = taskInput.value.trim();

    if (isEditedTask) {
      isEditedTask = false;
      todos[editID].name = userInput;
    } else {
      todos.push({ name: userInput, status: "pending" });
    }

    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
  }
});
