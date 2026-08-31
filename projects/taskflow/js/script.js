/* =========================================================
   TASKFLOW — MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   DATA
========================================================= */

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [];

let editingTaskId = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const taskModal = document.getElementById("taskModal");

const openTaskModal = document.getElementById("openTaskModal");

const closeTaskModal = document.getElementById("closeTaskModal");

const cancelTask = document.getElementById("cancelTask");

const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

const priorityFilter = document.getElementById("priorityFilter");

const sortTasks = document.getElementById("sortTasks");

const themeToggle = document.getElementById("themeToggle");

const modalTitle = document.getElementById("modalTitle");


/* Form fields */

const taskTitle = document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskCategory =
    document.getElementById("taskCategory");

const taskPriority =
    document.getElementById("taskPriority");

const taskDueDate =
    document.getElementById("taskDueDate");


/* Statistics */

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");


/* =========================================================
   SAVE TASKS
========================================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================================
   GENERATE UNIQUE ID
========================================================= */

function generateId() {

    return Date.now().toString();

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal() {

    taskModal.classList.add("open");

    taskTitle.focus();

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    taskModal.classList.remove("open");

    resetForm();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    taskForm.reset();

    editingTaskId = null;

    modalTitle.textContent = "Add New Task";

    taskPriority.value = "medium";

}


/* =========================================================
   ADD / EDIT TASK
========================================================= */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        taskTitle.value.trim();

    const description =
        taskDescription.value.trim();

    const category =
        taskCategory.value;

    const priority =
        taskPriority.value;

    const dueDate =
        taskDueDate.value;


    /* Don't save an empty title */

    if (!title) {

        taskTitle.focus();

        return;

    }


    /* =========================================
       EDIT EXISTING TASK
    ========================================== */

    if (editingTaskId) {

        tasks = tasks.map(task => {

            if (task.id === editingTaskId) {

                return {

                    ...task,

                    title,
                    description,
                    category,
                    priority,
                    dueDate

                };

            }

            return task;

        });

    }


    /* =========================================
       CREATE NEW TASK
    ========================================== */

    else {

        const newTask = {

            id: generateId(),

            title,

            description,

            category,

            priority,

            dueDate,

            completed: false,

            createdAt: new Date().toISOString()

        };


        tasks.unshift(newTask);

    }


    saveTasks();

    renderTasks();

    updateStatistics();

    closeModal();

});


/* =========================================================
   RENDER TASKS
========================================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        categoryFilter.value;

    const selectedPriority =
        priorityFilter.value;


const filteredTasks = tasks.filter(task => {

    /* Search */

    const matchesSearch =

        task.title
            .toLowerCase()
            .includes(searchTerm)

        ||

        task.description
            .toLowerCase()
            .includes(searchTerm);


    /* Category */

    const matchesCategory =

        selectedCategory === "all"

        ||

        task.category === selectedCategory;


    /* Priority */

    const matchesPriority =

        selectedPriority === "all"

        ||

        task.priority === selectedPriority;


    return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority
    );

});


/* =========================================================
   SORT TASKS
========================================================= */

const selectedSort =
    sortTasks.value;


const priorityOrder = {

    high: 1,

    medium: 2,

    low: 3

};


filteredTasks.sort((a, b) => {

    switch (selectedSort) {


        case "oldest":

            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );


        case "due":

            if (!a.dueDate) return 1;

            if (!b.dueDate) return -1;

            return (
                new Date(`${a.dueDate}T00:00:00`) -
                new Date(`${b.dueDate}T00:00:00`)
            );


        case "priority":

            return (
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
            );


        case "alphabetical":

            return a.title.localeCompare(
                b.title
            );


        case "newest":

        default:

            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

    }

});


    /* Clear current task list */

    taskList.innerHTML = "";


    /* No matching tasks */

    if (filteredTasks.length === 0) {

        taskList.appendChild(
            createEmptyState()
        );

        return;

    }


    /* Render each task */

    filteredTasks.forEach(task => {

        taskList.appendChild(
            createTaskElement(task)
        );

    });

}


/* =========================================================
   CREATE EMPTY STATE
========================================================= */

function createEmptyState() {

    const empty = document.createElement("div");

    empty.className = "empty-state";


    if (tasks.length === 0) {

        empty.innerHTML = `

            <div class="empty-icon">
                ✓
            </div>

            <h3>
                No tasks yet
            </h3>

            <p>
                Add your first task to get started.
            </p>

        `;

    }

    else {

        empty.innerHTML = `

            <div class="empty-icon">
                ⌕
            </div>

            <h3>
                No matching tasks
            </h3>

            <p>
                Try changing your search or filters.
            </p>

        `;

    }


    return empty;

}


/* =========================================================
   CREATE TASK ELEMENT
========================================================= */

function createTaskElement(task) {

    const taskCard =
        document.createElement("article");


    taskCard.className =
        "task-card";


    if (task.completed) {

        taskCard.classList.add("completed");

    }


    /* =========================================
       CHECKBOX
    ========================================== */

    const checkbox =
        document.createElement("button");

    checkbox.className =
        "task-checkbox";

    checkbox.type = "button";

    checkbox.innerHTML =
        task.completed ? "✓" : "";


    checkbox.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task incomplete"
            : "Mark task complete"
    );


    checkbox.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    /* =========================================
       MAIN TASK CONTENT
    ========================================== */

    const main =
        document.createElement("div");

    main.className =
        "task-main";


    const title =
        document.createElement("div");

    title.className =
        "task-title";

    title.textContent =
        task.title;


    const description =
        document.createElement("div");

    description.className =
        "task-description";

    description.textContent =
        task.description ||
        "No description added.";


    /* =========================================
       META INFORMATION
    ========================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "task-meta";


    /* Category */

    const category =
        document.createElement("span");

    category.className =
        "task-category";

    category.textContent =
        formatCategory(task.category);


    /* Priority */

    const priority =
        document.createElement("span");

    priority.className =
        `task-priority ${task.priority}`;

    priority.textContent =
        `${capitalize(task.priority)} Priority`;


    meta.appendChild(category);

    meta.appendChild(priority);


    /* Due date */

if (task.dueDate) {

    const date =
        document.createElement("span");

    date.className = "task-date";

    if (isTaskOverdue(task)) {

        date.classList.add("overdue");

        date.textContent =
            `⚠ Overdue · ${formatDate(task.dueDate)}`;

    } else {

        date.textContent =
            formatDate(task.dueDate);

    }

    meta.appendChild(date);

}

    main.appendChild(title);

    main.appendChild(description);

    main.appendChild(meta);


    /* =========================================
       ACTION BUTTONS
    ========================================== */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* Edit */

    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className =
        "task-action";

    editButton.innerHTML =
        "✎";

    editButton.title =
        "Edit task";


    editButton.addEventListener(
        "click",
        () => editTask(task.id)
    );


    /* Delete */

    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
        "task-action delete";

    deleteButton.innerHTML =
        "×";

    deleteButton.title =
        "Delete task";


    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    /* =========================================
       BUILD TASK CARD
    ========================================== */

    taskCard.appendChild(checkbox);

    taskCard.appendChild(main);

    taskCard.appendChild(actions);


    return taskCard;

}


/* =========================================================
   TOGGLE TASK
========================================================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed:
                    !task.completed

            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =========================================================
   EDIT TASK
========================================================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {

        return;

    }


    editingTaskId =
        id;


    modalTitle.textContent =
        "Edit Task";


    taskTitle.value =
        task.title;

    taskDescription.value =
        task.description;

    taskCategory.value =
        task.category;

    taskPriority.value =
        task.priority;

    taskDueDate.value =
        task.dueDate;


    openModal();

}


/* =========================================================
   DELETE TASK
========================================================= */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const progress =

        total === 0

            ? 0

            : Math.round(
                (completed / total) * 100
            );


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    progressPercent.textContent =
        `${progress}%`;


    progressText.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;

}


/* =========================================================
   FORMAT CATEGORY
========================================================= */

function formatCategory(category) {

    const categories = {

        work: "Work",

        personal: "Personal",

        study: "Study",

        other: "Other"

    };


    return (
        categories[category] ||
        capitalize(category)
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (Number.isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-ZA",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

/* =========================================================
   CHECK IF TASK IS OVERDUE
========================================================= */

function isTaskOverdue(task) {

    /* Completed tasks cannot be overdue */

    if (task.completed) {
        return false;
    }

    /* Tasks without a due date cannot be overdue */

    if (!task.dueDate) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(
        `${task.dueDate}T00:00:00`
    );

    return dueDate < today;
}

/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(value) {

    if (!value) {

        return "";

    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================================================
   CATEGORY FILTER
========================================================= */

categoryFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================================================
   PRIORITY FILTER
========================================================= */

priorityFilter.addEventListener(
    "change",
    renderTasks
);


/* =========================================================
   MODAL EVENTS
========================================================= */

openTaskModal.addEventListener(
    "click",
    () => {

        resetForm();

        openModal();

    }
);


closeTaskModal.addEventListener(
    "click",
    closeModal
);


cancelTask.addEventListener(
    "click",
    closeModal
);


/* Click outside modal */

taskModal.addEventListener(
    "click",
    event => {

        if (
            event.target === taskModal
        ) {

            closeModal();

        }

    }
);


/* Escape key */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            taskModal.classList.contains("open")
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

const savedTheme =
    localStorage.getItem(
        "taskflowTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


/* Theme button */

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "taskflowTheme",
            isDark
                ? "dark"
                : "light"
        );


        themeToggle.textContent =
            isDark ? "☀" : "☼";

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

function initialiseTaskFlow() {

    renderTasks();

    updateStatistics();


    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeToggle.textContent =
            "☀";

    }

}


/* Start application */

initialiseTaskFlow();