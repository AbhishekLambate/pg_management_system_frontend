import { StorageManagement } from "../../helpers/firebase_helper";
import { storageListSuccess, storageListError } from "./reducer";

export const getStorageList = (orgId) => async (dispatch) => {
    try {
        const response = await StorageManagement.getStorageList(orgId);
        const data = Array.isArray(response) ? response : (response?.data?.items || response?.data || response?.storages || response || []);
        dispatch(storageListSuccess(data));
        return data;
    } catch (error) {
        dispatch(storageListError(error));
        throw error;
    }
};

export const deleteStorage = (orgId, storageId) => async (dispatch) => {
    try {
        const response = await StorageManagement.deleteStorage(orgId, storageId);
        dispatch(getStorageList(orgId));
        return response;
    } catch (error) {
        console.error("Delete storage failed:", error);
        throw error;
    }
};

export const updateStorage = (orgId, storageId, data) => async (dispatch) => {
    try {
        const response = await StorageManagement.updateStorage(orgId, storageId, data);
        dispatch(getStorageList(orgId));
        return response;
    } catch (error) {
        console.error("Update storage failed:", error);
        throw error;
    }
};

export const addStorage = (orgId, data) => async (dispatch) => {
    try {
        const response = await StorageManagement.addStorage(orgId, data);
        dispatch(getStorageList(orgId));
        return response;
    } catch (error) {
        console.error("Add storage failed:", error);
        throw error;
    }
};
