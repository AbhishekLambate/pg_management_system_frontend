import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    error: "",
    success: "",
    userList: []
};

const UserSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        userListSuccess(state, action) {
            state.success = action.payload.status;
            state.userList = action.payload
        },
        userListError(state, action) {
            state.error = action.payload
        },
        clearUserList(state) {
            state.userList = [];
            state.success = "";
            state.error = "";
        }
    },
});

export const { userListSuccess, userListError, clearUserList } = UserSlice.actions;
export default UserSlice.reducer;