

import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import { clearProfile } from '../profile/reducer';

export const loginUser = (user, history) => async (dispatch) => {

  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = ({ loginUser: () => Promise.resolve(), socialLoginUser: () => Promise.resolve(), logout: Promise.resolve() });
      response = fireBaseBackend.loginUser(
        user.email,
        user.password
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = (() => Promise.resolve())({
        email: user.email,
        password: user.password
      });

    } else if (process.env.REACT_APP_API_URL) {
      response = (() => Promise.resolve())({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;

    if (data) {
      sessionStorage.setItem("authUser", JSON.stringify(data));
      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        var finallogin = JSON.stringify(data);
        finallogin = JSON.parse(finallogin)
        data = finallogin.data;
        if (finallogin.status === "success") {
          dispatch(loginSuccess(data));
          history('/dashboard')
        } else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(data));
        history('/dashboard')
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    localStorage.clear();

    // Purge Redux memory so User A's data doesn't persist into User B's dashboard!
    dispatch(clearProfile());

    let fireBaseBackend = ({ loginUser: () => Promise.resolve(), socialLoginUser: () => Promise.resolve(), logout: Promise.resolve() });
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = ({ loginUser: () => Promise.resolve(), socialLoginUser: () => Promise.resolve(), logout: Promise.resolve() });
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history('/dashboard')
    }

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};