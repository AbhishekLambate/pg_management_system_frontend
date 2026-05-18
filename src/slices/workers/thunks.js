import { WorkerManagement } from "../../helpers/firebase_helper";
import { workerListSuccess, workerListError } from "./reducer";

export const getWorkerList = (orgId) => async (dispatch) => {
    try {
        const response = await WorkerManagement.getWorkerList(orgId);
        const data = Array.isArray(response) ? response : (response?.data?.items || response?.data || response?.workers || response || []);
        dispatch(workerListSuccess(data));
        return data;
    } catch (error) {
        dispatch(workerListError(error));
        throw error;
    }
};

export const deleteWorker = (orgId, workerId) => async (dispatch) => {
    try {
        const response = await WorkerManagement.deleteWorker(orgId, workerId);
        dispatch(getWorkerList(orgId));
        return response;
    } catch (error) {
        console.error("Delete worker failed:", error);
        throw error;
    }
};
