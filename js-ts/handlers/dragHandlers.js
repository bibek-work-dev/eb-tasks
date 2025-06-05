// import { removeHoverClasses, getParentDiv } from "../utils/dom";
// import { moveTask } from "../state/taskState";
import { moveTask } from "../data/data.js";
import { Status } from "../types/types.js";
import { displayAllTasks } from "../ui/renderTasks.js";
import { getParentDiv, removeHoverClasses } from "../utils/utils.js";
// import { displayAllTasks } from "../ui/display";
let draggedTasks = null;
export function handleDragStart(e) {
    const target = e.target;
    draggedTasks = {
        name: target.dataset.name,
        status: target.dataset.status,
    };
}
export function handleDragEnd() {
    draggedTasks = null;
    document
        .querySelectorAll(".container-tasks-todo, .container-tasks-doing, .container-tasks-done")
        .forEach((div) => removeHoverClasses(div));
}
export function handleDragOver(e) {
    e.preventDefault();
    const oldStatus = draggedTasks === null || draggedTasks === void 0 ? void 0 : draggedTasks.status;
    const parent = getParentDiv(e.currentTarget);
    if (oldStatus === Status.ToDo &&
        parent.classList.contains("container-tasks-done")) {
        parent.classList.add("bg-red");
    }
    else {
        parent.classList.add("bg-blue");
    }
}
export function handleDragLeave(e) {
    removeHoverClasses(getParentDiv(e.currentTarget));
}
export function handleDrop(e) {
    e.preventDefault();
    if (!draggedTasks)
        return;
    const dropZone = e.currentTarget;
    const oldStatus = draggedTasks.status;
    const parent = getParentDiv(dropZone);
    parent.classList.remove("bg-blue");
    let newStatus;
    switch (dropZone.id) {
        case "container-tasks-todo-display":
            newStatus = Status.ToDo;
            break;
        case "container-tasks-doing-display":
            newStatus = Status.Doing;
            break;
        case "container-tasks-done-display":
            if (oldStatus === Status.ToDo)
                return alert("Invalid Move");
            newStatus = Status.Done;
            break;
        default:
            return;
    }
    moveTask(draggedTasks.name, oldStatus, newStatus);
    displayAllTasks();
}
