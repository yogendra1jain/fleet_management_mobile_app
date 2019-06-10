import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import { SearchBar } from 'react-native-elements';

import theme from '../../theme';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { Container, Content, Header, Title, Body, Button, Left, Right, Icon } from 'native-base';

import _get from 'lodash/get';
import { postData, setCustomData } from '../../actions/commonAction';
import withLoadingScreen from '../withLoadingScreen';
import withLocalization from '../hocs/withLocalization';

import AssetListView from './AssetListView';
import { setTimer, timerFunc, setCheckInAsset } from '../../actions/auth';
import CustomBoldText from '../stateless/CustomBoldText';

const ContainerWithLoading = withLoadingScreen(Container);

class AssetListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      entity: props.navigation.getParam('entity', ''),
    };
  }

  componentDidMount() {
    this.loadData('');
  }
  updateSearch = (search) => {
    this.setState({ search });
    if (search.length > 2) {
      this.loadData(search);
    }
  };
    loadData = (searchText) => {
      const url = `/Assets/Search`;
      const constants = {
        init: 'SEARCH_ASSETS_FOR_MANAGER_INIT',
        success: 'SEARCH_ASSETS_FOR_MANAGER_SUCCESS',
        error: 'SEARCH_ASSETS_FOR_MANAGER_ERROR',
      };
      const data = {
        userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
        clientId: _get(this.props, 'decodedToken.Client.id', ''),
        text: searchText,
        limit: 100,
        offset: 0,
      };
      this.setState({
        isLoading: true,
      });
      const identifier = 'SEARCH_ASSETS_FOR_MANAGER';
      const key = 'managerAssets';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            this.loadUserInfo();
          }, (err) => {
            this.setState({
              isLoading: false,
            });
            console.log('error while fetching fleet user list list', err);
          });
    }

    static navigationOptions = {
      header: null,
    };
    loadUserInfo = (isCheckin) => {
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
            this.setState({
              isLoading: false,
            });
            // showToast('success', `${this.props.strings.assetFetchSuccMsg}`, 3000);
            if (isCheckin === true) {
              this.props.navigation.navigate('Home');
            }
          }, (err) => {
            this.setState({
              isLoading: false,
            });
            console.log('error while fetching user data', err);
          });
    }
    handleAssetClick = (asset, navigateToOtherScreen) => {
      this.setClockedInId(asset, navigateToOtherScreen);
    }
    buttonClick = (asset) => {
      this.setClockedInId(asset);
    }
    setClockedInId = (asset, navigateToOtherScreen) => {
      const { entity } = this.state;
      const url = `/Assets/Get`;
      const constants = {
        init: 'GET_ASSET_BY_ID_INIT',
        success: 'GET_ASSET_BY_ID_SUCCESS',
        error: 'GET_ASSET_BY_ID_ERROR',
      };
      const data = {
        id: _get(asset, 'id', ''),
      };
      this.setState({
        isLoading: true,
      });
      const identifier = 'GET_ASSET_BY_ID';
      const key = 'assetDetail';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            this.setState({
              isLoading: false,
            });
            const constants = {
              init: 'SET_CLOCKEDIN_ASSET_ID_CUSTOM_INIT',
            };
            const identifier = 'SET_CLOCKEDIN_ASSET_ID';
            const key = 'userDetails';
            const data1 = _get(this, 'props.userDetails', {});
            data1.clockedInto = data;
            this.props.dispatch(setCustomData(data1, constants, identifier, key));
            this.props.navigation.navigate(navigateToOtherScreen);
          }, (err) => {
            this.setState({
              isLoading: false,
            });
            console.log('error while fetching fleet user list list', err);
          });
    }
    renderContent = (strings) => {
      const { managerAssets } = this.props;
      const { selectedIndex, entity } = this.state;
      const assetListView = [];
      // console.log('assets', managerAssets);
      _isArray(managerAssets) && !_isEmpty(managerAssets) && managerAssets.map((asset, index) => {
        assetListView.push(
            <AssetListView
              key={index}
              index={index}
              selectedIndex={selectedIndex}
              asset={asset}
              strings={strings}
              handleAssetClick={() => this.handleAssetClick(asset, false)}
              decodedToken={this.props.decodedToken}
              userDetails={this.props.userDetails}
              firstButtonClick={() => this.handleAssetClick(asset, 'TaskForManagerScreen')}
              secondButtonClick={() => this.handleAssetClick(asset, 'ServiceTicketHome')}
              firstButtonText={'Task'}
              secondButtonText={'Ticket'}
              hideButton={false}
            />
        );
      }
      );
      if (_isEmpty(managerAssets)) {
        assetListView.push(
            <View key={1} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 25 }}>
              <CustomBoldText style={{ textAlign: 'center' }}>No Assets Found</CustomBoldText>
            </View>
        );
      }
      return assetListView;
    }

    render() {
      const { strings } = this.props;
      const { search, isLoading } = this.state;
      return (
        <ContainerWithLoading style={theme.container} >
          <Header translucent={false} style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0" iosBarStyle="light-content">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.assetTitle}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content style={{ backgroundColor: '#ededed' }}>
            <View style={[{ marginTop: 10 }]} >
              <View style={[theme.mart10, theme.marL10, theme.marR10]}>
                <SearchBar
                  placeholder="Search Here..."
                  lightTheme
                  onChangeText={this.updateSearch}
                  value={search}
                  showLoading={isLoading}
                />
              </View>
              {this.renderContent(strings)}
            </View>
          </Content>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { commonReducer, auth } = state;
  const managerAssets = _get(commonReducer, 'managerAssets.rows', []);
  const isLoading = commonReducer.isFetching || false;
  const { appLanguage, languageDetails, userDetails } = commonReducer || 'en';
  // console.log('appLanguage in check in screen', appLanguage);
  const { decodedToken } = auth || {};
  return {
    managerAssets,
    decodedToken,
    isLoading,
    appLanguage,
    languageDetails,
    userDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    timerFunc: time => dispatch(timerFunc(time)),
    setTimer: time => dispatch(setTimer(time)),
    setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
    setCustomData: (data, constants, identifier, key) => dispatch(setCustomData(data, constants, identifier, key)),
    postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
  };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(AssetListScreen)));
