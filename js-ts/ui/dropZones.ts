import {
  handleDrop,
  handleDragLeave,
  handleDragOver,
} from "../handlers/dragHandlers.js";

export function setupDropZones() {
  [
    "container-tasks-todo-display",
    "container-tasks-doing-display",
    "container-tasks-done-display",
  ].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("dragover", handleDragOver);
    el?.addEventListener("dragleave", handleDragLeave);
    el?.addEventListener("drop", handleDrop);
  });
}
