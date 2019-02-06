import { AXIOS } from '../App';
import _get from 'lodash/get';
// import NavigationService from '../navigators/NavigationService';
import { Toast } from 'native-base';
import { logError, showToast } from '../utils';

const getURL = () => {
    const baseUrl = '';
    return baseUrl;
};

const receiveOrderList = (json, status) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_ORDER_LIST',
                data: json,
                status: status,
                receivedAt: Date.now(),
            });
    };
};
const receiveOrderListError = (error, status) => (
    {
        type: 'RECEIVED_ORDER_LIST_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchOrderList = (isLoading, data) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_ORDER_LIST',
            isLoading: isLoading != undefined ? isLoading : true,
        });
        console.log('camein fetch order request');
        AXIOS.post(`/vendor/OrdersForVendor`, data)
            .then((response) => {
                console.log('response after fetch Order service call', response);
                let data = response.data;
                // data = _sortBy(data, 'modifiedDate');
                // data = _reverse(data);

                dispatch(receiveOrderList(data, response.status));
            }
            )
            .catch((err) => {
                showToast('danger', JSON.stringify(_get(err, 'response.data', '')), 3000);
                // Toast.show({
                //     text: JSON.stringify(_get(err, 'response.data', '')),
                //     type: 'danger',
                //     duration: 4000,
                // });
                logError('fetch Order', _get(err, 'response.data', ''), err.status);
                dispatch(receiveOrderListError(_get(err, 'response.data', ''), err.status));
            });
    };
};


const receiveOrderDetails = (json, status, orderId) => {
    return (dispatch) => {
        dispatch(
            {
                type: 'RECEIVED_ORDER_DETAILS',
                data: json,
                status: status,
                orderId: orderId,
                receivedAt: Date.now(),
            });
    };
};
const receiveOrderDetailsError = (error, status) => (
    {
        type: 'RECEIVED_ORDER_DETAILS_ERROR',
        error: error,
        status: status,
        receivedAt: Date.now(),
    }
);

export const fetchOrderDetails = (orderId) => {
    return (dispatch) => {
        dispatch({
            type: 'REQUEST_ORDER_DETAILS',
            isLoading: true,
        });
        AXIOS.get(`${getURL()}/api/Order/${orderId}?filter[include]=resolve`)
            .then((response) => {
                console.log('response after fetch Order details service call');
                let data = response.data;
                dispatch(receiveOrderDetails(data, response.status, orderId));
            }
            )
            .catch((err) => {
                Toast.show({
                    text: 'Something went wrong.',
                    type: 'danger',
                    duration: 4000,
                });
                logError('fetch order details', _get(err, 'response.data', ''), err.status);
                dispatch(receiveOrderDetailsError(_get(err, 'response.data', ''), err.status));
            });
    };
};
