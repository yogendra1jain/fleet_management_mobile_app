import React from 'react';
import { View } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
import withErrorBoundary from './hocs/withErrorBoundary';
import { Container, Content, Header, Title, Body, Button, Left, Right, Icon } from 'native-base';

import _get from 'lodash/get';


class AvailableVialScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            itemCount: 0,
            totalVials: this.props.navigation.getParam('totalVials', []),
        };
        // this.totalVials = this.props.navigation.getParam('totalVials', []);
    }
    static navigationOptions = {
        header: null,
    };

    _renderContent = (vial) => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flexDirection: 'row' }}>In Transit:</Text>
                    <Text>{vial.content.inTransitQuantity}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flexDirection: 'row' }}>In Inventory:</Text>
                    <Text>{vial.content.inventoryQuantity}</Text>
                </View>
            </View>
        );
    }

    render() {
        let cartItems = [];
        _isArray(this.state.totalVials) && !_isEmpty(this.state.totalVials) && this.state.totalVials.map((vial, index) => {
            cartItems.push(
                <View style={{ flex: 1 }} key={index}>
                    <Card title={_get(vial, 'item.name', '')}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#ddd' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`In Transit:`}</Text>
                                <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 18 }}> {vial.inTransitQuantity}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`Remaining: `}</Text>
                                <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 18 }}>{vial.inventoryQuantity}</Text>
                            </View>
                        </View>
                    </Card>
                </View >
            );
        }
        );
        return (
            <Container style={theme.container} isLoading={this.props.isLoading} >
                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Available Vials</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#ededed' }}>
                    <View style={[]} >
                        {cartItems}
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(AvailableVialScreen));
