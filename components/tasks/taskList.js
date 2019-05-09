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

const ContainerWithLoading = withLoadingScreen(Container);

const TaskDummyData = [
    {
        id: '1',
        date: '2019-02-04',
        taskTitle: 'Schedule Service',
        taskDesc: 'Your Service Ticket #CIT 867546468 has been approved. Please schedule service.',
    },
    {
        id: '2',
        date: '2019-02-04',
        taskTitle: 'Send Fuel Invoice',
        taskDesc: 'Your Service Ticket #CIT 867546468 has been approved. Please schedule service.',
    },
    {
        id: '3',
        date: '2019-02-05',
        taskTitle: 'Safety Alert',
        taskDesc: 'Your Service Ticket #CIT 867546468 has been approved. Please schedule service.',
    },
    {
        id: '4',
        date: '2019-02-03',
        taskTitle: 'Service Ticket #CIT 266539',
        taskDesc: 'Your Service Ticket #CIT 867546468 has been approved. Please schedule service.',
    },
    {
        id: '5',
        date: '2019-02-06',
        taskTitle: 'Service Ticket #CIT 266539',
        taskDesc: 'Your Service Ticket #CIT 867546468 has been approved. Please schedule service.',
    },
];

class TaskListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true,
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
            data = {
                status: 0,
                id: _get(this.props, 'userDetails.clockedInto.id', ''),
            };
            let url = `/Task/GetByStatusAndAssetId`;
            let constants = {
                init: 'GET_TASKS_DATA_INIT',
                success: 'GET_TASKS_DATA_SUCCESS',
                error: 'GET_TASKS_DATA_ERROR',
            };
            let identifier = 'GET_TASKS_DATA';
            let key = 'getTasksData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('tasks get successfully.', data);
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
        const { getTasksData, decodedToken, isLoading } = this.props;
        let sortedTaskData = _sortBy(getTasksData, 'modifiedOn.seconds');
        sortedTaskData = _reverse(sortedTaskData);
        let groupedTaskList = _groupBy(sortedTaskData, 'creation.actionTime.seconds');
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
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={{ fontFamily: 'Montserrat-Bold' }}>Task List</Title>
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
    let { decodedToken } = state.auth || {};
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    // let { getTasksData } = commonReducer || [];
    // console.log('user details in ticket', userDetails);
    let isLoading = commonReducer.isFetching || false;
    let getTasksData = [];
    !_isEmpty(_get(commonReducer, 'getTasksData', [])) && _get(commonReducer, 'getTasksData', []).map((row) => {
        let tempRow = _cloneDeep(row);
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


export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(TaskListScreen));
