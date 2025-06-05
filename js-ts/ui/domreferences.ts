import { Status } from "../types/types.js";

export const inputField = document.getElementById(
  "container-form-input"
) as HTMLInputElement;
export const addBtn = document.getElementById(
  "container-form-btn"
) as HTMLButtonElement;

export const displays = {
  [Status.ToDo]: document.getElementById(
    "container-tasks-todo-display"
  ) as HTMLUListElement,
  [Status.Doing]: document.getElementById(
    "container-tasks-doing-display"
  ) as HTMLUListElement,
  [Status.Done]: document.getElementById(
    "container-tasks-done-display"
  ) as HTMLUListElement,
};

export const containers = {
  [Status.ToDo]: document.querySelector(
    ".container-tasks-todo"
  ) as HTMLDivElement,
  [Status.Doing]: document.querySelector(
    ".container-tasks-doing"
  ) as HTMLDivElement,
  [Status.Done]: document.querySelector(
    ".container-tasks-done"
  ) as HTMLDivElement,
};
