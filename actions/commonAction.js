import {
  AXIOS,
} from '../App';
import _get from 'lodash/get';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

import {
  logError, showToast
} from './../utils';
import { lang } from 'moment';


export const request = (constants, identifier) => {
  return ({
    type: constants.init,
    identifier: identifier,
  });
};

export const receive = (json, status, resolve, constants, identifier, key) => {
  resolve(json);
  return {
    type: constants.success,
    data: json,
    identifier: identifier,
    key: key,
    status: status,
  };
};

export const receiveError = (err, errCode, reject, constants, identifier, key) => {
  reject(err);
  return ({
    type: constants.error,
    error: err,
    errorCode: errCode,
    identifier: identifier,
    key: key,
  });
};


export const postData = (url, data, constants, identifier, key) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(request(constants, identifier));
    AXIOS.post(`${url}`, data)
        .then((response) => {
          let data = response.data;
          dispatch(receive(data, response.status, resolve, constants, identifier, key));
        })
        .catch((err) => {
          logError('fetch ', _get(err, 'response.data', ''), err.status);
          dispatch(receiveError(_get(err, 'response.data', ''), err.status, reject, constants, identifier, key));
        });
  });
};


export const setLanguage = (language) => {
  return ({
    type: 'SET_APP_LANGUAGE',
    language: language,
  });
};

export const setCustomData = (data, constants, identifier, key) => {
  return ({
    type: constants.init,
    data: data,
    identifier: identifier,
    key: key,
  });
};
