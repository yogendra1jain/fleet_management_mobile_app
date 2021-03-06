import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import theme from '../../theme';
import VerifyAuth from '../auth/VerifyAuth';
import Logout from '../auth/Logout';
import { setWarnings } from '../../actions/user';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import CustomBoldText from '../stateless/CustomBoldText';
import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import { showToast } from '../../utils';
import { postData } from '../../actions/commonAction';

class UserAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: true,
      checked: true,
      states: [],
    };
  }
    static navigationOptions = {
      header: null,
    };

    getListData = () => {
      const listData = [
        {
          listTitle: `${_get(this.props, 'strings.securitySettingsTitle', '')}`,
          listItems: [
            {
              title: `${_get(this.props, 'strings.changePasswordTitle', '')}`,
              icon: 'ios-keypad',
              type: 'ionicon',
              link: 'ChangePasswordScreen',
            },
            {
              title: `${_get(this.props, 'strings.manageLanguageTitle', '')}`,
              icon: 'language',
              type: 'font-awesome',
              link: 'LanguageSelectionScreen',
            },
          ],
        },
      ];
      // const promotionSettings = _get(this, 'props.decodedToken.Client.promotionSettings', {});
      // if (!_isEmpty(promotionSettings) && _get(this.props, 'decodedToken.FleetUser.role', 0)==1) {
      //   listData[0].listItems.push({
      //     title: `${_get(this.props, 'strings.rewardPointsLabel', '')}`,
      //     icon: 'donut-small',
      //     type: 'material-icons',
      //     link: 'RewardPointHome',
      //   });
      // }
      return listData;
    }
    componentDidMount() {
      this.getUserDetails();
      this.getStatesList();
    }

    getUserDetails = () => {
      const url = `/ClientUser/Get`;
      const constants = {
        init: 'GET_CLIENT_USER_BY_ID_INIT',
        success: 'GET_CLIENT_USER_BY_ID_SUCCESS',
        error: 'GET_CLIENT_USER_BY_ID_ERROR',
      };
      const identifier = 'GET_CLIENT_USER_BY_ID';
      const key = 'clientUserById';
      const data = {
        id: _get(this, 'props.decodedToken.FleetUser.id', ''),
      };
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            // this.props.navigation.navigate(route, { userData: data });
            // showToast('success', `Password Updated Successfully.`, 2000);
          }, (err) => {
            console.log('error while getting user details', err);
          });
    }
    getStatesList = () => {
      const url = `/reference-data/GetStatesList`;
      const data = {
        country: 'US',
      };
      const constants = {
        init: 'STATES_LIST_INIT',
        success: 'STATES_LIST_SUCCESS',
        error: 'STATES_LIST_ERROR',
      };
      const identifier = 'STATES_LIST';
      const key = 'states';
      this.props.dispatch(postData(url, data, constants, identifier, key))
          .then((data) => {
            const states = data.map((values, index) => ({
              value: values.stateShortCode,
              label: values.stateName,
            }));
            this.setState({ states });
          }, (err) => {
            console.log('err while fetching states', err);
          });
    }

    listItemClicked = (item, index) => {
      if (item.link == 'showWarnings') {
        console.log('setting show warnings as true');
      } else if (item.link && item.link !== '') {
        this.props.navigation.navigate(item.link, item.link=='LanguageSelectionScreen' ? {fromMain: true}: {});
      }
    }
    handleEditClick = (route) => {
      const user = _get(this, 'props.clientUserById', {});
      console.log('data for edit call ', user);
      const data = {
        clientUser: user,
      };
      this.prepareForAddEditCall(data, route);
    }
    prepareForAddEditCall = (data, route) => {
      const url = `/ClientUser/PrepareForEdit`;
      const constants = {
        init: 'GET_CLIENTUSER_LOOKUP_INIT',
        success: 'GET_CLIENTUSER_LOOKUP_SUCCESS',
        error: 'GET_CLIENTUSER_LOOKUP_ERROR',
      };
      const identifier = 'GET_CLIENTUSER_LOOKUP';
      const key = 'clientUserEditData';
      if (!_isEmpty(_get(data, 'clientUser.clientId', ''))) {
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
              this.props.navigation.navigate(route, { userData: data, states: this.state.states });
              // showToast('success', `Password Updated Successfully.`, 2000);
            }, (err) => {
              console.log('error while updating password', err);
            });
      }
    }

    render() {
      // const { user, nativeAuth } = this.props;
      const listItems = !_isEmpty(this.getListData()) && this.getListData().map((list, index) => (

        <View key={index} >
          <View key={index + 1}>
            <CustomSemiBoldText style={[theme.screenHeadingtxt, theme.mart25]} key={1 + index + 1}>{list.listTitle}</CustomSemiBoldText>
          </View>
          <View style={[theme.vialsblock, theme.mart15]}>
            {
              list.listItems.map((item, i) => (
                <ListItem
                  key={1 + i + index}
                  title={item.title}
                  titleStyle={{ fontSize: 14, fontFamily: 'Montserrat-Regular' }}
                  hideChevron={item.link == 'showWarnings' ? false : true}
                  onPress={() => this.listItemClicked(item, i)}
                  leftIcon={{ name: item.icon, type: item.type, style: { fontSize: 22, color: '#00A9E0' } }}
                  containerStyle={{ paddingTop: 15, paddingBottom: 15 }}
                />
              ))
            }
          </View>
        </View>
      ));
      return (
        <Container>

          <Header translucent={false} style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0" iosBarStyle="light-content">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{ fontFamily: 'Montserrat-Bold' }}>{`${_get(this.props, 'strings.userAccountTitle', '')}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
              {
                _get(this.props, 'decodedToken.FleetUser.role', 0)==1 &&
                <Button transparent onPress={() => this.handleEditClick('EditUserProfile')}>
                  <Icon name='edit' type="FontAwesome" style={{ color: '#fff' }} />
                </Button>
              }
            </Right>
          </Header>
          <Content>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80, backgroundColor: '#fff' }} >
              <View style={{ paddingRight: 10 }}>
                <Avatar
                  medium
                  withBorder
                  rounded
                  icon={{ name: 'user-o', type: 'font-awesome' }}
                  containerStyle={{ backgroundColor: '#00A9E0' }}
                  onPress={() => console.log('Works!')}
                  activeOpacity={0.7}
                />
              </View>
              <View>
                <CustomBoldText style={{ fontSize: 18 }}>{`${(_get(this.props, 'decodedToken.FleetUser.firstName', 'John'))} ${(_get(this.props, 'decodedToken.FleetUser.lastName', ''))}`}</CustomBoldText>
              </View>
            </View>
            <View>
              {listItems}
            </View>
            <View style={theme.container}>
              <VerifyAuth />
            </View>
            {/* </ScrollView> */}
          </Content>
          <Logout />
        </Container>
      );
    }
}

function mapStateToProps(state) {
  const { auth, user, commonReducer } = state;
  const { decodedToken } = auth;
  const { clientUserById, clientUserEditData } = commonReducer || {};
  const { showVialWarning } = user || true;
  return {
    user: state.user,
    nativeAuth: state.nativeAuth,
    auth,
    decodedToken,
    showVialWarning,
    clientUserEditData,
    clientUserById,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setWarnings: showVialWarning => dispatch(setWarnings(showVialWarning)),
    postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
  };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(UserAccountScreen)));
