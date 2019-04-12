import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import theme from '../../theme';
import gasFillImg from '../../assets/images/ios/gas-fillups.png';
import MileageImg from '../../assets/images/ios/update-mileage.png';
import expenseImg from '../../assets/images/expense.png';

import withLoadingScreen from './../withLoadingScreen';
import { Container, Content, Header, Body, Left, Right, Button, Toast, Title, Icon } from 'native-base';
import withErrorBoundary from './../hocs/withErrorBoundary';
import withLocalization from './../hocs/withLocalization';
import { postData, setLanguage } from '../../actions/commonAction';
import { setCheckInAsset } from '../../actions/auth';

const ContainerWithLoading = withLoadingScreen(Container);

class UploadDocsHomeScreen extends React.Component {
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
        
    }

    _onRefresh = () => {
        Toast.show({
            text: 'Updating Data',
        });
        this.loadUserInfo();
    }

    render() {
        const { strings } = this.props;
        return (
            <ContainerWithLoading isLoading={this.props.isLoading}>
               <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>{`${strings.uploadTitle}`}</Title>
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
                    
                        <React.Fragment>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('UpdateMileageHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={MileageImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('UpdateMileageHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.mileageButton}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('GasFilUpHome')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={gasFillImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('GasFilUpHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.gasFillButton}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                    onPress={() => this.props.navigation.navigate('ExpenseReportHomeScreen')} >
                                    <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                        <Image source={expenseImg} style={{ width: 110, height: 109 }} />
                                        <Button onPress={() => this.props.navigation.navigate('ExpenseReportHomeScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                            <Text style={theme.buttonSmallTxt}>{`${strings.expenseReportTitle}`}</Text>
                                        </Button>
                                    </Card>
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
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

export default withErrorBoundary()((connect(mapStateToProps, mapDispatchToProps)(withLocalization(UploadDocsHomeScreen))));

