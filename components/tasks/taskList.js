import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl, TouchableHighlight, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';
import _map from 'lodash/map';
import tasksImg from '../../assets/images/active-icons/tasks-active.png';
import comingSoonImg from '../../assets/images/comingSoonImg.png';

import _isEmpty from 'lodash/isEmpty';
import _groupBy from 'lodash/groupBy';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon, Toast, Fab } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import TaskView from '../stateless/TaskView';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { mapDateToDay } from '../../utils/index';
import CustomBoldText from '../stateless/CustomBoldText';
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

    componentWillUnmount() {
    }
    componentDidMount() {
        let data = {};
        data.id = _get(this.props, 'decodedToken.Vendor.id', '');
        // this.props.fetchOrderList(true, data);
    }
    orderClicked = (order, role) => {
        this.props.navigation.navigate('LocationA', { order: order });
    }
    _onRefresh = () => {
        Toast.show({
            text: 'Updating Orders',
          });
        //   this.props.fetchOrderList(false);
    }
    renderDateView = (taskData) => {
        const orderView = _isArray(taskData) && !_isEmpty(taskData) && taskData.map((task, index) =>
        <TaskView
            key={index}
            index={index}
            task={task}
            role={_get(this.props, 'decodedToken.role', '')}
            cancelOrder={() => this.cancelAlert(task)}
            onPress={() => this.orderClicked(task, _get(this.props, 'decodedToken.role', ''))}
        />
    );
    return orderView;
    }
    render() {
        const { taskList, decodedToken, isLoading } = this.props;
        let groupedTaskList = _groupBy(TaskDummyData, 'date');
        console.log('date by grouped data', groupedTaskList);
        const DateView = _map(groupedTaskList, (value, key) => (
            <View key={key}>
                <Text>{mapDateToDay(key)}</Text>
                {this.renderDateView(value)}
            </View>
        ));
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{ backgroundColor: '#47d7ac' }} androidStatusBarColor="#47d7ac" translucent={false} >
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
                    <View style={[theme.centerAlign, { paddingBottom: 30, paddingTop: 30 }]}>
                        <Image source={comingSoonImg} style={{ width: 140, height: 135 }} />
                    </View>

                    <View style={[theme.centerAlign]}>
                        <CustomBoldText style={{ fontSize: 25, color: 'black' }}>COMING SOON...</CustomBoldText>
                    </View>
                    {/* <View style={[theme.marL15, theme.marR15, theme.mart15]} >
                        {
                            DateView
                        }
                    </View> */}

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
    let { auth, user } = state;
    let { decodedToken } = auth || {};
    let { userDetails } = user || {};

    return {
        decodedToken,
        userDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchOrderList: (isLoading, data) => dispatch(fetchOrderList(isLoading, data)),
    };
}

const styles = StyleSheet.create({
    profileImg: {
      height: 90,
      width: 63,
    },
  });


export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(TaskListScreen));
