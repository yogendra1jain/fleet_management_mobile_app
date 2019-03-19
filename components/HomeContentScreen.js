import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
import tasksImg from '../assets/images/tasks.png';
import uploadImg from '../assets/images/uploadImg.jpeg';
import MileageImg from '../assets/images/mileageImg.png';
import ServiceImg from '../assets/images/serviceImg.png';
import expenseImg from '../assets/images/expense.png';
import DocumentsImg from '../assets/images/documentsImg.png';
import ContactMechanic from '../assets/images/contactMechanic.png';

import withLoadingScreen from './withLoadingScreen';
import { Container, Content, Header, Body, Left, Right, Button, Toast, Title } from 'native-base';
import withAuth from './hocs/withAuth';
import SplashScreen from 'react-native-splash-screen';
import withErrorBoundary from './hocs/withErrorBoundary';
import withLocalization from './hocs/withLocalization';
import { postData, setLanguage } from '../actions/commonAction';
import { setCheckInAsset } from '../actions/auth';
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
    }
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
            this.handleCheckIn()
        }
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
            <ContainerWithLoading isLoading={this.props.isLoading}>
               <Header>
                <Left style={{ flex: 1 }}>
                    </Left>
                <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>{`${strings.homeTitle}`}</Title>
                </Body>
                <Right style={{ flex: 1 }}>
                </Right>
               </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{ backgroundColor: '#ededed' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.handleCheckInCheckOut(_isEmpty(_get(userDetails, 'checkedInto', {})))} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                            {
                                !_isEmpty(_get(userDetails, 'checkedInto', {})) &&
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'normal' }}>{`${strings.checkedText}`}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'right', color: '#312783', fontSize: 18 }}> {_get(userDetails, 'checkedInto.assetId', 'NA')}</Text>
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
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('TaskListScreen')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={tasksImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('TaskListScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.taskButton}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ServiceTicketHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={ServiceImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('ServiceTicketHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.serviceButton}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('UploadDocsHomeScreen')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={uploadImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('UploadDocsHomeScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.uploadTitle}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('DocumentsHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={DocumentsImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('DocumentsHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.documentButton}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ContactPersonHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={ContactMechanic} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('ContactPersonHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.contactButton}`}</Text>
                                        </Button>
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
        setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
        setLanguage: language => dispatch(setLanguage(language)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    };
}

export default withErrorBoundary()(withAuth(true)(connect(mapStateToProps, mapDispatchToProps)(withLocalization(HomeContentScreen))));

