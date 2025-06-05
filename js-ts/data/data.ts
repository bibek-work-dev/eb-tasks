import { Status, TypeTask } from "../types/types.js";

export let tasks: TypeTask[] = [
  { id: 1, position: 0, name: "Learn TypeScript", status: Status.ToDo },
  { id: 2, position: 1, name: "Learn Java script", status: Status.ToDo },

  { id: 3, position: 0, name: "Build Task App", status: Status.Doing },
  { id: 4, position: 1, name: "Build Uber", status: Status.Doing },

  { id: 5, position: 0, name: "Deploy to GitHub", status: Status.Done },
  { id: 6, position: 1, name: "Be real", status: Status.Done },
];

let nextId: number = tasks.length + 1;

export function addTasks(name: string) {
  const todoTasks = getTasksByStatus(Status.ToDo);
  const newPosition = tasks.length;
  tasks.push({
    id: nextId,
    name,
    status: Status.ToDo,
    position: newPosition,
  });
  nextId++;
}

export function deleteTasks(name: string) {
  tasks = tasks.filter((task) => task.name !== name);
}

export function moveTask(
  taskName: string,
  oldStatus: Status,
  newStatus: Status
): boolean {
  const task = tasks.find((t) => t.name === taskName && t.status === oldStatus);
  if (!task) return false;
  task.status = newStatus;
  return true;
}
