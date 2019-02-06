import { LOGOUT_USER } from '../actions/auth';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _set from 'lodash/set';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import { getPackagedQuantity } from '../utils';
const initialState = {
    manufacturerList: [],
    unfetchedVials: [],
    taskDetails: {},
    itemsList: [],
    clientAuthData: {},
    taskList: [],
    paymentDetails: {},
    itemDetails: {},
    unwindPackage: {},
    orderList: [],
    orderDetails: {},
    inProcessOrders: {},
    savedOrderDetails: {},
    deliveryOptions: [],
    promoOptions: [],
    cart: {},
    status: '',
    isLoading: false,
};

function getUpdatedOrderLevelVialList(tempPackage, packageVialList) {
    let tempIndex;
    _map(tempPackage, (value, key) => {
        if (value.vialList && value.vialList.length) {
            value.vialList.map((vial, index) => {
                tempIndex = _findIndex(packageVialList, { 'id': _get(vial, 'id') });
                packageVialList.splice(tempIndex, 1);
            });
        }
    });
    return packageVialList;
}

export default function orders(state = initialState, action) {
    let tempCartObj;
    let updatedObj;
    let tempInProgressOrders;
    let vialList;
    let tempIndex;
    let tempItemIndex;
    let tempItem;
    let tempVial;
    let tempItemId;
    let tempQrCode;
    // let tempItemObj;
    let originalItem;
    let tempUnfetchVialList;
    let tempPackage;
    let packagedItemQuantity;
    let packageVialList;
    let tempOrderDetails;
    let requiredQuantity;
    let completeQuantities;
    let tempQ;
    let removedVialsList;
    // let tempPackageItem;
    let tempVial11;
    switch (action.type) {
        case 'REQUEST_SAVE_ORDER':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_SAVE_ORDER':
            tempCartObj = Object.assign({}, state.cart);
            tempCartObj = {};
            return Object.assign({}, state, {
                cart: _cloneDeep(tempCartObj),
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_SAVE_ORDER_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_ORDER_LIST':
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                error: '',
            });
        case 'RECEIVED_ORDER_LIST':
            console.log('order list in reducer', action.data);
            return Object.assign({}, state, {
                orderList: _cloneDeep(action.data),
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_ORDER_LIST_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_ORDER_DETAILS':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_ORDER_DETAILS':
            tempOrderDetails = Object.assign({}, state.orderDetails[action.orderId]);
            return Object.assign({}, state, {
                orderDetails: _cloneDeep(action.data),
                savedOrderDetails: tempOrderDetails,
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_ORDER_DETAILS_ERROR':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: action.error,
            });
        case 'REQUEST_CANCEL_ORDER':
            return Object.assign({}, state, {
                isLoading: true,
                error: '',
            });
        case 'RECEIVED_CANCEL_ORDER':
            return Object.assign({}, state, {
                status: action.status,
                isLoading: false,
                error: '',
            });
        case 'RECEIVED_CANCEL_ORDER_ERROR':
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
