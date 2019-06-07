import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import serviceImg from '../../assets/images/active-icons/service-ticket-active.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';

import _get from 'lodash/get';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';

import withLocalization from '../hocs/withLocalization';
import { NavigationEvents } from 'react-navigation';

const ContainerWithLoading = withLoadingScreen(Container);

class ServiceTicketHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mileage: '',
    };
  }
    getListLabels = (strings) => {
      const listLabels = [
        {
          name: strings.openNewTicketLabel,
          avatar_url: '',
          subtitle: '',
        },
        {
          name: strings.reviewOpenTicketsLabel,
          avatar_url: '',
          subtitle: '',
        },
        {
          name: strings.approvedTicketsLabel,
          avatar_url: '',
          subtitle: '',
        },
        {
          name: strings.rejectedTicketsLabel,
          avatar_url: '',
          subtitle: '',
        },
      ];
      if (_get(this.props, 'userDetails.clockedInto.id', '') =='') {
        listLabels.splice(0, 1);
      }
      const items = [];
      listLabels.map((l, i) => {
        items.push(
            <ListItem
              key={i}
              title={l.name}
              subtitle={l.subtitle}
              onPress={()=>this.handleTicketItem(l, strings)}
            />
        );
      });
      this.setState({
        listItems: items,
      });
    }
    static navigationOptions = {
      header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleTicketItem = (item, strings) => {
      console.log('item', item);
      switch (item.name) {
        case strings.openNewTicketLabel:
          this.props.navigation.navigate('OtherTicketScreen');
          break;
        case strings.reviewOpenTicketsLabel:
          this.props.navigation.navigate('ServiceTicketListScreen', { status: 0 });
          break;
        case strings.approvedTicketsLabel:
          this.props.navigation.navigate('ServiceTicketListScreen', { status: 2 });
          break;
        case strings.rejectedTicketsLabel:
          this.props.navigation.navigate('ServiceTicketListScreen', { status: 1 });
          break;
        default:
          return;
      }
    }
    goBack = () => {
      setTimeout(() => {
        this.props.navigation.navigate('Home');
      }, 2000);
    }

    render() {
      const { strings } = this.props;
      return (
        <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
          <Header translucent={false} style={{backgroundColor: '#ff585d', borderBottomWidth: 0 }} androidStatusBarColor='#ff585d'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.serviceButton}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <NavigationEvents
              // onDidFocus={payload => this.fetchTaskList()}
              onDidFocus={payload => this.getListLabels(strings)}
            />
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={[theme.centerAlign, { backgroundColor: '#ff585d', paddingBottom: 30 }]}>
                <TouchableHighlight
                  style={[]}
                >
                  <Image source={serviceImg} style={styles.profileImg} />
                </TouchableHighlight>
              </View>
              {/* <View style={[theme.centerAlign, { paddingBottom: 30, paddingTop: 30 }]}>
                            <Image source={comingSoonImg} style={{ width: 140, height: 135 }} />
                        </View>

                        <View style={[theme.centerAlign]}>
                            <CustomBoldText style={{ fontSize: 25, color: 'black' }}>COMING SOON...</CustomBoldText>
                        </View> */}
              <View style={{ flex: 1, paddingTop: 15 }}>
                <View style={{ flex: 1 }}>
                  {
                    this.state.listItems
                  }
                </View>
              </View>
            </View>
          </Content>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { userDetails } = state.commonReducer || {};

  return {
    decodedToken,
    userDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

const styles = StyleSheet.create({
  profileImgContainer: {
    marginLeft: 8,
    height: 120,
    width: 120,
    borderRadius: 40,
    borderWidth: 1,
  },
  profileImg: {
    height: 56,
    width: 90,
  },
});

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ServiceTicketHomeScreen)));
