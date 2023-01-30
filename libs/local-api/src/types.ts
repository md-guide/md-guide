
export interface TextCell {
  id: string;
  type: "text";
  content: string;       
}

export interface CodeCell {
  id: string;
  type: "code";
  content: string;
  language: string;
  meta?: {
    file: string;
    preview: boolean;
    id: string;
  };
  raw: string;            
}
export type Cell = TextCell | CodeCell