import { createStackNavigator } from 'react-navigation';

import UsernameScreen from '../components/auth/UsernameScreen';

// import PasswordScreen from '../components/auth/PasswordScreen';
// import OtpScreen from '../components/auth/OtpScreen';

export default AuthStack = createStackNavigator(
    {
        WhichUser: UsernameScreen,
        // WhatPassword: PasswordScreen,
        // WhatOtp: OtpScreen,
    }, {
        initialRouteName: 'WhichUser',
        navigationOptions: {

            headerStyle: {
                backgroundColor: '#0d7aaa',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 18,
            },
        },
    }
);
