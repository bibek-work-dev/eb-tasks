import { handleDrop, handleDragLeave, handleDragOver, } from "../handlers/dragHandlers.js";
export function setupDropZones() {
    [
        "container-tasks-todo-display",
        "container-tasks-doing-display",
        "container-tasks-done-display",
    ].forEach((id) => {
        const el = document.getElementById(id);
        el === null || el === void 0 ? void 0 : el.addEventListener("dragover", handleDragOver);
        el === null || el === void 0 ? void 0 : el.addEventListener("dragleave", handleDragLeave);
        el === null || el === void 0 ? void 0 : el.addEventListener("drop", handleDrop);
    });
}
