import React from 'react';
import { connect } from 'react-redux';
import { View, Alert, TouchableOpacity, Image, RefreshControl, PermissionsAndroid, Platform } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import CustomText from './stateless/CustomText';
import CustomSemiBoldText from './stateless/CustomSemiBoldText';
import CustomBoldText from './stateless/CustomBoldText';
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
import { showToast, showAlert } from '../utils';
import TimerComp from './stateless/TimerComp';
import Geolocation from 'react-native-geolocation-service';


const ContainerWithLoading = withLoadingScreen(Container);

class HomeContentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      enableSearch: false,
      refreshing: false,
      language: 'spn',
      speed: [],
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
      // setInterval(this.loadUserInfo, 300000);
      this.startWatchForLocation();
    }
    startWatchForLocation = () => {
      Geolocation.watchPosition(
          (position) => {
            console.log('location got successfully.', position);
            const speed = this.state.speed;
            speed.push({
              speed: position.coords.speed,
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });
            this.setState({
              speed,
              error: null,
            // isLoading: false,
            });
            // showAlert('Location change', `${JSON.stringify(position.coords)}`);
          },
          error => this.setState({ error: error.message }),
          { enableHighAccuracy: true, distanceFilter: 10 },
      );
    }
    loadUserInfo = () => {
      console.log('came inside load user info method');
      const url = `/ClientUser/Detail`;
      const constants = {
        init: 'GET_USER_DETAILS_INIT',
        success: 'GET_USER_DETAILS_SUCCESS',
        error: 'GET_USER_DETAILS_ERROR',
      };
      const data = {
        id: _get(this.props, 'decodedToken.FleetUser.id', ''),
      };
      const identifier = 'GET_USER_DETAILS';
      const key = 'userDetails';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            // console.log('user data fetched successfully.');
            this.setState({
              isLoading: false,
            });
            // if (_isEmpty(_get(data, 'clockedInto', {}))) {
            //   this.props.navigation.navigate('AssetCheckinScreen');
            // }
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
    handleCheckInCheckOut = (checkIn, strings) => {
      if (checkIn) {
        this.props.navigation.navigate('AssetCheckinScreen');
      } else {
        Alert.alert(
            `${strings.confirmTitle}`,
            `${strings.clockOutMsg}`,
            [
              { text: 'OK', onPress: () => this.getCurrentLocation() },
              { text: 'CANCEL', onPress: () => {} },
            ],
            { cancelable: false }
        );
      }
    }

    getCurrentLocation = (index, asset, isCheckin) => {
      this.setState({
        isLoading: true,
      });
      Geolocation.getCurrentPosition(
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
          { enableHighAccuracy: true },
      );
    }
    handleCheckIn = (index, asset) => {
      const url = `/Assets/ClockOut`;
      const constants = {
        init: 'CHECKIN_FOR_ASSET_INIT',
        success: 'CHECKIN_FOR_ASSET_SUCCESS',
        error: 'CHECKIN_FOR_ASSET_ERROR',
      };
      const data = {
        operatorId: _get(this.props, 'decodedToken.FleetUser.id', ''),
        assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
      };
      const identifier = 'CHECKIN_FOR_ASSET';
      const key = 'checkInForAsset';
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
      const { userDetails, isCheckInAsset, time, strings={}, appLanguage } = this.props;
      if (time === 0 && isCheckInAsset) {
        this.handleCheckOut();
      }
      const speedData =[];
      !_isEmpty(_get(this, 'state.speed', [])) && _get(this, 'state.speed', []).map((row, index) => {
        speedData.push(
            <View key={index}>
              <CustomText>{`Speed: ${row.speed} mtr/sec`}</CustomText>
              <CustomText>{`Lattitude: ${row.lat}`}</CustomText>
              <CustomText>{`Longitude: ${row.long}`}</CustomText>
            </View>
        );
      });
      return (
        <ContainerWithLoading isLoading={this.props.isLoading || this.state.isLoading}>
          <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0">
            <Left style={{ flex: 1 }}>
              {/* <Icon name="ios-menu" style={{color: 'white'}} type="Ionicons"/> */}
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={FMSLogo} style={{ width: 150, height: 22 }} />
            </Body>
            <Right style={{ flex: 1 }}>
              <Icon onPress={() => this.props.navigation.navigate('UserAccount')} name="user" style={{ fontSize: 40, color: 'white' }} type="EvilIcons"/>
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
              {/* <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                             > */}
              <Card wrapperStyle={{ flex: 1 }} containerStyle={{ flex: 1, borderRadius: 10, margin: 8 }}>
                {
                                !_isEmpty(_get(userDetails, 'clockedInto', {})) ?
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                  <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <CustomSemiBoldText style={{ fontWeight: 'normal' }}>{`${strings.clockedText}`}</CustomSemiBoldText>
                                    <CustomBoldText style={{ textAlign: 'right', color: '#00A9E0', fontSize: 20 }}> {_get(userDetails, 'clockedInto.assetId', 'NA')}</CustomBoldText>
                                    {/* <Text ></Text> */}
                                  </View>
                                  <Button onPress={() => this.handleCheckInCheckOut(_isEmpty(_get(userDetails, 'clockedInto', {})), strings)} style={[theme.buttonAlignBottom, { marginLeft: 0, marginTop: 0 }]}>
                                    <CustomBoldText style={theme.buttonSmallTxt}>{!_isEmpty(_get(userDetails, 'clockedInto', {})) ? `${strings.clockOut}`: `${strings.clockIn}`}</CustomBoldText>
                                  </Button>
                                </View>
                                :
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                  <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <CustomSemiBoldText style={{ fontWeight: 'normal' }}>{`${strings.clockedText}`}</CustomSemiBoldText>
                                    <CustomBoldText style={{ textAlign: 'right', color: '#00A9E0', fontSize: 20 }}> {_get(userDetails, 'clockedInto.assetId', 'NA')}</CustomBoldText>
                                    {/* <Text ></Text> */}
                                  </View>
                                  <Button onPress={() => this.handleCheckInCheckOut(_isEmpty(_get(userDetails, 'clockedInto', {})), strings)} style={[theme.buttonAlignBottom, { marginLeft: 0, marginTop: 0 }]}>
                                    <CustomBoldText style={theme.buttonSmallTxt}>{!_isEmpty(_get(userDetails, 'clockedInto', {})) ? `${strings.clockOut}`: `${strings.clockIn}`}</CustomBoldText>
                                  </Button>
                                </View>
                }
                {/* <Image source={tasksImg} style={{ width: 110, height: 109 }} /> */}
                                
              </Card>
              {/* </TouchableOpacity> */}
            </View>
            {
                        !_isEmpty(_get(userDetails, 'clockedInto', {})) ?
                        <React.Fragment>
                          <View style={{ flexDirection: 'row', margin: 8 }}>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('CheckListHome')} >
                              <Card wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }} containerStyle={{ borderRadius: 10, margin: 8 }}>
                                <Image source={tasksImg} style={{ height: 75 }} />
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#67DEBB', paddingTop: 15 }]}>{`${strings.dailyCheckList}`}</CustomSemiBoldText>                                            
                              </Card>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection: 'row', margin: 8 }}>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('TaskListScreen')} >
                              <Card wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }} containerStyle={{ borderRadius: 10, margin: 8 }}>
                                <Image source={tasksImg} style={{ height: 75 }} />
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#67DEBB', paddingTop: 15 }]}>{`${strings.taskButton}`}</CustomSemiBoldText>                                            
                              </Card>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('GasFilUpHome')} >
                              <Card wrapperStyle={{ justifyContent: 'center', alignItems: 'center' }} containerStyle={{ borderRadius: 10, margin: 8 }}>
                                <Image source={gasFillImg} style={{ height: 75 }} />
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#013BA4', paddingTop: 15 }]}>{`${strings.gasFillButton}`}</CustomSemiBoldText>
                              </Card>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flex: 1, flexDirection: 'row', margin:8 }}>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('UpdateMileageHome')} >
                              <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                <Image source={MileageImg} style={{ height: 75 }} />
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#CA54CA', paddingTop: 15 }]}>{`${strings.mileageButton}`}</CustomSemiBoldText>                                            
                              </Card>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('ServiceTicketHome')} >
                              <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                <Image source={ServiceImg} style={{ height: 75 }} />
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#FF7D82', paddingTop: 15 }]}>{`${strings.serviceButton}`}</CustomSemiBoldText>
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
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#2CA12F', paddingTop: 15 }]}>{`${strings.documentButton}`}</CustomSemiBoldText>
                                {/* </Button> */}
                              </Card>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                              onPress={() => this.props.navigation.navigate('ContactPersonHome')} >
                              <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, borderRadius: 10,  margin: 8 }}>
                                <Image source={ContactMechanic} style={{ height: 75 }} />
                                {/* <Button onPress={() => this.props.navigation.navigate('ContactPersonHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full> */}
                                <CustomSemiBoldText style={[theme.buttonSmallTxt, {color: '#CD9827', paddingTop: 15 }]}>{`${strings.contactButton}`}</CustomSemiBoldText>
                                {/* </Button> */}
                              </Card>
                            </TouchableOpacity>
                          </View>
                          {speedData}
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <View style={{ marginTop: 25 }}>
                            <TimerComp
                            />
                          </View>
                          <View style={{ flex: 1, padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                            <CustomText style={{ textAlign: 'center' }}>{`${strings.clockInHelperText}`}</CustomText>
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

