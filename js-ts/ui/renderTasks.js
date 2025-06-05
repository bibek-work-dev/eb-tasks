import { deleteTasks, tasks } from "../data/data.js";
import { handleDragEnd, handleDragStart } from "../handlers/dragHandlers.js";
import { Status } from "../types/types.js";
import { displays } from "./domreferences.js";
function displayTasksByStatus(status, container) {
    container.innerHTML = "";
    const filteredTasks = tasks.filter((task) => task.status === status);
    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add("each-list");
        const span = document.createElement("span");
        span.textContent = task.name;
        span.classList.add("task-name");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.title = "Delete Task";
        li.appendChild(span);
        li.appendChild(deleteBtn);
        deleteBtn.addEventListener("click", () => {
            deleteTasks(task.name);
            displayTasksByStatus(status, container);
        });
        li.draggable = true;
        li.dataset.name = task.name;
        li.dataset.status = task.status;
        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragend", handleDragEnd);
        container.appendChild(li);
    });
}
export function displayAllTasks() {
    displayTasksByStatus(Status.ToDo, displays["To do"]);
    displayTasksByStatus(Status.Doing, displays.Doing);
    displayTasksByStatus(Status.Done, displays.Done);
}
