export type CellTypes = "code" | "text" | "shell";

export type CellLanguages = "javascript" | "typescript" | "shell" | "python";

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
  language?: CellLanguages;
  meta?: any
}
