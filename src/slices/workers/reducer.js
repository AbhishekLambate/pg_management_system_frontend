import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    error: "",
    success: "",
    workerList: []
};

const WorkerSlice = createSlice({
    name: "Worker",
    initialState,
    reducers: {
        workerListSuccess(state, action) {
            state.success = action.payload.status;
            state.workerList = action.payload;
        },
        workerListError(state, action) {
            state.error = action.payload;
        },
        clearWorkerList(state) {
            state.workerList = [];
            state.success = "";
            state.error = "";
        }
    },
});

export const { workerListSuccess, workerListError, clearWorkerList } = WorkerSlice.actions;
export default WorkerSlice.reducer;
