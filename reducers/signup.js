import { LOGOUT_USER } from '../actions/auth';
import _cloneDeep from 'lodash/cloneDeep';
// import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _isEqual from 'lodash/isEqual';
import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
const initialState = {
    newDoctor: {},
    availableUsers: false,
    usernameChanging: false,
    isRequesting: false,
    documentTypes: [],
    uploadingDoc: false,
    npiData: {},
    uploadedDoc: [],
    saveUser: '',
    alertMsgs: [],
    countries: [],
};

export default function signup(state = initialState, action) {
    let tempDoctor;
    let tempAssistant;
    let tmpAssDetails;
    let tmpDrDetails;
    let tmpDrCr;
    let tmpMedFac;
    let tempDocs;
    let tempIndex;
    let tempDoc;
    switch (action.type) {
        case 'SAVE_DOCTOR_BASIC_DETAILS':
            tempDoctor = Object.assign({}, _cloneDeep(state['newDoctor']));
            tmpDrDetails = Object.assign({}, _cloneDeep(tempDoctor.doctorDetails));
            tmpDrDetails = _cloneDeep(_get(action, 'details', {}));
            tempDoctor.doctorDetails = tmpDrDetails;
            return Object.assign({}, state, {
                [action.id]: tempDoctor,
            });
        case 'SAVE_DOCTOR_ASSISTANT_DETAILS':
            tempAssistant = Object.assign({}, _cloneDeep(state[action.id]));
            tmpAssDetails = Object.assign({}, _cloneDeep(tempAssistant.assistantDetails));
            tmpAssDetails = _cloneDeep(_get(action, 'details', {}));
            tempAssistant.assistantDetails = tmpAssDetails;
            return Object.assign({}, state, {
                [action.id]: tempAssistant,
            });
        case 'SAVE_DOCTOR_CREDENTIALS':
            tempDoctor = Object.assign({}, _cloneDeep(state['newDoctor']));
            tmpDrCr = Object.assign({}, _cloneDeep(tempDoctor.credentials));
            tmpDrCr = _cloneDeep(_get(action, 'details', {}));
            tempDoctor.credentials = tmpDrCr;
            return Object.assign({}, state, {
                [action.id]: tempDoctor,
            });
        case 'NEW_MEDICAL_FACILITY':
            tempDoctor = Object.assign({}, _cloneDeep(state['newDoctor']));
            tmpMedFac = Object.assign({}, _cloneDeep(tempDoctor.newMedicalProcedure));
            tmpMedFac = _cloneDeep(_get(action, 'details', {}));
            tempDoctor.newMedicalProcedure = tmpMedFac;
            return Object.assign({}, state, {
                [action.id]: tempDoctor,
            });
        case 'SET_SOLO_PHYSITITION':
            tempDoctor = Object.assign({}, _cloneDeep(state['newDoctor']));
            tmpMedFac = Object.assign({}, _cloneDeep(tempDoctor.newMedicalProcedure));
            tempDoctor.isSolo = action.flag;
            return Object.assign({}, state, {
                [action.id]: tempDoctor,
            });
        case 'NEW_MEDICAL_FACILITY_BILLING_ADDRESS':
            tempDoctor = Object.assign({}, _cloneDeep(state['newDoctor']));
            tmpMedFac = Object.assign({}, _cloneDeep(tempDoctor.billingAddress));
            tmpMedFac = _cloneDeep(_get(action, 'details', {}));
            tempDoctor.billingAddress = tmpMedFac;
            return Object.assign({}, state, {
                [action.id]: tempDoctor,
            });
        case 'CLEAR_DOCTOR_SIGNUP_DATA':
            return initialState;
        case 'REQUEST_AVAILABLE_USERS':
            return Object.assign({}, state, {
                // isLoading: true,
                availableUsers: false,
                usernameChanging: false,
                isRequesting: true,
                error: '',
            });
        case 'RECEIVED_AVAILABLE_USERS':
            return Object.assign({}, state, {
                // medicalProcedureData: action.data,
                availableUsers: action.data,
                usernameChanging: false,
                isRequesting: false,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_AVAILABLE_USERS_ERROR':
            return Object.assign({}, state, {
                // patientData: action.data,
                availableUsers: false,
                usernameChanging: false,
                isRequesting: false,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'REQUEST_NEW_USER':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'SET_AVAILABLE_USERS_FLAG':
            console.log('camein set available users flag');
            return Object.assign({}, state, {
                availableUsers: action.availableUsers,
                usernameChanging: true,
                error: '',
            });
        case 'RECEIVED_NEW_USER':
            return Object.assign({}, state, {
                // medicalProcedureData: action.data,
                saveUser: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_NEW_USER_ERROR':
            return Object.assign({}, state, {
                // patientData: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'RESET_UPLOAD_DOC':
            tempDocs = _cloneDeep(state['uploadedDoc']) || [];
            tempDocs = [];
            return Object.assign({}, state, {
                uploadedDoc: tempDocs,
                error: '',
            });
        case 'REQUEST_UPLOAD_DOC':
            tempDocs = _cloneDeep(state['uploadedDoc']) || [];
            tempDoc = action.doc;
            tempDoc.uploadingDoc = true;
            tempDoc.status = '';
            tempDocs.push(tempDoc);
            return Object.assign({}, state, {
                uploadingDoc: true,
                uploadedDoc: tempDocs,
                error: '',
            });
        case 'RECEIVED_UPLOAD_DOC':
            tempDocs = _cloneDeep(state['uploadedDoc']) || [];
            tempIndex = _findIndex(tempDocs, { 'fileName': _get(action, 'doc.fileName') });
            console.log('index in uploaded doc reducer', tempIndex);
            tempDocs[tempIndex].uploadingDoc = false;
            tempDocs[tempIndex].dataFromServer = _get(action, 'data', {});
            tempDocs[tempIndex].status = 'Uploaded';
            return Object.assign({}, state, {
                // medicalProcedureData: action.data,
                uploadedDoc: tempDocs,
                status: action.status,
                uploadingDoc: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_UPLOAD_DOC_ERROR':
            tempDocs = _cloneDeep(state['uploadedDoc']) || [];
            tempIndex = _findIndex(tempDocs, { 'fileName': _get(action, 'doc.fileName') });
            console.log('index in uploaded doc reducer error', tempIndex);
            tempDocs[tempIndex].uploadingDoc = false;
            tempDocs[tempIndex].status = 'Failed';
            return Object.assign({}, state, {
                // patientData: action.data,
                uploadedDoc: tempDocs,
                status: action.status,
                uploadingDoc: false,
                isFetching: false,
                error: action.error,
            });
        case 'REMOVE_DOC':
            tempDocs = _cloneDeep(state['uploadedDoc']) || [];
            tempDoc = action.doc;
            _isArray(tempDocs) && tempDocs.map((arrayDoc, index) => {
                if (_isEqual(arrayDoc, tempDoc)) {
                    tempDocs[index].isDeleted = true;
                }
            });
            return Object.assign({}, state, {
                uploadingDoc: true,
                uploadedDoc: tempDocs,
                error: '',
            });
        case 'REQUEST_DOCUMENT_TYPE':
            return Object.assign({}, state, {
                // isLoading: true,
                // documentTypes: [],
                error: '',
            });
        case 'RECEIVED_DOCUMENT_TYPE':
            return Object.assign({}, state, {
                documentTypes: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_DOCUMENT_TYPE_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'REQUEST_NPI_DATA':
            return Object.assign({}, state, {
                // isLoading: true,
                fetchingNpiData: true,
                npiData: {},
                error: '',
            });
        case 'RECEIVED_NPI_DATA':
            console.log('came in received npi data reducer...', action.data);
            return Object.assign({}, state, {
                npiData: _cloneDeep(action.data),
                fetchingNpiData: false,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_NPI_DATA_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                fetchingNpiData: false,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'REQUEST_ALERT_MSGS':
            return Object.assign({}, state, {
                // isLoading: true,
                error: '',
            });
        case 'RECEIVED_ALERT_MSGS':
            return Object.assign({}, state, {
                alertMsgs: _cloneDeep(action.data),
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_ALERT_MSGS_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case 'REQUEST_COUNTRIES':
            return Object.assign({}, state, {
                // isLoading: true,
                countries: [],
                error: '',
            });
        case 'RECEIVED_COUNTRIES':
            return Object.assign({}, state, {
                // medicalProcedureData: action.data,
                countries: action.data,
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: '',
            });
        case 'RECEIVED_COUNTRIES_ERROR':
            return Object.assign({}, state, {
                // patientData: action.data,
                countries: [],
                status: action.status,
                isLoading: false,
                isFetching: false,
                error: action.error,
            });
        case LOGOUT_USER:
            return initialState;

        default:
            return state;
    }
}
