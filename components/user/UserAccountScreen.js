import React from 'react';
import { connect } from 'react-redux';
import { View, StatusBar, Switch } from 'react-native';
import { Text, List, ListItem, Avatar, CheckBox } from 'react-native-elements';
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
                        link: 'ChangePasswordScreen',
                    },
                    {
                        title: 'Manage App Lock',
                        icon: 'md-lock',
                        link: 'SetupNativeAuth',
                    },
                ],
            },
        ];
        _get(this.props.decodedToken, 'role') == 'Doctor' &&
        this.listData.push(
            {
                listTitle: 'App Settings',
                listItems: [
                    {
                        title: 'Show Vial Warnings',
                        icon: 'ios-settings',
                        link: 'showWarnings',
                    },
                ],
            }
        );
    }
    static navigationOptions = {
        header: null,
    };

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         title: 'User Account',
    //         headerTitleStyle: { alignSelf: 'center', flex: 1, textAlign: 'center' },
    //         // headerLeft: (<Ionicons
    //         //     name='ios-arrow-back' size={33} color="white" style={{ paddingLeft: 10 }}
    //         //     onPress={() => navigation.navigate('Home')}
    //         // />),
    //         headerRight: (<Feather
    //             name='edit-3' size={24} color="white" style={{ paddingRight: 10 }}
    //             onPress={() => navigation.navigate('EditUserProfile')}
    //         />),
    //     };
    // };

    listItemClicked = (item, index) => {
        if (item.link == 'showWarnings') {
            console.log('setting show warnings as true');
        } else if (item.link && item.link !== '') {
            this.props.navigation.navigate(item.link);
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
        const { showVialWarning } = this.props;
        const listItems = !_isEmpty(this.listData) && this.listData.map((list, index) => (

            <View key={index} >
                <View key={index + 1}>
                    <Text style={[theme.screenHeadingtxt, theme.mart25]} key={1 + index + 1}>{list.listTitle}</Text>
                </View>
                <View style={[theme.vialsblock, theme.mart15]}>
                    {/* <List key={index + 21}> */}
                    {
                        list.listItems.map((item, i) => (
                            <ListItem
                                key={1 + i + index}
                                title={item.title}
                                titleStyle={{ fontSize: 14 }}
                                hideChevron={item.link == 'showWarnings' ? false : true}
                                onPress={() => this.listItemClicked(item, i)}
                                leftIcon={{ name: item.icon, type: 'ionicon', style: { fontSize: 22, color: '#4d47cd' } }}
                                rightIcon={
                                    item.link == 'showWarnings' ?
                                        <View>
                                            <View style={[theme.alignRight, theme.directionRow]}>
                                                <Switch
                                                    onValueChange={event => this.setVialWarnings(event)}
                                                    value={showVialWarning} />
                                                {/* <CheckBox
                                                    right
                                                    title='Show'
                                                    color={'#ededed'}
                                                    checked={showVialWarning}
                                                    onPress={event => this.setVialWarnings(event)}
                                                    containerStyle={{ padding: 0, backgroundColor: '#ededed', borderWidth: 0, marginBottom: 0, marginTop: 0 }}
                                                /> */}
                                            </View>
                                        </View>
                                        : <Text></Text>
                                }
                                containerStyle={{ paddingTop: 15, paddingBottom: 15 }}
                            />
                        ))
                    }
                    {/* </List> */}
                </View>
            </View>
        ));
        return (
            <Container>

                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ color: '#fff' }} >User Account</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {/* <Feather
                            name='edit-3' size={24} color="white" style={{ paddingRight: 10 }}
                            onPress={() => this.props.navigation.navigate('EditUserProfile')}
                        /> */}
                    </Right>
                </Header>
                <Content>
                    {/* <ScrollView> */}
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
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{(_get(this.props, 'decodedToken.Vendor.name', 'John'))}</Text>
                            {/* <Text style={theme.textgray}>{`MMID: 34034034`}</Text>
                                <Text style={theme.textgray}>{`SSN: 320943492`}</Text> */}
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
    console.log('user details', user);
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
