import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  MoveCell,
  DeleteCell,
  InsertCell,
  UpdateCellLanguage,
  UpdateCellContent,
  UpdateCodeCellMeta,
  SetCells,
  SetCellSocket,
} from "../payload-types";
import { Cell } from "../cell";

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  saveStatus: string | null;
  data: {
    [key: string]: Cell;
  };
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 5);
};

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  saveStatus: null,
  data: {},
};

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    moveCell: (state, action: PayloadAction<MoveCell>) => {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((i) => i === id);

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      // invalid moving direction
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
    },
    deleteCell: (state, action: PayloadAction<DeleteCell>) => {
      const id = action.payload.id;
      state.order = state.order.filter((i) => i !== id);
      delete state.data[id];
    },
    insertCell: (state, action: PayloadAction<InsertCell>) => {
      const { id, type } = action.payload;
      const cellId = generateId()
      const cell: Cell = {
        id: cellId,
        content: "",
        type,
        meta: {
          id: cellId
        },
        language: "javascript",
      };
      state.data[cell.id] = cell;
      if (id) {
        const index = state.order.findIndex((i) => i === id);
        state.order.splice(index + 1, 0, cell.id);
      } else {
        state.order.unshift(cell.id);
      }
    },
    updateCellContent: (state, action: PayloadAction<UpdateCellContent>) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    updateCellLanguage: (state, action: PayloadAction<UpdateCellLanguage>) => {
      const { id, language } = action.payload;
      state.data[id].language = language;
    },
    updateCodeCellMeta: (state, action: PayloadAction<UpdateCodeCellMeta>) => {
      const { id, meta } = action.payload;
      state.data[id].meta = meta;
    },
    setCells: (state, action: PayloadAction<SetCells>) => {
      if (action.payload.data.length !== 0) {
        state.order = action.payload.data.map((cell) => cell.id);
        state.data = action.payload.data.reduce((accumulator, cell) => {
          accumulator[cell.id] = cell;
          return accumulator;
        }, {} as CellsState["data"]);

      } else {
        state.data = {
        };
        state.order = [
        ];
      }
    },
 
  },
  
});

export const {
  moveCell,
  deleteCell,
  updateCellContent,
  updateCellLanguage,
  updateCodeCellMeta,
  insertCell,
  setCells,

} = cellsSlice.actions;

export const cellsReducer = cellsSlice.reducer;
