import React from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import theme from '../theme';
import withErrorBoundary from './hocs/withErrorBoundary';
import { Container, Content, Header, Title, Body, Button, Left, Right, Icon } from 'native-base';

import _get from 'lodash/get';
import { fetchAssetsForOperators } from '../actions/user';

class AssetCheckinScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            itemCount: 0,
            totalVials: this.props.navigation.getParam('totalVials', []),
        };
        // this.totalVials = this.props.navigation.getParam('totalVials', []);
    }

    componentDidMount() {
        let data = {
            id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        };
        this.props.fetchAssetsForOperators(data);
    }

    static navigationOptions = {
        header: null,
    };

    handleAssetClick = (index, asset) => {
        let title= 'Confirmation';
        let message = `This asset is checked in by other operator are you sure you want to check in for this asset?`;
        Alert.alert(
            `${title}`,
            `${message}`,
            [
                { text: 'Cancel', onPress: () => {} },
                { text: 'Confirm', onPress: () => {} },
            ],
            { cancelable: false }
        );
    }

    render() {
        const { operatorAssets } = this.props;
        let assetListView = [];
        _isArray(operatorAssets) && !_isEmpty(operatorAssets) && operatorAssets.map((asset, index) => {
            assetListView.push(
                <View style={{ flex: 1 }} key={index}>
                    <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                onPress={() => this.handleAssetClick(index, asset)} >
                        <Card title={_get(asset, 'assetId', '')}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#ddd' }}>
                                    <Text style={{ fontWeight: 'normal' }}>{`Make:`}</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 18 }}> {_get(asset, 'assetFields.make', '')}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'normal' }}>{`Fuel Type: `}</Text>
                                    <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 18 }}>{_get(asset, 'assetFields.fuelType', '')}</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
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
                        <Title style={{ color: '#fff' }} >Check In</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#ededed' }}>
                    <View style={[]} >
                        {assetListView}
                    </View>
                </Content>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    let { user, auth } = state;
    let { operatorAssets } = user || [];
    let { decodedToken } = auth || {};
    console.log('operator assets', operatorAssets);
    return {
        operatorAssets,
        decodedToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAssetsForOperators: data => dispatch(fetchAssetsForOperators(data)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(AssetCheckinScreen));
