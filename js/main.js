// Находим элемент на странице
const form = document.querySelector("#form");
const tasksList = document.querySelector("#tasksList");
const taskInput = document.querySelector("#taskInput");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.forEach((task) => renderTask(task));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListElement = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li> `;
    tasksList.insertAdjacentHTML("afterbegin", emptyListElement);
  }

  if (tasks.length > 0) {
    const emptyListElem = document.querySelector("#emptyList");
    emptyListElem ? emptyListElem.remove() : null;
  }
}

checkEmptyList();

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();

  saveToLocalStorage();
}

form.addEventListener("submit", addTask);

function deleteTask(e) {
  if (e.target.dataset.action !== "delete") return;

  const parentNode = e.target.closest("li");

  const id = parentNode.id;

  const index = tasks.findIndex((task) => task.id == id);

  tasks.splice(index, 1);

  parentNode.remove();

  checkEmptyList();

  saveToLocalStorage();
}

tasksList.addEventListener("click", deleteTask);

function doneTask(e) {
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest(".list-group-item");

  const id = parentNode.id;

  const task = tasks.find((task) => task.id == id);

  task.done = !task.done;

  const taskTitle = parentNode.querySelector("SPAN");
  taskTitle.classList.toggle("task-title--done");

  saveToLocalStorage();
}

tasksList.addEventListener("click", doneTask);
