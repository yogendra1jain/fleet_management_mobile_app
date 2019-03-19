import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl } from 'react-native';

import _get from 'lodash/get';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import TaskView from '../stateless/TaskView';
import withErrorBoundary from '../hocs/withErrorBoundary';
import OrderDetailView from '../stateless/TaskDetailView';
const ContainerWithLoading = withLoadingScreen(Container);

class OrderDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: this.props.navigation.getParam('order', {}),
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    render() {
        const { decodedToken, isLoading } = this.props;
        const { order } = this.state;
        let { orderPart } = order;
        console.log('order parts in detail', orderPart);
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Order Detail</Title>
                    </Body>
                    <Right>
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
                        <TaskView
                            key={0}
                            order={order}
                            role={_get(decodedToken, 'role')}
                            cancelOrder={() => this.cancelAlert(order)}
                            onPress={() => this.orderClicked(order, _get(decodedToken, 'role'))}
                        />
                         {<OrderDetailView
                            key={1}
                            orderPart={orderPart}
                            role={_get(decodedToken, 'role')}
                            cancelOrder={() => this.cancelAlert(order)}
                            onPress={() => {}}
                        />}
                    </View>
                    <View style={[theme.marL15, theme.marR15, theme.mart15]} >

                    </View>
                </Content>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { orders, auth, user } = state;
    let { isLoading } = orders || false;
    let { orderList } = orders || {};
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
    };
}


export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(OrderDetailScreen));
