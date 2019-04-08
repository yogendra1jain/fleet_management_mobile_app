import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, RefreshControl, PermissionsAndroid, Platform } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
// import SvgLogo1 from '../assets/images/svg1.svg';
// import TaskLogo from '../assets/images/tasks.svgx';

import FMSLogo from '../assets/images/fleetLogoNew.png';
import gasFillImg from '../assets/images/ios/gas-fillups.png';
import MileageImg from '../assets/images/ios/update-mileage.png';
import tasksImg from '../assets/images/ios/tasks.png';
import ServiceImg from '../assets/images/ios/service-ticket.png';
// import tasksImg from '../assets/images/tasks.png';
import mapIcon from '../assets/images/mapIcon.png';
import uploadImg from '../assets/images/uploadImg.jpeg';
// import MileageImg from '../assets/images/mileageImg.png';
// import ServiceImg from '../assets/images/serviceImg.png';
import expenseImg from '../assets/images/expense.png';
import DocumentsImg from '../assets/images/ios/documents.png';
import ContactMechanic from '../assets/images/ios/contact-mechanic.png';

import withLoadingScreen from './withLoadingScreen';
import { Container, Content, Header, Body, Left, Right, Button, Toast, Title, Icon } from 'native-base';
import withAuth from './hocs/withAuth';
import SplashScreen from 'react-native-splash-screen';
import withErrorBoundary from './hocs/withErrorBoundary';
import withLocalization from './hocs/withLocalization';
import { postData, setLanguage } from '../actions/commonAction';
import { setCheckInAsset, timerFunc } from '../actions/auth';
import { showToast } from '../utils';

const ContainerWithLoading = withLoadingScreen(Container);

class HomeContentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            enableSearch: false,
            refreshing: false,
            language: 'spn',
        };
        this.invokingUser = '';
    }
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        SplashScreen.hide();
        // this.props.setLanguage('en');
        // const { decodedToken } = this.props;
        this.loadUserInfo();
        if (Platform.OS == 'android') {
            this.requestCameraPermission();
        }
    }
    async requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'FleetLinks Camera Permission',
              message:
                'FleetLinks needs access to your camera ',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.requestLocationPermission();
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'FleetLinks Location Permission',
              message:
                'FleetLinks needs access to your location ',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    // componentWillMount() {
    //     this.loadUserInfo();
    // }
    loadUserInfo = () => {
        let url = `/ClientUser/Detail`;
        let constants = {
            init: 'GET_USER_DETAILS_INIT',
            success: 'GET_USER_DETAILS_SUCCESS',
            error: 'GET_USER_DETAILS_ERROR',
        };
        let data = {
            id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        };
        let identifier = 'GET_USER_DETAILS';
        let key = 'userDetails';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('user data fetched successfully.');
                this.setState({
                    isLoading: false,
                });
                if (_isEmpty(_get(data, 'checkedInto', {}))) {
                    this.props.navigation.navigate('AssetCheckinScreen');
                }
            }, (err) => {
                console.log('error while fetching user data', err);
            });
    }
    _onRefresh = () => {
        Toast.show({
            text: 'Updating Data',
        });
        this.loadUserInfo();
    }
    handleCheckInCheckOut = (checkIn) => {
        if (checkIn) {
            this.props.navigation.navigate('AssetCheckinScreen');
        } else {
            this.getCurrentLocation();
        }
    }

    getCurrentLocation = (index, asset, isCheckin) => {
        this.setState({
            isLoading: true,
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('location got successfully.');
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    // isLoading: false,
                });
                this.handleCheckIn();
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
    }
    handleCheckIn = (index, asset) => {
        let url = `/Assets/CheckOut`;
        let constants = {
            init: 'CHECKIN_FOR_ASSET_INIT',
            success: 'CHECKIN_FOR_ASSET_SUCCESS',
            error: 'CHECKIN_FOR_ASSET_ERROR',
        };
        let data = {
            operatorId: _get(this.props, 'decodedToken.FleetUser.id', ''),
            assetId: _get(this.props, 'userDetails.checkedInto.id', ''),
        };
        let identifier = 'CHECKIN_FOR_ASSET';
        let key = 'checkInForAsset';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('checked out successfully.');
                // this.props.timerFunc(0);
                this.props.setCheckInAsset(false);
                showToast('success', `Checked Out Successfully.`, 3000);
                this.loadUserInfo();
            }, (err) => {
                console.log('error while checking in operator', err);
            });
    }
    handleCheckOut = () => {
        this.handleCheckIn();
    }
    setLanguage = (lan) => {
        this.setState({
            language: lan,
        });
        this.props.setLanguage(lan);
    }

    render() {
        const { userDetails, isCheckInAsset, time, strings, appLanguage } = this.props;
        if (time === 0 && isCheckInAsset) {
            this.handleCheckOut();
        }
        return (
            <ContainerWithLoading isLoading={this.props.isLoading || this.state.isLoading}>
               <Header style={{ backgroundColor: '#00A9E0' }} androidStatusBarColor="#00A9E0">
                <Left style={{ flex: 1 }}>
                    <Icon name="ios-menu" style={{color: 'white'}} type="Ionicons"/>
                    </Left>
                <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={FMSLogo} style={{ width: 150, height: 22 }} />
                </Body>
                <Right style={{ flex: 1 }}>
                <Icon name="user" style={{ fontSize: 40, color: 'white' }} type="EvilIcons"/>
                </Right>
               </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{ backgroundColor: '#eef0f0' }}>
                    <View style={{ flex: 1, margin: 8 }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.handleCheckInCheckOut(_isEmpty(_get(userDetails, 'checkedInto', {})))} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10, margin: 8 }}>
                            {
                                !_isEmpty(_get(userDetails, 'checkedInto', {})) &&
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'normal', fontFamily: 'Montserrat' }}>{`${strings.checkedText}`}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'right', color: '#00A9E0', fontSize: 18 }}> {_get(userDetails, 'checkedInto.assetId', 'NA')}</Text>
                                    </View>
                                </View>
                            }
                                {/* <Image source={tasksImg} style={{ width: 110, height: 109 }} /> */}
                                <Button onPress={() => this.handleCheckInCheckOut(_isEmpty(_get(userDetails, 'checkedInto', {})))} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>{!_isEmpty(_get(userDetails, 'checkedInto', {})) ? `${strings.checkOut}`: `${strings.checkIn}`}</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                    </View>
                    {
                        !_isEmpty(_get(userDetails, 'checkedInto', {})) &&
                        <React.Fragment>
                            <View style={{ flexDirection: 'row',margin: 8 }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('TaskListScreen')} >
                                    <Card wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }} containerStyle={{ borderRadius: 10,  margin: 8 }}>
                                        <Image source={tasksImg} style={{ height: 75 }} />
                                        <Text style={[theme.buttonSmallTxt, {color: '#67DEBB', paddingTop: 15, fontFamily: 'Montserrat' }]}>{`${strings.taskButton}`}</Text>                                            
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('GasFilUpHome')} >
                                    <Card wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }} containerStyle={{ borderRadius: 10,  margin: 8 }}>
                                        <Image source={gasFillImg} style={{ height: 75 }} />
                                        <Text style={[theme.buttonSmallTxt, {color: '#013BA4', paddingTop: 15 }]}>{`${strings.gasFillButton}`}</Text>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', margin:8 }}>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('UpdateMileageHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                        <Image source={MileageImg} style={{ height: 75 }} />
                                        <Text style={[theme.buttonSmallTxt, {color: '#CA54CA', paddingTop: 15 }]}>{`${strings.mileageButton}`}</Text>                                            
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ServiceTicketHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                        <Image source={ServiceImg} style={{ height: 75 }} />
                                        <Text style={[theme.buttonSmallTxt, {color: '#FF7D82', paddingTop: 15 }]}>{`${strings.serviceButton}`}</Text>
                                    </Card>
                                </TouchableOpacity>
                                { 
                                    // For Live Location Tracking
                                }
                                {/* <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('AnimatedMarkers')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={mapIcon} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('AnimatedMarkers')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`Live Location`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity> */}
                                
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', margin:8 }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('DocumentsHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                        <Image source={DocumentsImg} style={{ height: 75 }} />
                                        {/* <Button onPress={() => this.props.navigation.navigate('DocumentsHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full> */}
                                            <Text style={[theme.buttonSmallTxt, {color: '#2CA12F', paddingTop: 15 }]}>{`${strings.documentButton}`}</Text>
                                        {/* </Button> */}
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ContactPersonHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                        <Image source={ContactMechanic} style={{ height: 75 }} />
                                        {/* <Button onPress={() => this.props.navigation.navigate('ContactPersonHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full> */}
                                            <Text style={[theme.buttonSmallTxt, {color: '#CD9827', paddingTop: 15 }]}>{`${strings.contactButton}`}</Text>
                                        {/* </Button> */}
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
                     } 
                </Content >
            </ContainerWithLoading >

        );
    }
}

function mapStateToProps(state) {
    let { auth, commonReducer } = state;
    let { userDetails, languageDetails } = commonReducer || {};
    // let { appLanguage } = commonReducer || 'en';
    let { token, isLoading } = auth.userStatus;
    let { decodedToken, time, isCheckInAsset } = auth || {};
    // console.log('decoded token', decodedToken);
    return {
        auth,
        token,
        isLoading,
        decodedToken,
        userDetails,
        isCheckInAsset,
        time,
        // appLanguage,
        languageDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        timerFunc: time => dispatch(timerFunc(time)),
        setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
        setLanguage: language => dispatch(setLanguage(language)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    };
}

export default withErrorBoundary()(withAuth(true)(connect(mapStateToProps, mapDispatchToProps)(withLocalization(HomeContentScreen))));

