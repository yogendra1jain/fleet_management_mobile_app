import { createStackNavigator } from 'react-navigation';

import UsernameScreen from '../components/auth/UsernameScreen';
import LanguageSelectionScreen from '../components/LanguageSupportScreen/LanguageList';

// import PasswordScreen from '../components/auth/PasswordScreen';
// import OtpScreen from '../components/auth/OtpScreen';

export default AuthStack = createStackNavigator(
    {
        WhichUser: UsernameScreen,
        LanguageSelection: LanguageSelectionScreen,
        // WhatPassword: PasswordScreen,
        // WhatOtp: OtpScreen,
    }, {
        initialRouteName: 'LanguageSelection',
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
