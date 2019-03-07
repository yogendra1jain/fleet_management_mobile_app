import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import theme from '../theme';
import tasksImg from '../assets/images/tasks.png';
import gasFillImg from '../assets/images/gasfill.png';
import MileageImg from '../assets/images/mileageImg.png';
import ServiceImg from '../assets/images/serviceImg.png';
import DocumentsImg from '../assets/images/documentsImg.png';
import ContactMechanic from '../assets/images/contactMechanic.png';

import withLoadingScreen from './withLoadingScreen';
import { Container, Content, Header, Body, Left, Right, Button, Toast, Title } from 'native-base';
import withAuth from './hocs/withAuth';
import SplashScreen from 'react-native-splash-screen';
import withErrorBoundary from './hocs/withErrorBoundary';

const ContainerWithLoading = withLoadingScreen(Container);

class HomeContentScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            enableSearch: false,
            filteredPatients: [],
            refreshing: false,
        };
        this.invokingUser = '';
    }
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        SplashScreen.hide();
        // const { decodedToken } = this.props;
    }
    _onRefresh = () => {
        Toast.show({
            text: 'Updating Data',
        });
    }

    render() {
        return (
            <ContainerWithLoading isLoading={this.props.isLoading}>
               <Header>
                <Left style={{ flex: 1 }}>
                    </Left>
                <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Title>Welcome to My FMS</Title>
                </Body>
                <Right style={{ flex: 1 }}>
                </Right>
               </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{ backgroundColor: '#ededed' }}>
                    <View style={{ flex: 1 }}>
                    <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('AssetCheckinScreen')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={tasksImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('AssetCheckinScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Check In</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('TaskListScreen')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={tasksImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('TaskListScreen')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Tasks / To Do</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('GasFilUpHome')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={gasFillImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('GasFilUpHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Gas Fill Up</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('UpdateMileageHome')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={MileageImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('UpdateMileageHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Update Mileage</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('ServiceTicketHome')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={ServiceImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('ServiceTicketHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Service Ticket</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('DocumentsHome')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={DocumentsImg} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('DocumentsHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Documents</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                            onPress={() => this.props.navigation.navigate('ContactPersonHome')} >
                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                <Image source={ContactMechanic} style={{ width: 110, height: 109 }} />
                                <Button onPress={() => this.props.navigation.navigate('ContactPersonHome')} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                    <Text style={theme.buttonSmallTxt}>Contact FM/Mechanic</Text>
                                </Button>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </Content >
            </ContainerWithLoading >

        );
    }
}

function mapStateToProps(state) {
    let { auth } = state;
    let { token, isLoading } = auth.userStatus;
    let { decodedToken, availableVials } = auth || {};
    return {
        auth,
        token,
        isLoading,
        decodedToken,
        availableVials,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default withErrorBoundary()(withAuth(true)(connect(mapStateToProps, mapDispatchToProps)(HomeContentScreen)));

