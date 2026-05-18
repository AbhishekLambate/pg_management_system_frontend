import { UserManagement } from "../../../helpers/firebase_helper";
// action
import { profileSuccess, profileError, resetProfileFlagChange } from "./reducer";

export const fetchUserProfile = () => async (dispatch) => {
    try {
        const response = await UserManagement.getProfile();
        if (response) {
            dispatch(profileSuccess(response));
        }
    } catch (error) {
        dispatch(profileError(error?.message || "Failed to load profile"));
    }
};

export const editProfile = (user) => async (dispatch) => {
    try {
        // TODO: Wire this to your actual UserManagement REST API like:
        // const response = await UserManagement.updateProfile(user);

        console.warn("REST API updateProfile not implemented yet! Simulating success...");
        const data = user;

        if (data) {
            dispatch(profileSuccess(data));
        }
    } catch (error) {
        dispatch(profileError(error));
    }
};

export const resetProfileFlag = () => {
    try {
        return resetProfileFlagChange();
    } catch (error) {
        return error;
    }
};