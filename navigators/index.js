import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default createAppContainer(createSwitchNavigator(
  {
    //   AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'App',
  }
));
