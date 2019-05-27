import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl, ImageBackground } from 'react-native';
import _get from 'lodash/get';
// import _isEmpty from 'lodash/isEmpty';
import theme from '../../theme';
import DonutImg from '../../assets/images/donut-trans.png';

import withLoadingScreen from '../withLoadingScreen';
import { Container, Header, Content, Text, Left, Right, Body, Title, Icon, Button } from 'native-base';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { postData } from '../../actions/commonAction';
import * as Progress from 'react-native-progress';

const ContainerWithLoading = withLoadingScreen(Container);

class RewardPointHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'spn',
      donuts: 0,
      pendingDonut: 1,
      progressDone: 0,
      progressPending: 0,
    };
  }
    static navigationOptions = {
      header: null,
    };

    componentDidMount() {
      this.getRewardInfo();
    }
    _onRefresh = () => {
      this.getRewardInfo();
    }

    getRewardInfo = () => {
      const url = `/ClientUser/GetOperatorPointsByUserId`;
      const constants = {
        init: 'GET_REWARD_POINTS_INIT',
        success: 'GET_REWARD_POINTS_SUCCESS',
        error: 'GET_REWARD_POINTS_ERROR',
      };
      const data = {
        id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        // assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
      };
      const identifier = 'GET_REWARD_POINTS';
      const key = 'rewardPoints';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('reward points got successfully.', data);
            const promotionSettings = _get(this, 'props.decodedToken.Client.promotionSettings', {});
            const donuts = parseInt(_get(data, 'points', 0) / _get(promotionSettings, 'operatorPointConversionFactor', 1));
            const pendingDonut = _get(data, 'points', 0) - (donuts * _get(promotionSettings, 'operatorPointConversionFactor', 1));
            const progressPending = (1 - parseFloat(pendingDonut/_get(promotionSettings, 'operatorPointConversionFactor', 1))).toFixed(2);
            const progressDone = parseFloat(pendingDonut/_get(promotionSettings, 'operatorPointConversionFactor', 1)).toFixed(2);
            const redeemablePoints = _get(data, 'points', 0);
            const conversionFactor = _get(promotionSettings, 'operatorPointConversionFactor', 1);
            this.setState({
              donuts,
              pendingDonut,
              progressPending,
              progressDone,
              redeemablePoints,
              conversionFactor,
            });
            // this.props.timerFunc(0);
            // showToast('success', `Reward Successfully.`, 3000);
          }, (err) => {
            console.log('error while fetching reward points', err);
          });
    }

    render() {
      const { strings } = this.props;
      const { donuts, progressPending, progressDone, redeemablePoints, conversionFactor } = this.state;
      const donutsView = [];
      for (let i=0; i < donuts; i++) {
        donutsView.push(
            <View key={i} style={[theme.centerAlign, { width: '33.3%', marginTop: 15, justifyContent: 'flex-start' }]}>
              <View style={{ width: 100, height: 100, overflow: 'hidden' }}>
                <ImageBackground style={[theme.backFullImg]} source={DonutImg}>
                  <Progress.Pie color="rgba(255, 255, 255, 0.9)" progress={0} size={100} />
                </ImageBackground>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                  <Button onPress={() => {}} style={[theme.buttonAlignBottom1, { marginLeft: 0 }]} full>
                    <Text style={theme.buttonSmallTxt}>{`Reedem`}</Text>
                  </Button>
                </View>
              </View>
            </View>
        );
      }

      return (
        <ContainerWithLoading isLoading={this.props.isLoading}>
          <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor='#00A9E0'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{ fontFamily: 'Montserrat-Bold' }}>{`${strings.rewardPointsLabel}`}</Title>
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
          >
            <View style={[theme.container, { justifyContent: 'center', alignItems: 'center', borderBottomColor: '#ddd', borderBottomWidth: 1, paddingTop: 10 }]}>
              <Text style={{ fontSize: 20 }} >{`Redeemable points: ${redeemablePoints}`} <Text style={{ paddingLeft: 15, fontSize: 12 }}>{`(${conversionFactor} points = 1 Donut)`}</Text></Text>
            </View>
            <View style={{ flexWrap: 'wrap', flex: 1, flexDirection: 'row', margin: 15 }}>
              <View style={[theme.centerAlign, { width: '33.3%', marginTop: 15, justifyContent: 'flex-start' }]}>
                <View style={{ width: 100, height: 100, overflow: 'hidden' }}>
                  <ImageBackground style={[theme.backFullImg]} source={DonutImg}>
                    <Progress.Pie color="rgba(255, 255, 255, 0.9)" progress={Number(progressPending)} size={100} />
                  </ImageBackground>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text>{`${(progressDone)*100}%`}</Text>
                </View>
              </View>
              {donutsView}
            </View>
          </Content>
        </ContainerWithLoading >

      );
    }
}

function mapStateToProps(state) {
  const { auth, commonReducer } = state;
  const { userDetails, languageDetails } = commonReducer || {};
  const { appLanguage } = commonReducer || 'en';
  const { token } = auth.userStatus;
  const isLoading = commonReducer.isFetching || false;
  const { decodedToken, time, isCheckInAsset } = auth || {};
  return {
    auth,
    token,
    isLoading,
    decodedToken,
    userDetails,
    isCheckInAsset,
    time,
    appLanguage,
    languageDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
  };
}

export default withErrorBoundary()((connect(mapStateToProps, mapDispatchToProps)(withLocalization(RewardPointHome))));

