import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    error: "",
    success: "",
    jobList: [],
    templateList:    [],
    templateLoading: false,
    templateError:   "",
};

const JobSlice = createSlice({
    name: "Job",
    initialState,
    reducers: {
        jobListSuccess(state, action) {
            state.jobList = action.payload;
            state.success = "ok";
            state.error = "";
        },
        jobListError(state, action) {
            state.error = action.payload;
        },
        clearJobList(state) {
            state.jobList = [];
            state.success = "";
            state.error = "";
        },
        templateListLoading(state) {
            state.templateLoading = true;
            state.templateError   = "";
        },
        templateListSuccess(state, action) {
            state.templateList    = action.payload;
            state.templateLoading = false;
            state.templateError   = "";
        },
        templateListError(state, action) {
            state.templateError   = action.payload;
            state.templateLoading = false;
        },
    },
});

export const {
    jobListSuccess,
    jobListError,
    clearJobList,
    templateListLoading,
    templateListSuccess,
    templateListError,
} = JobSlice.actions;

export default JobSlice.reducer;
