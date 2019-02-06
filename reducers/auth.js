import { LOGOUT_USER } from '../actions/auth';
import { RECEIVED_USER_STATUS, REQUEST_LOGIN, RECEIVED_USER_STATUS_ERROR } from '../constants/auth';

const initialState = {
    userStatus: {},
    isLoading: false,
    updatePasswordStatus: '',
    error: '',
    decodedToken: '',
    availableVials: 0,
    isScanFingerPrint: false,
    time: 0,
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case RECEIVED_USER_STATUS:
            return Object.assign({}, state, {
                userStatus: action.data,
                status: action.status,
                decodedToken: action.decodedToken,
                isLoading: false,
                error: '',
            });
        case 'SET_LOADER_FALSE':
            return Object.assign({}, state, {
                isLoading: false,
            });
        case RECEIVED_USER_STATUS_ERROR:
            return Object.assign({}, state, {
                status: action.status,
                decodedToken: '',
                isLoading: false,
                error: action.error,
            });
        case 'CLEAR_ERROR':
            return Object.assign({}, state, {
                error: '',
                isLoading: false,
            });
        case 'REQUEST_UPDATE_PASSWORD':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_UPDATE_PASSWORD':
            return Object.assign({}, state, {
                updatePasswordStatus: action.data,
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_UPDATE_PASSWORD_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_AVAILABLE_VIAL':
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                error: '',
            });
        case 'RECEIVED_AVAILABLE_VIAL':
            return Object.assign({}, state, {
                // medicalProcedureData: action.data,
                availableVials: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_AVAILABLE_VIAL_ERROR':
            return Object.assign({}, state, {
                // patientData: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'SET_TIMER':
            return Object.assign({}, state, {
                time: action.time,
            });
        case 'CALL_SCAN_FINGERPRINT':
            return Object.assign({}, state, {
                isScanFingerPrint: action.isScanFingerPrint,
            });

        case LOGOUT_USER:
            return initialState;

        default:
            return state;
    }
}
