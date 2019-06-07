import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import tasksImg from '../../assets/images/active-icons/tasks-active.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';

import _get from 'lodash/get';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';

import withLocalization from '../hocs/withLocalization';

const ContainerWithLoading = withLoadingScreen(Container);

class TaskForManagerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mileage: '',
    };
  }
    getListLabels = (strings) => {
      const listLabels = [
        {
          name: 'Open Tasks',
          avatar_url: '',
          subtitle: '',
        },
        {
          name: 'Approved Tasks',
          avatar_url: '',
          subtitle: '',
        },
        {
          name: 'Rejected Tasks',
          avatar_url: '',
          subtitle: '',
        },
      ];
      return listLabels;
    }
    static navigationOptions = {
      header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleTicketItem = (item, strings) => {
      switch (item.name) {
        case 'Open Tasks':
          this.props.navigation.navigate('TaskListScreen', { status: 0 });
          break;
        case 'Approved Tasks':
          this.props.navigation.navigate('TaskListScreen', { status: 1 });
          break;
        case 'Rejected Tasks':
          this.props.navigation.navigate('TaskListScreen', { status: 2 });
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
          <Header translucent={false} style={{ backgroundColor: '#47d7ac', borderBottomWidth: 0 }} androidStatusBarColor='#47d7ac'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`Tasks`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={[theme.centerAlign, { backgroundColor: '#47d7ac', paddingBottom: 30 }]}>
                <TouchableHighlight
                  style={[]}
                >
                  <Image source={tasksImg} style={styles.profileImg} />
                </TouchableHighlight>
              </View>
              <View style={{ flex: 1, paddingTop: 15 }}>
                <View style={{ flex: 1 }}>
                  {
                    this.getListLabels(strings).map((l, i) => (
                      <ListItem
                        key={i}
                        title={l.name}
                        subtitle={l.subtitle}
                        onPress={()=>this.handleTicketItem(l, strings)}
                      />
                    ))
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
  const { userDetails } = state.user || {};

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
    height: 90,
    width: 63,
  },
});

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(TaskForManagerScreen)));
