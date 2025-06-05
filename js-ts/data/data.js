import { Status } from "../types/types.js";
export let tasks = [
    { id: 1, position: 1, name: "Learn TypeScript", status: Status.ToDo },
    { id: 2, position: 2, name: "Learn Java script", status: Status.ToDo },
    { id: 3, position: 1, name: "Build Task App", status: Status.Doing },
    { id: 4, position: 2, name: "Build Uber", status: Status.Doing },
    { id: 5, position: 1, name: "Deploy to GitHub", status: Status.Done },
    { id: 6, position: 2, name: "Be real", status: Status.Done },
];
export function addTasks(name) {
    const nextId = tasks.length + 1;
    tasks.push({ name, status: Status.ToDo });
}
export function deleteTasks(name) {
    tasks = tasks.filter((task) => task.name !== name);
}
export function moveTask(taskName, oldStatus, newStatus) {
    const task = tasks.find((t) => t.name === taskName && t.status === oldStatus);
    if (!task)
        return false;
    task.status = newStatus;
    return true;
}
