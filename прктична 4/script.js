const API_URL = "https://6b02f3fc4a8cad87bd902649.mockapi.io/users";

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const counter = document.getElementById("counter");
const addButton = document.getElementById("addButton");

// Функція для надсилання запитів до API
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    // Перевірка помилки сервера
    if (!response.ok) {
        throw new Error("Помилка HTTP: " + response.status);
    }

    return response.json();
}

// GET - отримання списку завдань
async function loadTasks() {
    loading.style.display = "block";
    error.textContent = "";

    try {
        const tasks = await apiRequest(API_URL);

        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            // Позначення виконаного завдання
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed === true;

            const span = document.createElement("span");
            span.textContent = task.name;

            if (task.completed) {
                span.classList.add("completed");
            }

            // PATCH - оновлення стану завдання
            checkbox.addEventListener("change", async () => {
                checkbox.disabled = true;

                try {
                    await apiRequest(API_URL + "/" + task.id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            completed: checkbox.checked
                        })
                    });

                    await loadTasks();
                } catch (err) {
                    error.textContent = err.message;
                    checkbox.checked = !checkbox.checked;
                    checkbox.disabled = false;
                }
            });

            // DELETE - видалення завдання
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Видалити";
            deleteButton.className = "delete";

            deleteButton.addEventListener("click", async () => {
                deleteButton.disabled = true;
                error.textContent = "";

                try {
                    await apiRequest(API_URL + "/" + task.id, {
                        method: "DELETE"
                    });

                    await loadTasks();
                } catch (err) {
                    error.textContent = err.message;
                    deleteButton.disabled = false;
                }
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });

        // Лічильник завдань
        counter.textContent = "Усього завдань: " + tasks.length;

    } catch (err) {
        error.textContent = "Не вдалося завантажити: " + err.message;
    } finally {
        loading.style.display = "none";
    }
}

// POST - додавання нового завдання
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = input.value.trim();

    // Перевірка введеного тексту
    if (!name) {
        error.textContent = "Введіть назву завдання!";
        return;
    }

    addButton.disabled = true;
    error.textContent = "";

    try {
        await apiRequest(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                completed: false
            })
        });

        input.value = "";
        await loadTasks();

    } catch (err) {
        error.textContent = "Помилка додавання: " + err.message;
    } finally {
        addButton.disabled = false;
    }
});

// Завантаження завдань при відкритті сторінки
loadTasks();
