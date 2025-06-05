import { tasks } from "../data/data.js";

export function checkDuplicateTaskName(
  inputField: HTMLInputElement,
  addBtn: HTMLButtonElement
): void {
  const taskName = inputField.value.trim();
  const isDuplicate = tasks.some(
    (task) => task.name.toLowerCase() === taskName.toLowerCase()
  );
  addBtn.disabled = taskName === "" || isDuplicate;
}
