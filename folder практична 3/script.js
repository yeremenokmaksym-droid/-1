const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const filters = document.querySelectorAll(".filter");
const clearButton = document.getElementById("clearCompleted");

// Завантажуємо збережені завдання
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Зберігаємо завдання у браузері
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Виводимо завдання на сторінку
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        // Перевіряємо вибраний фільтр
        if (currentFilter === "active" && task.completed) return;
        if (currentFilter === "completed" && !task.completed) return;

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Створюємо чекбокс
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Створюємо текст завдання
        const span = document.createElement("span");
        span.textContent = task.text;

        // Створюємо кнопку видалення
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, span, deleteButton);
        list.appendChild(li);
    });

    // Оновлюємо лічильник
    const active = tasks.filter(task => !task.completed).length;

    counter.textContent =
        `Усього: ${tasks.length} | Не виконано: ${active}`;
}

// Додаємо нове завдання
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();

    // Не додаємо порожні завдання
    if (text === "") return;

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";
    saveTasks();
    renderTasks();
});

// Перемикаємо фільтри
filters.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filters.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        renderTasks();
    });
});

// Видаляємо всі виконані завдання
clearButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// Показуємо завдання після відкриття сторінки
renderTasks();
