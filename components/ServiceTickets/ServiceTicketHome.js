import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import serviceImg from '../../assets/images/ios/service-ticket.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);

const list = [
    {
      name: 'Open NEW Ticket',
      avatar_url: '',
      subtitle: '',
    },
    {
      name: 'Review OPEN Ticket(s)',
      avatar_url: '',
      subtitle: '',
    },
    {
        name: 'CLOSED Ticket(s)',
        avatar_url: '',
        subtitle: '',
      },
  ];

class ServiceTicketHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mileage: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleTicketItem = (item) => {
        console.log('item', item);
        switch (item.name) {
            case 'Open NEW Ticket':
                this.props.navigation.navigate('NewTicketScreen');
                break;
            case 'Review OPEN Ticket(s)':
                this.props.navigation.navigate('ServiceTicketListScreen');
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{backgroundColor: '#00A9E0'}} androidStatusBarColor='#00A9E0'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
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
                            <TouchableHighlight
                                style={[styles.profileImgContainer, { borderColor: 'green', borderWidth: 1 }]}
                            >
                                <Image source={serviceImg} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>Service Ticket</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {
                                list.map((l, i) => (
                                <ListItem
                                    key={i}
                                    leftAvatar={{ source: { uri: l.avatar_url } }}
                                    title={l.name}
                                    subtitle={l.subtitle}
                                    onPress={()=>this.handleTicketItem(l)}
                                />
                                ))
                            }
                            </View>
                        </View>
                        <TouchableHighlight onPress={() => {}}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'row', margin: 20 }]}>
                                {/* <View style={{ flex: 1 }}> */}
                                    <Icon name='ios-calendar' />
                                {/* </View>
                                <View style={{ flex: 1 }}> */}
                                    <Text style={{ marginLeft: 10 }}>Upcoming Appointments</Text>
                                {/* </View> */}
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('TaskListScreen')} style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <View>
                                <Icon
                                    name='tasks'
                                    type='FontAwesome'
                                />
                                <View style={{ flexWrap: 'wrap' }}>
                                    <Text>Tasks</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ justifyContent: 'flex-end' }}>
                            <View>
                                <Icon
                                    name='contact-phone'
                                    type='MaterialIcons'
                                />
                                <View style={{ flexWrap: 'wrap' }}>
                                    <Text>Contact Fleet Manager</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
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

const styles = StyleSheet.create({
    profileImgContainer: {
      marginLeft: 8,
      height: 120,
      width: 120,
      borderRadius: 40,
      borderWidth: 1,
    },
    profileImg: {
      height: 120,
      width: 120,
      borderRadius: 40,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ServiceTicketHomeScreen));
