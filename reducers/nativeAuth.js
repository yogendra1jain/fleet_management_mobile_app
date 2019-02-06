import { ENABLE_NATIVE_AUTH, DISABLE_NATIVE_AUTH, UPDATE_AUTH_TIME } from '../actions/nativeAuth';
import { LOGOUT_USER } from '../actions/auth';

const initialState = {
    isEnabled: false,
    method: '', // Valid values- pin / native
    pin: '',
    lastSuccessTime: 0,
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case ENABLE_NATIVE_AUTH:
            return Object.assign({}, state, {
                isEnabled: true,
                method: action.method,
                pin: action.pin || '',
            });

        case DISABLE_NATIVE_AUTH:
        case LOGOUT_USER:
            return initialState;

        case UPDATE_AUTH_TIME:
            return Object.assign({}, state, { lastSuccessTime: action.lastSuccessTime });

        default:
            return state;
    }
}
