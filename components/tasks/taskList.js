import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl } from 'react-native';
import { Text } from 'react-native-elements';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';
import _map from 'lodash/map';

import _isEmpty from 'lodash/isEmpty';
import _groupBy from 'lodash/groupBy';
import { fetchOrderList } from '../../actions/order';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon, Toast, Fab } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import TaskView from '../stateless/TaskView';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { mapDateToDay } from '../../utils/index';
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
                <Header translucent={false} >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Title >Task List</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={[theme.marL15, theme.marR15, theme.mart15]} >
                        {
                            DateView
                        }
                    </View>

                </Content>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Icon name="add" />
                </Fab>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { orders, auth, user } = state;
    let { isLoading } = orders || false;
    let { orderList } = orders || {};
    console.log('orderList', orderList);
    let { decodedToken } = auth || {};
    let { userDetails } = user || {};

    return {
        orders,
        isLoading,
        orderList,
        decodedToken,
        userDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchOrderList: (isLoading, data) => dispatch(fetchOrderList(isLoading, data)),
    };
}


export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(TaskListScreen));
