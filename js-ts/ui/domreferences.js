import { Status } from "../types/types.js";
export const inputField = document.getElementById("container-form-input");
export const addBtn = document.getElementById("container-form-btn");
export const displays = {
    [Status.ToDo]: document.getElementById("container-tasks-todo-display"),
    [Status.Doing]: document.getElementById("container-tasks-doing-display"),
    [Status.Done]: document.getElementById("container-tasks-done-display"),
};
export const containers = {
    [Status.ToDo]: document.querySelector(".container-tasks-todo"),
    [Status.Doing]: document.querySelector(".container-tasks-doing"),
    [Status.Done]: document.querySelector(".container-tasks-done"),
};
