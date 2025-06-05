export enum Status {
  ToDo = "To do",
  Doing = "Doing",
  Done = "Done",
}

export type TypeTask = {
  id: number;
  name: string;
  status: Status;
  position: number;
};

export interface DraggedTask {
  id: number;
  name: string;
  status: Status;
  position: number;
}

export interface DropPosition {
  status: Status;
  index: number;
}
