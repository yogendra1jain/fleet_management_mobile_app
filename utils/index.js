import { AXIOS } from '../App';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import _cloneDeep from 'lodash/cloneDeep';
// import uuidv1 from 'uuid/v1';
import { Alert } from 'react-native';
import { Toast } from 'native-base';
import firebase from 'react-native-firebase';

const generateV1uuid = () => '21112';

export {
    generateV1uuid,
};

export const getAPI = (path, ...params) => {
    let api = path;
    if (params) {
        params.forEach((param) => {
            api = api + '/' + param;
        });
    }
    return api;
};

// export const getUniqueId = () => {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// };

export const getActiveRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    if (navigationState.routes) {
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return getActiveRouteName(route);
        }
        return route.routeName;
    } else {
        return navigationState.routeName;
    }
};

export const getCurrentTime = () => {
    return new Date().getTime();
};
export const setAxiosAuthHeader = (token) => {
    // console.log('came in axios token setter');
    if (token) {
        AXIOS.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
};

export function getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    // console.log('birth date', birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    // console.log('age', age);
    return age;
}
export function getUSADate(date) {
    // console.log('date in getusadate method', date);
    if (date != '' && date != '-') {
        return moment(date).format('DD/MMM/YYYY');
    } else {
        return date;
    }
}
export function getUSADateTime(date) {
    // console.log('date in getusadate method', date);
    if (date != '' && date != '-') {
        return moment(date).format('DD/MMM/YYYY hh:mm A');
    } else {
        return date;
    }
}

export function getEncodedSSN(ssn) {
    let encodedSSN = '';
    if (!_isEmpty(ssn) && ssn.toString().length == 9) {
        let lastFourDigits = ssn.substring(5, 9);
        encodedSSN = 'XXXXX' + lastFourDigits;
    }
    return encodedSSN;
}
export function getFormatedPhoneNumber(phoneNumber) {
    let formatedNumber = '';
    if (!_isEmpty(phoneNumber) && phoneNumber.toString().length == 10) {
        formatedNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6);
    }
    return formatedNumber;
}

export function getCurrencySymbols(code) {
    let symbol = '';
    switch (code) {
        case 'USD':
            symbol = '$';
            break;
    }
    return symbol;
}
export function getPackagedQuantity(orderDetails, itemId) {
    let packagedQuantity = _find(orderDetails.packagedQuantity, { 'itemId': itemId });
    let dispatchedQuantity = _find(orderDetails.dispatchedQuantity, { 'itemId': itemId });
    let deliveredQuantity = _find(orderDetails.deliveredQuantity, { 'itemId': itemId });
    return {
        packagedQuantity,
        dispatchedQuantity,
        deliveredQuantity,
    };
}
export function getNumberInMillion(num) {
    let convertedNumber = (num / 1000000).toFixed(2);
    return convertedNumber.toString() + 'M';
}
export function isInt(n) {
    return n % 1 === 0;
}
export function convertToExp(n) {
    if (!isNaN(n)) {
        return n.toExponential();
    } else {
        return n;
    }
}

export function getRenamedStatus(status) {
    let modifiedStatus = '';
    switch (status) {
        case 'IN_TRANSIT':
            modifiedStatus = 'IN TRANSIT';
            break;
        case 'IN_PROGRESS':
            modifiedStatus = 'IN PROGRESS';
            break;
        case 'ACCEPTED':
            modifiedStatus = 'ACCEPTED';
            break;
        case 'REJECTED':
            modifiedStatus = 'REJECTED';
            break;
        case 'CANCELLED':
            modifiedStatus = 'CANCELED';
            break;
        case 'REFUNDED':
            modifiedStatus = 'REFUNDED';
            break;
        case 'PACKAGED':
            modifiedStatus = 'PACKAGED';
            break;
        case 'PART_DISPATCHED':
            modifiedStatus = 'PART DISPATCHED';
            break;
        case 'PART_PACKAGED':
            modifiedStatus = 'PART PACKAGED';
            break;
        case 'PART_DELIVERED':
            modifiedStatus = 'PART DELIVERED';
            break;
        case 'READY_FOR_DISPATCH':
            modifiedStatus = 'READY FOR DISPATCH';
            break;
        case 'RETURNED':
            modifiedStatus = 'RETURNED';
            break;
        case 'INCOMING':
            modifiedStatus = 'INCOMING';
            break;
        case 'DELIVERED':
            modifiedStatus = 'DELIVERED';
            break;
        case 'UNWIND':
            modifiedStatus = 'UNWOUND';
            break;
        case 'DISPATCHED':
            modifiedStatus = 'DISPATCHED';
            break;
        case 'DONE':
            modifiedStatus = 'DONE';
            break;
        case 'UNWOUND':
            modifiedStatus = 'UNWOUND';
            break;
    }
    return modifiedStatus;
}

export function getInProgressPackageDetails(inProcessOrders, orderId, packageId, tempItemId, orderDetails) {
    let tempInProgressOrders = Object.assign({}, _cloneDeep(inProcessOrders));
    let updatedObj = Object.assign({}, _cloneDeep(tempInProgressOrders[orderId]));
    let tempPackage = Object.assign({}, _cloneDeep(updatedObj[packageId]));
    let removedVialsList = _cloneDeep(tempPackage.removedVialsList) || [];

    let completeQuantities = getPackagedQuantity(orderDetails, tempItemId);
    let tempItem = Object.assign({}, _cloneDeep(tempPackage[tempItemId]));
    let vialList = _cloneDeep(tempItem.vialList) || [];
    let packagedItemQuantity = (_get(completeQuantities, 'dispatchedQuantity.quantity', 0)
        + _get(completeQuantities, 'deliveredQuantity.quantity', 0)
        + _get(completeQuantities, 'packagedQuantity.quantity', 0));
    let tempQ = 0;
    if (_isArray(removedVialsList)) {
        removedVialsList.map((vl, index) => {
            if (vl.itemId == tempItemId) {
                tempQ += 1;
            }
        });
    }
    packagedItemQuantity = Math.abs(packagedItemQuantity - tempQ);
    return {
        tempInProgressOrders,
        updatedObj,
        tempPackage,
        removedVialsList,
        packagedItemQuantity,
        tempItem,
        vialList,
    };
}
export function showAlert(title, message) {
    return (
        Alert.alert(
            `${title}`,
            `${message}`,
            [
                { text: 'OK', onPress: () => { } },
            ],
            { cancelable: false }
        )
    );
}

export function showToast(type, text, duration, position='bottom') {
    return (
        Toast.show({
            text: text,
            type: type,
            duration: duration,
            position: position,
        })
    );
}

export function splitId(id) {
    if (typeof (id) == 'string') {
        if (id.indexOf('#') != -1) {
            return id.split('#')[1];
        } else {
            return id;
        }
    } else {
        return '';
    }
}

export function logError(title = '', error, status = 500) {
    console.log(`error in catch of ${title}`, JSON.stringify(error));
    showToast('danger', JSON.stringify(error), 3000);
    firebase.crashlytics().recordError(Number(status), `error in ${title} ${JSON.stringify(error)}`);
}

export function compareAppVersion(serverVersion, appVersion) {
    if (serverVersion == '') {
        return true;
    }
    let splittedServerVersion = serverVersion.split('.');
    let splitedAppVersion = appVersion.split('.');
    let firstDigitComparision = compareSingleDigit(Number(splittedServerVersion[0]), Number(splitedAppVersion[0]));
    if (firstDigitComparision == 'less') {
        return false;
    } else if (firstDigitComparision == 'greater') {
        return true;
    } else {
        let secondDigitComparision = compareSingleDigit(Number(splittedServerVersion[1]), Number(splitedAppVersion[1]));
        if (secondDigitComparision == 'less') {
            return false;
        } else if (secondDigitComparision == 'greater') {
            return true;
        } else {
            let thirdDigitComparision = compareSingleDigit(Number(splittedServerVersion[2]), Number(splitedAppVersion[2]));
            if (thirdDigitComparision == 'less') {
                return false;
            } else if (thirdDigitComparision == 'greater' || thirdDigitComparision == 'equal') {
                return true;
            }
        }
    }
}
function compareSingleDigit(serverDigit, appDigit) {
    if (appDigit < serverDigit) {
        return 'less';
    } else if (appDigit == serverDigit) {
        return 'equal';
    } else {
        return 'greater';
    }
}

export function mapDateToDay(date) {
    let finalDay = date;
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1;
    let year = today.getFullYear();

    let newDate = new Date(date);
    let dayForDate = newDate.getDate();
    let monthForDate = newDate.getMonth()+1;
    let yearForDate = newDate.getFullYear();

    if (year == yearForDate) {
        if (month == monthForDate) {
            if (day == dayForDate) {
                finalDay = 'Today';
            } else if (day+1 == dayForDate) {
                finalDay = 'Tomorrow';
            } else if (day-1 == dayForDate) {
                finalDay = 'yesterday';
            }
        }
    }
    return finalDay;
}
/*
export const postAPI = (username, path, paramObj, addOnOptions, addOnHeaders) => {
    let api = restServerConfig.httpURL + 'api/'+ path;
    let headers = {
        'Cookie': authCookies[username]
    };
    headers = Object.assign({}, headers, addOnHeaders);
    let options = {
        headers: headers,
        withCredentials: true
    };
    options = Object.assign({}, options, addOnOptions);
    return [api, paramObj, options];
}


        //The Interval function can be written like this as well. Just keeping for reference
        const timerFn = () => {
            this.controls.timeout = setTimeout(() => {
                if(waitTime == 0) {
                    this.setState({waitTime: 0, entryError: false, attemptsDone: 0});
                    onCompletion();
                } else {
                    waitTime = waitTime - 1;
                    this.setState({waitTime});
                    timerFn();
                }
            }, 1000);
        };
        timerFn();
*/
