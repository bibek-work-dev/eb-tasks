// import { removeHoverClasses, getParentDiv } from "../utils/dom";
// import { moveTask } from "../state/taskState";
import { moveTask } from "../data/data.js";
import { DraggedTask, Status } from "../types/types.js";
import { displayAllTasks } from "../ui/renderTasks.js";
import { getParentDiv, removeHoverClasses } from "../utils/utils.js";
// import { displayAllTasks } from "../ui/display";

let draggedTasks: DraggedTask | null = null;

export function handleDragStart(e: DragEvent) {
  const target = e.target as HTMLElement;
  draggedTasks = {
    name: target.dataset.name!,
    status: target.dataset.status! as Status,
  };
}

export function handleDragEnd() {
  draggedTasks = null;
  document
    .querySelectorAll(
      ".container-tasks-todo, .container-tasks-doing, .container-tasks-done"
    )
    .forEach((div) => removeHoverClasses(div as HTMLDivElement));
}

export function handleDragOver(e: DragEvent) {
  e.preventDefault();
  const oldStatus = draggedTasks?.status!;
  const parent = getParentDiv(e.currentTarget as HTMLElement);

  if (
    oldStatus === Status.ToDo &&
    parent.classList.contains("container-tasks-done")
  ) {
    parent.classList.add("bg-red");
  } else {
    parent.classList.add("bg-blue");
  }
}

export function handleDragLeave(e: DragEvent) {
  removeHoverClasses(getParentDiv(e.currentTarget as HTMLElement));
}

export function handleDrop(e: DragEvent) {
  e.preventDefault();
  if (!draggedTasks) return;

  const dropZone = e.currentTarget as HTMLElement;
  const oldStatus = draggedTasks.status;
  const parent = getParentDiv(dropZone);
  parent.classList.remove("bg-blue");

  let newStatus: Status;

  switch (dropZone.id) {
    case "container-tasks-todo-display":
      newStatus = Status.ToDo;
      break;
    case "container-tasks-doing-display":
      newStatus = Status.Doing;
      break;
    case "container-tasks-done-display":
      if (oldStatus === Status.ToDo) return alert("Invalid Move");
      newStatus = Status.Done;
      break;
    default:
      return;
  }

  moveTask(draggedTasks.name, oldStatus, newStatus);
  displayAllTasks();
}
