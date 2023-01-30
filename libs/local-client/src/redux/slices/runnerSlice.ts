import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import esBundle from "../../bundler";
import { RunnerOutput, RunnerInput } from "../payload-types";

interface RunnerState {
  [key: string]:
  | {
    loading: boolean;
    code: string;
    error: string;
  }
  | undefined;
}

interface RejectValue {
  id: string;
  error: string;
}

const initialState: RunnerState = {};

export const createBundle = createAsyncThunk<
  RunnerOutput,
  RunnerInput,
  { rejectValue: RejectValue }
>("bundler/create", async (payload, thunkAPI) => {
  const { id, input } = payload;
  // const { code, error } = await esBundle(input,);

  // if (code === "" && error !== "") {
  //   thunkAPI.rejectWithValue({ id, error });
  // } else if (code !== "" && !error) {
  //   return { code, error };
  // }
  // return { code, error };
});

const bundlerSlice = createSlice({
  name: "bundler",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBundle.pending, (state, { meta }) => {
      const id = meta.arg.id;
      state[id] = {
        loading: true,
        code: "",
        error: "",
      };
    });

    builder.addCase(createBundle.fulfilled, (state, { payload, meta }) => {
      const { code } = payload;
      const id = meta.arg.id;
      state[id] = {
        loading: false,
        code,
        error: "",
      };
    });

    builder.addCase(createBundle.rejected, (state, { payload }) => {
      if (payload) {
        const { id, error } = payload;
        state[id] = {
          loading: false,
          error,
          code: "",
        };
      }
    });
  },
});

export default bundlerSlice.reducer;
