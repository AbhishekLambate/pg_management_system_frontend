import { JobManagement } from "../../helpers/firebase_helper";
import {
    jobListSuccess,
    jobListError,
    templateListLoading,
    templateListSuccess,
    templateListError,
} from "./reducer";

export const getJobList = (orgId) => async (dispatch) => {
    try {
        const response = await JobManagement.getJobList(orgId);
        const data = Array.isArray(response)
            ? response
            : (response?.data?.items || response?.data?.jobs || response?.data || response?.jobs || response || []);
        dispatch(jobListSuccess(data));
        return data;
    } catch (error) {
        dispatch(jobListError(error?.message || "Failed to load jobs"));
        throw error;
    }
};

export const deleteJob = (orgId, jobId) => async (dispatch) => {
    try {
        const response = await JobManagement.deleteJob(orgId, jobId);
        dispatch(getJobList(orgId));
        return response;
    } catch (error) {
        console.error("Delete job failed:", error);
        throw error;
    }
};

export const saveJobTemplate = (orgId, payload) => async () => {
    try {
        const response = await JobManagement.saveTemplate(orgId, payload);
        return response;
    } catch (error) {
        console.error("Save template failed:", error);
        throw error;
    }
};
export const createJob = (orgId, payload) => async () => {
    try {
        const response = await JobManagement.createJob(orgId, payload);
        return response;
    } catch (error) {
        console.error("Create job failed:", error);
        throw error;
    }
};

export const getJobTemplates = (orgId) => async (dispatch) => {
    dispatch(templateListLoading());
    try {
        const response = await JobManagement.getTemplates(orgId);
        const data = Array.isArray(response)
            ? response
            : (response?.data?.items || response?.data?.templates || response?.data || response || []);
        dispatch(templateListSuccess(data));
        return data;
    } catch (error) {
        dispatch(templateListError(error?.message || "Failed to load templates"));
        throw error;
    }
};
