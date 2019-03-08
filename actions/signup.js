import { AXIOS } from '../App';
// import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import NavigationService from '../navigators/NavigationService';
import { Toast } from 'native-base';
import { logError } from './../utils';

const getUploadUrl = () => {
    return '/Upload/File';
    // 'http://13.127.202.129:3005/media-service/doctor/media';
};
const getNpiDataUrl = () => {
    return '/api/npi/';
    // 'http://13.232.153.76:5010/doctor/npi/';
};

export const saveDoctorBasicDetails = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'SAVE_DOCTOR_BASIC_DETAILS',
            details: details,
            id: id,
        });
    };
};
export const saveDoctorAssistantDetails = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'SAVE_DOCTOR_ASSISTANT_DETAILS',
            details: details,
            id: id,
        });
    };
};

export const saveDoctorCredentials = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'SAVE_DOCTOR_CREDENTIALS',
            details: details,
            id: id,
        });
    };
};

export const newMedicalFacility = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'NEW_MEDICAL_FACILITY',
            details: details,
            id: id,
        });
    };
};
export const newMedicalFacilityBillingAddress = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'NEW_MEDICAL_FACILITY_BILLING_ADDRESS',
            details: details,
            id: id,
        });
    };
};
export const setSoloPhysitition = (flag, id) => {
    return (dispatch) => {
        dispatch({
            type: 'SET_SOLO_PHYSITITION',
            flag: flag,
            id: id,
        });
    };
};

export const clearNewDoctorData = (details, id) => {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_DOCTOR_SIGNUP_DATA',
            id: id,
        });
    };
};

const receiveAvailableUsers = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_AVAILABLE_USERS',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveAvailableUsersError = (error, status) => (
    {
        type: 'RECEIVED_AVAILABLE_USERS_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchAvailableUsers = (credentials) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_AVAILABLE_USERS',
        });
        // }
        AXIOS.get(`/lookup/UserName/${credentials.userName}`)
            .then((response) => {
                let data = response.data;
                if (data && data == true) {
                    Toast.show({
                        text: 'User name is Available.',
                        type: 'success',
                        duration: 2000,
                        position: 'top',
                    });
                }
                console.log('success response after available Users service call');
                dispatch(receiveAvailableUsers(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch available users info', _get(err, 'response.data', ''), err.status);
                dispatch(receiveAvailableUsersError(_get(err, 'response.data', ''), err.status));
            });
    };
};
export const userNameChangeHandler = (availableUsers) => {
    return (dispatch) => {
        dispatch({
            type: 'SET_AVAILABLE_USERS_FLAG',
            availableUsers: availableUsers,
        });
    };
};

const receiveNewUser = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_NEW_USER',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveNewUserError = (error, status) => (
    {
        type: 'RECEIVED_NEW_USER_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const saveNewUser = (data, distributor) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_NEW_USER',
        });
        // }
        AXIOS.post(`/api/RegisterDoctor`, data)
            .then((response) => {
                let data = response.data;
                console.log('success response after save USer service call');
                dispatch(receiveNewUser(data, response.status));
                Toast.show({
                    text: 'Request for New User Created Successfully.',
                    type: 'success',
                    duration: 2000,
                    position: 'top',
                });
                NavigationService.navigate('SuccessScreen', { distributor: distributor });
            }
            )
            .catch((err) => {
                Toast.show({
                    text: _get(err, 'response.data.message', 'Something went wrong.'),
                    type: 'danger',
                    duration: 2000,
                    position: 'top',
                });
                logError('save new user', _get(err, 'response.data', ''), err.status);
                dispatch(receiveNewUserError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveUploadDoc = (json, status, doc) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_UPLOAD_DOC',
                data: json,
                doc: doc,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveUploadDocError = (error, status, doc) => (
    {
        type: 'RECEIVED_UPLOAD_DOC_ERROR',
        error: error,
        doc: doc,
        status: status,
        receivedAt: Date.now(),
    }
);

export const uploadDoc = (data, doc) => {
    let docData = doc;
    delete docData['data'];
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_UPLOAD_DOC',
            doc: docData,
        });
        // }
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data; charset=utf-8;',
            },
        };
        AXIOS.post(`${getUploadUrl()}`, data, config)
            .then((response) => {
                let data = response.data;
                Toast.show({
                    text: `Document uploaded successfully.`,
                    type: 'success',
                    duration: 2000,
                    position: 'top',
                });
                console.log('success response after upload doc service call', response);
                dispatch(receiveUploadDoc(data, response.status, docData));
            }
            )
            .catch((err) => {
                Toast.show({
                    text: _get(err, 'response.data.message', 'Something went wrong.'),
                    type: 'danger',
                    duration: 2000,
                    position: 'top',
                });
                logError('upload doc', _get(err, 'response.data', ''), err.status);
                dispatch(receiveUploadDocError(_get(err, 'response.data', ''), err.status, docData));
            });
    };
};

export const removeDoc = (doc) => {
    return (dispatch) => {
        dispatch({
            type: 'REMOVE_DOC',
            doc: doc,
        });
    };
};

const receiveNpiData = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_NPI_DATA',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveNpiDataError = (error, status) => (
    {
        type: 'RECEIVED_NPI_DATA_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchNpiData = (npi, isMedicalFacility) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_NPI_DATA',
        });
        // }
        let url = '';
        if (isMedicalFacility) {
            url = `/api/medicalFacilityByNPI/`;
        } else {
            url = `${getNpiDataUrl()}`;
        }
        AXIOS.get(`${url}${npi}`)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch npi data service call');
                dispatch(receiveNpiData(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch npi data', _get(err, 'response.data', ''), err.status);
                dispatch(receiveNpiDataError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveDocumentType = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_DOCUMENT_TYPE',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
export const resetDocumentList = () => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RESET_UPLOAD_DOC',
                receivedAt: Date.now(),
            });
    };
};
const receiveDocumentTypeError = (error, status) => (
    {
        type: 'RECEIVED_DOCUMENT_TYPE_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchDocumentType = (credentials) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_DOCUMENT_TYPE',
        });
        // }
        AXIOS.get(`/api/documentTypes`)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch document type service call');
                dispatch(receiveDocumentType(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch document type list', _get(err, 'response.data', ''), err.status);
                dispatch(receiveDocumentTypeError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveAlertMsgs = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_ALERT_MSGS',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveAlertMsgsError = (error, status) => (
    {
        type: 'RECEIVED_ALERT_MSGS_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchAlertMsgs = () => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_ALERT_MSGS',
        });
        // }
        AXIOS.get(`/api/appMessages`)
            .then((response) => {
                let data = response.data;
                console.log('success response after fetch alert msgs service call', response);
                dispatch(receiveAlertMsgs(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch alert msgs', _get(err, 'response.data', ''), err.status);
                dispatch(receiveAlertMsgsError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveCountries = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_COUNTRIES',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveCountriesError = (error, status) => (
    {
        type: 'RECEIVED_COUNTRIES_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchCountries = (credentials) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_COUNTRIES',
        });
        // }
        AXIOS.get(`/api/countries`)
            .then((response) => {
                let data = response.data;
                console.log('success response after available Fetch Countries');
                dispatch(receiveCountries(data, response.status));
            }
            )
            .catch((err) => {
                logError('fetch Countries List', _get(err, 'response.data', ''), err.status);
                dispatch(receiveCountriesError(_get(err, 'response.data', ''), err.status));
            });
    };
};