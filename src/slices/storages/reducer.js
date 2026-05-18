import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    error: "",
    success: "",
    storageList: []
};

const StorageSlice = createSlice({
    name: "Storage",
    initialState,
    reducers: {
        storageListSuccess(state, action) {
            state.success = action.payload.status;
            state.storageList = action.payload;
        },
        storageListError(state, action) {
            state.error = action.payload;
        },
        clearStorageList(state) {
            state.storageList = [];
            state.success = "";
            state.error = "";
        }
    },
});

export const { storageListSuccess, storageListError, clearStorageList } = StorageSlice.actions;
export default StorageSlice.reducer;
