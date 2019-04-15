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
export function isInt(n) {
    return n % 1 === 0;
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

export function formatedNumber(value1) {
        let num = this.state.num;
        let value = this.state.value;
        let currentVal = value1;
        currentVal = currentVal.split('.');
        console.log('current val', currentVal, 'prev val', num, 'email', value.email);
        let tempVal = _cloneDeep(currentVal[0]);
        tempVal = tempVal.replace(/,/g, '');
        console.log('tempval', tempVal);
        if (tempVal.toString().length % 3 == 0 && num.length < currentVal[0].length) {
            console.log('came in check..');
            currentVal[0] += ',';
        }

        console.log('current val after split', currentVal);
        if (currentVal[1] && currentVal[1].length > 2) {
            value.email = num;
            console.log('old value', value.email);
            this.setState({
                num: num,
                value,
            });
        } else {
            let newVal = currentVal[0] + (currentVal[1] || currentVal[1] == '' ? `.${currentVal[1]}`: '');
            value.email = newVal;
            console.log('email', value.email);
            this.setState({
                num: newVal,
                value,
            });
        }
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
