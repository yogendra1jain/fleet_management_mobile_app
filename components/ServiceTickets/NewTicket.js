import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import truckImg from '../../assets/images/truckImg.png';
import assetLocation from '../../assets/images/assetLocation.png';

// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);

class NewTicketScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{backgroundColor: '#ff585d'}} androidStatusBarColor='#ff585d'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >Service Ticket</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { marginTop: 25 }]}>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>Request Service Ticket</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        <TouchableHighlight onPress={() => {}} style={{ flex: 1, paddingLeft: 15, justifyContent: 'flex-start' }}>
                            <View>
                                <Image source={truckImg} style={{ width: 100, height: 100, backgroundColor: 'transparent' }} />
                                <View style={{ flexWrap: 'wrap' }}>
                                    <Text>Asset Details</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ paddingRight: 15, justifyContent: 'flex-end' }}>
                            <View>
                                <Image source={assetLocation} style={{ width: 100, height: 100 }} />
                                <View style={{ flexWrap: 'wrap' }}>
                                    <Text>Asset Location </Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[theme.centerAlign, { flex: 1, flexDirection: 'row', margin: 20 }]}>
                        <Text style={{ marginLeft: 10 }}>Select From</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: '#ff585d', borderRadius: 0, height: 55 }]} onPress={() => this.props.navigation.navigate('ScheduleMaintenanceScreen')} full>
                            <Text style={theme.butttonFixTxt}>Preventive Maintenance</Text>
                        </Button>
                        <Button full style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: '#ff585d', borderRadius: 0, height: 55 }]} onPress={() => this.props.navigation.navigate('OtherTicketScreen')}>
                            <Text style={theme.butttonFixTxt}>Other Repair Request</Text>
                        </Button>
                    </View>
                </Content>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { userDetails } = state.user || {};

    return {
        decodedToken,
        userDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(NewTicketScreen));
