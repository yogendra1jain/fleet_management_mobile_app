import { getCurrentTime } from '../utils';

export const ENABLE_NATIVE_AUTH = 'ENABLE_NATIVE_AUTH';
export const DISABLE_NATIVE_AUTH = 'DISABLE_NATIVE_AUTH';
export const UPDATE_AUTH_TIME = 'UPDATE_AUTH_TIME';

export const setupNativeAuth = (method, pin) => {
    return (dispatch) => {
        dispatch({
            type: ENABLE_NATIVE_AUTH,
            method,
            pin,
        });
        dispatch(updateAuthTime());
    };
};

export const updateAuthTime = () => {
    return {
        type: UPDATE_AUTH_TIME,
        lastSuccessTime: getCurrentTime(),
    };
};

export const disableNativeAuth = () => {
    return {
        type: DISABLE_NATIVE_AUTH,
    };
};

