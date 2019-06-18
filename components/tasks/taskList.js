import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';
import _map from 'lodash/map';
import tasksImg from '../../assets/images/active-icons/tasks-active.png';
// import comingSoonImg from '../../assets/images/active-icons/comingtask.png';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import _groupBy from 'lodash/groupBy';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import _sortBy from 'lodash/sortBy';
import _reverse from 'lodash/reverse';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon, Toast, Fab } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import TaskView from '../stateless/TaskView';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { mapDateToDay } from '../../utils/index';
import CustomBoldText from '../stateless/CustomBoldText';
import { NavigationEvents } from 'react-navigation';
import { postData } from '../../actions/commonAction';
import withLocalization from '../hocs/withLocalization';

const ContainerWithLoading = withLoadingScreen(Container);

class TaskListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      status: props.navigation.getParam('status', 0),
    };
  }
    static navigationOptions = {
      header: null,
    };

    componentWillMount() {
      console.log('came in will mount of task list');
    }
    componentDidMount() {
      this.fetchTaskList();
    }
    fetchTaskList = () => {
      let data = {};
      let url = '';
      const { status } = this.state;
      if (_get(this.props, 'userDetails.clockedInto.id', '') =='') {
        data = {
          userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
          status: status,
          id: _get(this.props, 'decodedToken.Client.id', ''),
        };
        url = `/Task/GetByStatusAndClientId`;
      } else {
        data = {
          status: status,
          id: _get(this.props, 'userDetails.clockedInto.id', ''),
        };
        url = `/Task/GetByStatusAndAssetId`;
      }
      const constants = {
        init: 'GET_TASKS_DATA_INIT',
        success: 'GET_TASKS_DATA_SUCCESS',
        error: 'GET_TASKS_DATA_ERROR',
      };
      const identifier = 'GET_TASKS_DATA';
      const key = 'getTasksData';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('tasks get successfully.');
          }, (err) => {
            console.log('error while getting tasks', err);
          });
    }
    goBack = () => {
      setTimeout(() => {
        this.props.navigation.navigate('Home');
      }, 2000);
    }
    taskClicked = (task, role) => {
      // this.props.navigation.navigate('LocationA', { order: order });
      this.props.navigation.navigate('TaskDetailScreen', { task: task });
    }
    _onRefresh = () => {
      Toast.show({
        text: 'Updating Tasks',
      });
      this.fetchTaskList();
    }
    renderDateView = (taskData) => {
      const orderView = _isArray(taskData) && !_isEmpty(taskData) && taskData.map((task, index) =>
        <TaskView
          key={index}
          index={index}
          task={task}
          role={_get(this.props, 'decodedToken.role', '')}
          cancelOrder={() => this.cancelAlert(task)}
          onPress={() => this.taskClicked(task, _get(this.props, 'decodedToken.role', ''))}
        />
      );
      return orderView;
    }
    render() {
      const { getTasksData, isLoading, strings } = this.props;
      let sortedTaskData = _sortBy(getTasksData, 'modifiedOn.seconds');
      sortedTaskData = _reverse(sortedTaskData);
      const groupedTaskList = _groupBy(sortedTaskData, 'creation.actionTime.seconds');
      // console.log('date by grouped data', groupedTaskList);
      const DateView = _map(groupedTaskList, (value, key) => (
        <View key={key}>
          <Text>{mapDateToDay(key)}</Text>
          {this.renderDateView(value)}
        </View>
      ));
      return (
        <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
          <Header style={{ backgroundColor: '#47d7ac', borderBottomWidth: 0 }} androidStatusBarColor="#47d7ac" translucent={false} >
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{ fontFamily: 'Montserrat-Bold' }}>{strings.taskList}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={isLoading || false}
                onRefresh={this._onRefresh}
              />
            }
            style={{ backgroundColor: '#ededed' }}
          >
            <NavigationEvents
              // onDidFocus={payload => this.fetchTaskList()}
              onWillFocus={payload => this.fetchTaskList()}
            />
            <View style={[theme.centerAlign, { backgroundColor: '#47d7ac', paddingBottom: 30 }]}>
              <TouchableHighlight
                style={[]}
              >
                <Image source={tasksImg} style={styles.profileImg} />
              </TouchableHighlight>
            </View>
            <View style={[theme.marL15, theme.marR15, theme.mart15]} >
              {
                DateView
              }
            </View>

          </Content>
          {/* <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#47d7ac' }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="add" />
                </Fab> */}
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { commonReducer } = state || {};
  const { userDetails } = commonReducer || {};
  // let { getTasksData } = commonReducer || [];
  // console.log('user details in ticket', userDetails);
  const isLoading = commonReducer.isFetching || false;
  const getTasksData = [];
  !_isEmpty(_get(commonReducer, 'getTasksData', [])) && _get(commonReducer, 'getTasksData', []).map((row) => {
    const tempRow = _cloneDeep(row);
    _set(tempRow, 'creation.actionTime.seconds', moment.unix(_get(row, 'creation.actionTime.seconds', 0)).format('MM-DD-YYYY'));
    getTasksData.push(tempRow);
  });
  return {
    decodedToken,
    userDetails,
    isLoading,
    getTasksData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
  };
}

const styles = StyleSheet.create({
  profileImg: {
    height: 90,
    width: 63,
  },
});


export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(TaskListScreen)));
