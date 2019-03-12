import React from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigator from './navigators';
import NavigationService from './navigators/NavigationService';
import configureStore from './store/configureStore';
import customize from './theme/customize';
import theme from './theme';
import axios from 'axios';
import { ActivityIndicator, YellowBox, Alert, Linking, Platform, View, Image } from 'react-native';
import Config from 'react-native-config';
import logoimg from './assets/images/login_screen_logo.png';
import { generateV1uuid, logError, compareAppVersion } from './utils';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';
import { Container, Content, Header, Body, Button, Left, Right, Title } from 'native-base';


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const { API_HOST, APP_VERSION } = Config;
// import { serviceRestEndpoint } from './app.json';

// import { getActiveRouteName } from './utils';
let BASE_URL = API_HOST;
/*
 * TODO... Workaround for now. Since environment properties are not getting read in Windows
*/
if (!API_HOST) {
  BASE_URL = 'http://13.126.59.19:20022/api';
}

export const AXIOS = axios.create({
  baseURL: BASE_URL,
  // url for sand box: 'http://divine-feather-4140.getsandbox.com'
  timeout: 20000,
});
// Add a request interceptor
export const interceptorForCorelationId = AXIOS.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.CorrelationId = generateV1uuid();
  console.log('config', config);
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const { store, persistor } = configureStore();
customize();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      appVersion: '',
    };
    this.appUrl = '';
    if (Platform.OS === 'ios') {
      this.appUrl = 'https://itunes.apple.com/us/app/stemcell-on-block/id1435442668?ls=1&mt=8';
    } else {
      this.appUrl = 'https://play.google.com/store/apps/details?id=com.aob.myfms';
    }
  }

  openUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Dont know how to open URI: ' + url);
      }
    });
  }

  fetchAppVersion = () => {
    AXIOS.get(`/api/mobileappversion`)
      .then((response) => {
        let data = response.data;
        this.setState({
          appVersion: _get(data, 'data', ''),
        });
        console.log('success response after fetch mobile app version service');
      }
      )
      .catch((err) => {
        logError('fetch mobile app version', _get(err, 'response.data', ''), err.status);
      });
  }
  async componentDidMount() {
    // await Expo.Font.loadAsync({
    //   Roboto: require('native-base/Fonts/Roboto.ttf'),
    //   Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //   Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
    // });
    //    SplashScreen.hide();
    // this.fetchAppVersion();
    this.setState({ isReady: true });
  }

  showAlert = () => {
    Alert.alert(
      'Update Required.',
      'Please Update app to Proceed.',
      [
        {
          text: 'Ok', onPress: () => this.openUrl(this.appUrl),
        },
      ],
      { cancelable: false }
    );
  }

  updateView = () => {
    return (
      <Container >
        <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
          <Left >
            <Image source={logoimg} style={{ width: 40, height: 40 }} />
          </Left>
          <Body>
            <Title style={{ color: '#fff' }} >Update App</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <Content>
          <View style={{ margin: 15, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ padding: 15, textAlign: 'center' }}>Please click below to Update Application</Text>
            <View style={{ backgroundColor: '#ffffff' }}>
                <Button style={theme.buttonNormal} onPress={() => this.openUrl(this.appUrl)} full>
                    <Text style={theme.butttonFixTxt}>Update App</Text>
                </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }

  render() {
    console.log('prod version: ', this.state.appVersion, 'app version from redux', APP_VERSION);
    if (!this.state.isReady) {
      return <ActivityIndicator size="large" color="white" />;
    }
    if (!compareAppVersion(this.state.appVersion.toString(), APP_VERSION.toString())) {
      this.showAlert();
      return (this.updateView());
    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <RootNavigator
              ref={navigatorRef => NavigationService.setRootNavigator(navigatorRef)}
            />
            {/*
            <RootNavigator
              ref={navigatorRef => NavigationService.setRootNavigator(navigatorRef)}
              onNavigationStateChange={interceptNavigationStateChange}
            />
            */}
          </Root>

          {/* <View style={styles.container}>
            <RootNavigator />
          </View>
            */}
        </PersistGate>
      </Provider>
    );
  }
}
/*
const interceptNavigationStateChange = (prevState, currentState) => {
  console.log('Inside Intercept Method');
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);
  console.log('Previous Screen- '+prevScreen, 'Current Screen- '+currentScreen);
};
*/

export default App;
