import NavigationService from '../navigators/NavigationService';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
export const UPDATE_USER_STATUS = 'update_user_info';
export const LOGOUT_USER = 'logout_user';
export const AUTHENTICATE_USER = 'authenticate_user';
import { AXIOS } from '../App';
import { setAxiosAuthHeader, logError } from '../utils';
import * as AUTH_CONSTANTS from '../constants/auth';
import { navigateToHome } from '../utils/navigationHelpers';
import jwtDecode from 'jwt-decode';
import { Toast } from 'native-base';
import { fetchUserDetails } from './user';
import firebase from 'react-native-firebase';

const getURL = () => {
  const baseUrl = '';
  return baseUrl;
};

const receiveUserStatus = (json, decodedToken, status) => (
  {
    type: AUTH_CONSTANTS.RECEIVED_USER_STATUS,

    data: json,
    decodedToken: decodedToken,
    status: status,
    receivedAt: Date.now(),
  });

const receiveUserStatusError = (error, status) => (
  {
    type: AUTH_CONSTANTS.RECEIVED_USER_STATUS_ERROR,
    error: error,
    status: status,
    receivedAt: Date.now(),
  });

export const logoutUser = () => {
  setAxiosAuthHeader('');
  return (dispatch) => {
    dispatch({
      type: LOGOUT_USER,
    });
    NavigationService.navigate('WhichUser');
  };
};

export const resetUser = () => {
  return logoutUser();
};

export const login = (data) => {
  return (dispatch) => {
    dispatch({
      type: AUTH_CONSTANTS.REQUEST_LOGIN,
    });
    AXIOS.post('/login/Login', data)
        .then((response) => {
          let data = response.data;
          let decodedToken = jwtDecode(data.token);
          dispatch(receiveUserStatus(data, decodedToken, response.status));
          // if (_get(decodedToken, 'role') != 'Doctor' && _get(decodedToken, 'role') != 'MedicalAssistant' &&
          // _get(decodedToken, 'role') != 'ManufacturerAdmin' && _get(decodedToken, 'role') != 'ShipperUser' && _get(decodedToken, 'role') != 'DistributorStaff') {
          //     Toast.show({
          //         text: 'User is not valid.',
          //         type: 'danger',
          //         duration: 2000,
          //         position: 'top',
          //     });
          //     NavigationService.navigate('WhichUser');
          //     return;
          // }
          if (!_isEmpty(data.token)) {
            firebase.crashlytics().setUserIdentifier(decodedToken.id);
            let data = {
              id: _get(decodedToken, 'FleetUser.id', ''),
            };
            setAxiosAuthHeader(data.token);
            // dispatch(fetchUserDetails(data, true, true));
            Toast.show({
              text: 'LoggedIn successfully',
              type: 'success',
              duration: 3000,
              position: 'top',
            });
            // NavigationService.navigate('Home');
            navigateToHome(dispatch);
          }
        }
        )
        .catch((err) => {
          Toast.show({
            text: _get(err, 'response.data.msg', 'Something went wrong.'),
            type: 'danger',
            duration: 2000,
            position: 'top',
          });
          logError('login', _get(err, 'response.data', ''), err.status);
          dispatch(receiveUserStatusError(_get(err, 'response', ''), err.status));
        });
  };
};

const receiveUpdatePasswordStatus = (json, status) => (
  {
    type: 'RECEIVED_UPDATE_PASSWORD',
    data: json,
    status: status,
    receivedAt: Date.now(),
  });

const receiveUpdatePasswordStatusError = (error, status) => (
  {
    type: 'RECEIVED_UPDATE_PASSWORD_ERROR',
    error: error,
    status: status,
    receivedAt: Date.now(),
  });
export const updatePassword = (data) => {
  return (dispatch) => {
    dispatch({
      type: 'REQUEST_UPDATE_PASSWORD',
    });
    console.log('data for update password');
    AXIOS.post('/ClientUser/ResetPassword', data)
        .then((response) => {
          let data = response.data;
          Toast.show({
            text: 'Password is Updated Successfully.',
            type: 'success',
            duration: 2000,
            position: 'top',
          });
          dispatch(receiveUpdatePasswordStatus(data, response.status));
          navigateToHome(dispatch);
        }
        )
        .catch((err) => {
          Toast.show({
            text: `${_get(err, 'response.data.msg', 'Something went wrong')}.`,
            type: 'danger',
            duration: 2000,
            position: 'top',
          });
          logError('update Password', _get(err, 'response.data', ''), err.status);
          dispatch(receiveUpdatePasswordStatusError(_get(err, 'response.data', ''), err.status));
        });
  };
};

export const clearError = () => {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_ERROR',
    });
  };
};


const receiveAvailableVials = (json, status) => {
  return (dispatch) => {
    dispatch(
        {
          type: 'RECEIVED_AVAILABLE_VIAL',
          data: json,
          status: status,
          receivedAt: Date.now(),
        });
  };
};
const receiveAvailableVialsError = (error, status) => (
  {
    type: 'RECEIVED_AVAILABLE_VIAL_ERROR',
    error: error,
    status: status,
    receivedAt: Date.now(),
  }
);

export const fetchAvailableVails = (user, isLoading) => {
  return (dispatch) => {
    dispatch({
      type: 'REQUEST_AVAILABLE_VIAL',
      isLoading: isLoading != undefined ? isLoading : true,
    });
    let encodedUser = encodeURIComponent(user);
    // }
    AXIOS.get(`${getURL()}/api/availableVials?medicalFacility=${encodedUser}`)
        .then((response) => {
          let data = response.data;
          console.log('success response after available vials service call');
          dispatch(receiveAvailableVials(data, response.status));
        }
        )
        .catch((err) => {
          logError('available vials', _get(err, 'response.data', ''), err.status);
          dispatch(receiveAvailableVialsError(_get(err, 'response.data', ''), err.status));
        });
  };
};

export const setLoadingFalse = () => {
  return (dispatch) => {
    dispatch({
      type: 'SET_LOADER_FALSE',
    });
  };
};

export const setTimer = (time) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_TIMER',
      time: time,
    });
  };
};

export const callScanFingerPrint = (isScanEnabled) => {
  return (dispatch) => {
    dispatch({
      type: 'CALL_SCAN_FINGERPRINT',
      isScanFingerPrint: isScanEnabled,
    });
  };
};

export const setCheckInAsset = (isCheckInAsset) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_CHECKIN_ASSET',
      isCheckInAsset: isCheckInAsset,
    });
  };
};

export const timerFunc = (time) => {
  return (dispatch) => {
    let waitTime = time;
    let timer;
    timer = setInterval(() => {
      if (waitTime == 0) {
        clearInterval(timer);
        dispatch(setTimer(waitTime));
        dispatch(setCheckInAsset(true));
      } else {
        waitTime = waitTime - 1;
        dispatch(setTimer(waitTime));
        dispatch(setCheckInAsset(false));
      }
    }, 1000);
  };
};

