import { CellTypes, CellLanguages, Cell } from "../cell";

type MoveDirection = "up" | "down";

export interface MoveCell {
  id: string;
  direction: MoveDirection;
}

export interface DeleteCell {
  id: string;
}

export interface InsertCell {
  id: string | null;
  type: CellTypes;
}

export interface UpdateCellContent {
  id: string;
  content: string;
}

export interface UpdateCellLanguage {
  id: string;
  language: CellLanguages;
}
export interface UpdateCodeCellMeta {
  id: string;
  meta: {
    file?: string;
    preview: boolean;
  }
}
export interface SetCells {
  data: Cell[];
}
export interface SetCellSocket {
  socket: any;
}

export interface BundlerInput {
  id: string;
  input: string;
  hasTypescript: boolean;
} 

export interface BundlerOutput {
  code: string;
  error: string;
}

export interface RunnerInput {
  id: string;
  input: string;
}

export interface RunnerOutput {
  code: string;
  error: string;
}
