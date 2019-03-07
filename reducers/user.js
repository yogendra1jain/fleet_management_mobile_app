import { UPDATE_USER_PROFILE } from '../actions/user';
import { LOGOUT_USER } from '../actions/auth';

const initialState = {
    isLoading: false,
    userDetails: {},
    appProdVersion: '',
    showVialWarning: true,
    operatorAssets: [],
};

export default function user(state = initialState, action) {
    switch (action.type) {
        case UPDATE_USER_PROFILE:
            return action.userProfile;
        case 'REQUEST_USER_DETAILS':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_USER_DETAILS':
            console.log('data in reducer', action.data);
            return Object.assign({}, state, {
                userDetails: action.data,
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_USER_DETAILS_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_ASSETS_FOR_OPERATOR':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_ASSETS_FOR_OPERATOR':
            return Object.assign({}, state, {
                operatorAssets: action.data,
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_ASSETS_FOR_OPERATOR_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'SET_WARNINGS':
            return Object.assign({}, state, {
                showVialWarning: action.showVialWarning,
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_APP_VERSION':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
                appProdVersion: '',
            });
        case 'RECEIVED_APP_VERSION':
            return Object.assign({}, state, {
                appProdVersion: action.data,
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_APP_VERSION_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });

        case LOGOUT_USER:
            return initialState;

        default:
            return state;
    }
}
