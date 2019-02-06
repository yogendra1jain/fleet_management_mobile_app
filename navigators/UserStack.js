// import React from 'react';
import { createStackNavigator } from 'react-navigation';

import UserAccountScreen from '../components/user/UserAccountScreen';
import EditUserProfileScreen from '../components/user/EditUserProfileScreen';
import SetupNativeAuthScreen from '../components/auth/SetupNativeAuthScreen';

export default UserStack = createStackNavigator(
    {
        UserAccount: UserAccountScreen,
        EditUserProfile: EditUserProfileScreen,
        SetupNativeAuth: SetupNativeAuthScreen,
    }, {
        initialRouteName: 'UserAccount',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#0d7aaa',
                elevation: 0,
                shadowOpacity: 0,
                marginRight: 20,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 18,
                alignSelf: 'center',
                textAlign: 'center',

            },
        },
    }
);
