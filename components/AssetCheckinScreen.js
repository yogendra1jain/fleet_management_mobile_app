import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
import withErrorBoundary from './hocs/withErrorBoundary';
import { Container, Content, Header, Title, Body, Button, Left, Right, Icon } from 'native-base';

import _get from 'lodash/get';
import { postData } from '../actions/commonAction';
import withLoadingScreen from './withLoadingScreen';
import withLocalization from './hocs/withLocalization';

import AssetView from './stateless/AssetView';
import strings from '../utils/localization';

import { setTimer, timerFunc, setCheckInAsset } from '../actions/auth';
import { showToast } from '../utils';
const ContainerWithLoading = withLoadingScreen(Container);

class AssetCheckinScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            itemCount: 0,
        };
    }

    componentDidMount() {
        this.loadData();
    }
    loadData = () => {
        let url = `/Assets/AssignedToOperator`;
        let constants = {
            init: 'GET_ASSETS_FOR_OPERATOR_INIT',
            success: 'GET_ASSETS_FOR_OPERATOR_SUCCESS',
            error: 'GET_ASSETS_FOR_OPERATOR_ERROR',
        };
        let data = {
            id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        };
        let identifier = 'GET_ASSETS_FOR_OPERATOR';
        let key = 'operatorAssets';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                this.loadUserInfo();
            }, (err) => {
                console.log('error while fetching fleet user list list', err);
            });
    }

    static navigationOptions = {
        header: null,
    };

    handleAssetClick = (index, asset) => {
        this.setState({
            selectedIndex: index,
        });
    }
    handleCheckIn = (index, asset, isCheckin) => {
        let url = `/Assets/CheckIn`;
        this.props.setCheckInAsset(false);
        if (!isCheckin) {
            url = `/Assets/CheckOut`;
        }
        let constants = {
            init: 'SAVE_CHECKIN_FOR_ASSET_INIT',
            success: 'SAVE_CHECKIN_FOR_ASSET_SUCCESS',
            error: 'SAVE_CHECKIN_FOR_ASSET_ERROR',
        };
        let data = {
            operatorId: _get(this.props, 'decodedToken.FleetUser.id', ''),
            assetId: asset.id,
        };
        let identifier = 'SAVE_CHECKIN_FOR_ASSET';
        let key = 'checkInForAsset';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('checked in successfully.', data);
                if (isCheckin) {
                    this.props.timerFunc(6000);
                } else {
                    this.props.timerFunc(0);
                }
                showToast('success', `${this.props.strings.checkInSuccessMsg}`, 3000);
                this.loadData();
            }, (err) => {
                console.log('error while checking in operator', err);
            });
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
                showToast('success', `${this.props.strings.assetFetchSuccMsg}`, 3000);
            }, (err) => {
                console.log('error while fetching user data', err);
            });
    }

    renderContent = (strings) => {
        const { operatorAssets } = this.props;
        const { selectedIndex } = this.state;
        let assetListView = [];
        _isArray(operatorAssets) && !_isEmpty(operatorAssets) && operatorAssets.map((asset, index) => {
            assetListView.push(
                <AssetView
                    key={index}
                    index={index}
                    selectedIndex={selectedIndex}
                    asset={asset}
                    strings={strings}
                    handleAssetClick={this.handleAssetClick}
                    handleCheckIn={this.handleCheckIn}
                    decodedToken={this.props.decodedToken}
                />
            );
        }
        );
            return assetListView;
    }

    render() {
        const { isLoading, strings } = this.props;
        return (
            <ContainerWithLoading style={theme.container} isLoading={isLoading} >
                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >{`${strings.checkIn}`}</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#ededed' }}>
                    <View style={[]} >
                        {this.renderContent(strings)}
                    </View>
                </Content>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { commonReducer, auth } = state;
    let { operatorAssets } = commonReducer || [];
    let isLoading = commonReducer.isFetching || false;
    let { appLanguage } = commonReducer || 'en';
    console.log('appLanguage in check in screen', appLanguage);
    let { decodedToken } = auth || {};
    return {
        operatorAssets,
        decodedToken,
        isLoading,
        appLanguage,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        timerFunc: time => dispatch(timerFunc(time)),
        setTimer: time => dispatch(setTimer(time)),
        setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(AssetCheckinScreen)));
