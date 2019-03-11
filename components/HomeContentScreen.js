import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
import tasksImg from '../assets/images/tasks.png';
import gasFillImg from '../assets/images/gasfill.png';
import MileageImg from '../assets/images/mileageImg.png';
import ServiceImg from '../assets/images/serviceImg.png';
import DocumentsImg from '../assets/images/documentsImg.png';
import ContactMechanic from '../assets/images/contactMechanic.png';

import withLoadingScreen from './withLoadingScreen';
import { Container, Content, Header, Body, Left, Right, Button, Toast, Title } from 'native-base';
import withAuth from './hocs/withAuth';
import SplashScreen from 'react-native-splash-screen';
import withErrorBoundary from './hocs/withErrorBoundary';
import { postData } from '../actions/commonAction';
import { setCheckInAsset } from '../actions/auth';

const ContainerWithLoading = withLoadingScreen(Container);

class HomeContentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            enableSearch: false,
            filteredPatients: [],
            refreshing: false,
        };
        this.invokingUser = '';
    }
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        SplashScreen.hide();
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
                console.log('user data fetched successfully.', data);
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
                console.log('checked out successfully.', data);
                // this.props.timerFunc(0);
                this.props.setCheckInAsset(false);
                this.loadUserInfo();
            }, (err) => {
                console.log('error while checking in operator', err);
            });
    }
    handleCheckOut = () => {
        this.handleCheckIn();
    }

    render() {
        const { userDetails, isCheckInAsset, time } = this.props;
        if (time === 0 && isCheckInAsset) {
            console.log('came inside time condition of render...');
            this.handleCheckOut();
        }
        return (
            <ContainerWithLoading isLoading={this.props.isLoading}>
               <Header>
                <Left style={{ flex: 1 }}>
                    </Left>
                <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>Welcome to My FMS</Title>
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
                            onPress={() => this.props.navigation.navigate('AssetCheckinScreen')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'normal' }}>{`CheckedIn Asset`}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'right', color: '#312783', fontSize: 18 }}> {_get(userDetails, 'checkedInto.assetId', 'NA')}</Text>
                                </View>
                            </View>
                                {/* <Image source={tasksImg} style={{ width: 110, height: 109 }} /> */}
                                <Button onPress={() => this.props.navigation.navigate('AssetCheckinScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>{!_isEmpty(_get(userDetails, 'checkedInto', {})) ? `Check Out`: `Check In`}</Text>
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
                                            <Text style={theme.buttonSmallTxt}>Tasks / To Do</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('GasFilUpHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={gasFillImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('GasFilUpHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>Gas Fill Up</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('UpdateMileageHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={MileageImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('UpdateMileageHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>Update Mileage</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ServiceTicketHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={ServiceImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('ServiceTicketHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>Service Ticket</Text>
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
                                            <Text style={theme.buttonSmallTxt}>Documents</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ContactPersonHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={ContactMechanic} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('ContactPersonHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>Contact FM/Mechanic</Text>
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
    let { userDetails } = commonReducer || {};
    let { token, isLoading } = auth.userStatus;
    let { decodedToken, availableVials, time, isCheckInAsset } = auth || {};
    return {
        auth,
        token,
        isLoading,
        decodedToken,
        availableVials,
        userDetails,
        isCheckInAsset,
        time,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    };
}

export default withErrorBoundary()(withAuth(true)(connect(mapStateToProps, mapDispatchToProps)(HomeContentScreen)));

