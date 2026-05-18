import { UserManagement } from "../../helpers/firebase_helper";
import { userListSuccess, userListError } from "./reducer";

export const getUserList = (orgId) => async (dispatch) => {
    try {
        const response = await UserManagement.getUserList(orgId);
        const data = Array.isArray(response) ? response : (response?.data?.items || response?.data || response?.users || response || []);
        dispatch(userListSuccess(data));
        return data;
    } catch (error) {
        dispatch(userListError(error));
        throw error;
    }
};

export const updateUserRole = (orgId, userId, payload) => async (dispatch) => {
    try {
        const response = await UserManagement.updateUserRole(orgId, userId, payload);
        dispatch(getUserList(orgId));
        return response;
    } catch (error) {
        console.error("Role update failed:", error);
        throw error;
    }
};

export const updateUserStatus = (orgId, userId, payload) => async (dispatch) => {
    try {
        const response = await UserManagement.updateUserStatus(orgId, userId, payload);
        dispatch(getUserList(orgId));
        return response;
    } catch (error) {
        console.error("Status update failed:", error);
        throw error;
    }
};

export const inviteUser = (orgId, payload) => async (dispatch) => {
    try {
        // payload: { email, role }
        const response = await UserManagement.inviteUser(orgId, payload);
        // Refresh the user list so the invited user appears (if backend adds them immediately)
        dispatch(getUserList(orgId));
        return response;
    } catch (error) {
        console.error("Invite user failed:", error);
        throw error;
    }
};

export const deleteUser = (orgId, userId) => async (dispatch) => {
    try {
        const response = await UserManagement.deleteUser(orgId, userId);
        // Refresh user list after successful deletion
        dispatch(getUserList(orgId));
        return response;
    } catch (error) {
        console.error("Delete user failed:", error);
        throw error;
    }
};