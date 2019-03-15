import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, ListItem, Avatar } from 'react-native-elements';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import theme from '../../theme';
import VerifyAuth from '../auth/VerifyAuth';
import Logout from '../auth/Logout';
import { setWarnings } from '../../actions/user';
// import { Feather } from '@expo/vector-icons';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withErrorBoundary from '../hocs/withErrorBoundary';

class UserAccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: true,
            checked: true,
        };
        this.listData = [
            {
                listTitle: 'Security Settings',
                listItems: [
                    {
                        title: 'Change Password',
                        icon: 'ios-keypad',
                        type: 'ionicon',
                        link: 'ChangePasswordScreen',
                    },
                    {
                        title: 'Manage App Lock',
                        icon: 'md-lock',
                        type: 'ionicon',
                        link: 'SetupNativeAuth',
                    },
                    {
                        title: 'Manage Language',
                        icon: 'language',
                        type: 'font-awesome',
                        link: 'LanguageSelectionScreen',
                    },
                ],
            },
        ];
    }
    static navigationOptions = {
        header: null,
    };

    listItemClicked = (item, index) => {
        if (item.link == 'showWarnings') {
            console.log('setting show warnings as true');
        } else if (item.link && item.link !== '') {
            this.props.navigation.navigate(item.link, item.link=='LanguageSelectionScreen' ? {fromMain: true}: {});
        }
    }
    setVialWarnings = (event) => {
        console.log('event', event);
        this.setState({
            checked: !this.state.checked,
        });
        this.props.setWarnings(!this.props.showVialWarning);
    }

    render() {
        // const { user, nativeAuth } = this.props;
        const listItems = !_isEmpty(this.listData) && this.listData.map((list, index) => (

            <View key={index} >
                <View key={index + 1}>
                    <Text style={[theme.screenHeadingtxt, theme.mart25]} key={1 + index + 1}>{list.listTitle}</Text>
                </View>
                <View style={[theme.vialsblock, theme.mart15]}>
                    {
                        list.listItems.map((item, i) => (
                            <ListItem
                                key={1 + i + index}
                                title={item.title}
                                titleStyle={{ fontSize: 14 }}
                                hideChevron={item.link == 'showWarnings' ? false : true}
                                onPress={() => this.listItemClicked(item, i)}
                                leftIcon={{ name: item.icon, type: item.type, style: { fontSize: 22, color: '#4d47cd' } }}
                                containerStyle={{ paddingTop: 15, paddingBottom: 15 }}
                            />
                        ))
                    }
                </View>
            </View>
        ));
        return (
            <Container>

                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ color: '#fff' }} >User Account</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80, backgroundColor: '#fff' }} >
                        <View style={{ paddingRight: 10 }}>
                            <Avatar
                                medium
                                withBorder
                                rounded
                                icon={{ name: 'user-o', type: 'font-awesome' }}
                                containerStyle={{ backgroundColor: '#1B06A9' }}
                                onPress={() => console.log('Works!')}
                                activeOpacity={0.7}
                            />
                        </View>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`${(_get(this.props, 'decodedToken.FleetUser.firstName', 'John'))} ${(_get(this.props, 'decodedToken.FleetUser.lastName', ''))}`}</Text>
                        </View>
                    </View>
                    <View>
                        {listItems}
                    </View>
                    <View style={theme.container}>
                        <VerifyAuth />
                    </View>
                    {/* </ScrollView> */}
                </Content>
                <Logout />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    let { auth, user } = state;
    let { decodedToken } = auth;
    let { showVialWarning } = user || true;
    return {
        user: state.user,
        nativeAuth: state.nativeAuth,
        auth,
        decodedToken,
        showVialWarning,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setWarnings: showVialWarning => dispatch(setWarnings(showVialWarning)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(UserAccountScreen));
