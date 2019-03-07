import NavigationService from '../navigators/NavigationService';
import { AXIOS } from '../App';
import _get from 'lodash/get';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
import { navigateToHome } from '../utils/navigationHelpers';
import { setLoadingFalse } from './auth';
import { logError } from './../utils';

export const updateUserProfile = (userProfile) => {
    return (dispatch) => {
        const updatedProfile = {
            uid: 'mongo-id',
            isVerified: true,
            name: userProfile.name,
            drivingLicenseNo: userProfile.drivingLicenseNo,
        };
        dispatch({
            type: UPDATE_USER_PROFILE,
            userProfile: updatedProfile,
        });
        NavigationService.navigate('UserAccount');
    };
};

export const fetchUserProfile = () => {
    return (dispatch) => {
        const userProfile = {
            uid: 'mongo-Id',
            isVerified: true,
        };
        dispatch({
            type: UPDATE_USER_PROFILE,
            userProfile,
        });
    };
};

const receiveUserDetails = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_USER_DETAILS',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveUserDetailsError = (error, status) => (
    {
        type: 'RECEIVED_USER_DETAILS_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchUserDetails = (data, isLoading, toHome = true) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_USER_DETAILS',
        });
        // }
        AXIOS.post(`/vendor/GetVendorById`, data)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch user details service', data);
                dispatch(receiveUserDetails(data, response.status));
                dispatch(setLoadingFalse);
                if (toHome) {
                    navigateToHome(dispatch);
                }
            }
            )
            .catch((err) => {
                logError('fetch fetch user details', _get(err, 'response.data', ''), err.status);
                dispatch(receiveUserDetailsError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveAssetsForOperator = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_ASSETS_FOR_OPERATOR',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveAssetsForOperatorError = (error, status) => (
    {
        type: 'RECEIVED_ASSETS_FOR_OPERATOR_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchAssetsForOperators = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_ASSETS_FOR_OPERATOR',
        });
        // }
        AXIOS.post(`/Assets/AssignedToOperator`, data)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch assets for operator');
                dispatch(receiveAssetsForOperator(data, response.status));
                // dispatch(fetchUserDetails('', '', false));
                NavigationService.navigate('AssetCheckinScreen');
            }
            )
            .catch((err) => {
                logError('save shipping address of facility', _get(err, 'response.data', ''), err.status);
                dispatch(receiveAssetsForOperatorError(_get(err, 'response.data', ''), err.status));
            });
    };
};

export const setWarnings = (showVialWarning) => {
    return (dispatch) => {
        dispatch({
            type: 'SET_WARNINGS',
            showVialWarning: showVialWarning,
        });
    };
};


const receiveAppVersion = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_APP_VERSION',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveAppVersionError = (error, status) => (
    {
        type: 'RECEIVED_APP_VERSION_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchAppVersion = () => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_APP_VERSION',
        });
        // }
        AXIOS.get(`/api/mobileappversion`)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch mobile app version service');
                dispatch(receiveAppVersion(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch mobile app version', _get(err, 'response.data', ''), err.status);
                dispatch(receiveAppVersionError(_get(err, 'response.data', ''), err.status));
            });
    };
};
