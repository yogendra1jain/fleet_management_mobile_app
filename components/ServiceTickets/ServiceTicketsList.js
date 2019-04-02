import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import serviceImg from '../../assets/images/active-icons/service-ticket-active.png';
// import Input from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, ListItem, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);

const list = [
    {
      name: '12/26/2018',
      ticketNu: '# CIT 457675577',
      subtitle: '',
    },
    {
      name: '09/05/2018',
      ticketNu: '# CIT 34535345',
      subtitle: '',
    },
  ];

class ServiceTicketListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleOption = (item) => {
        this.setState({
            selectedOption: item.name,
        });
    }

    render() {
        const { selectedOption } = this.state;
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
                        <View style={[theme.centerAlign, { backgroundColor: '#ff585d', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={serviceImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {
                                list.map((l, i) => (
                                <ListItem
                                    selected={selectedOption == l.name}
                                    key={i}
                                    onPress={()=>this.handleOption(l)}
                                >
                                    <Left>
                                        <Text>{l.name}</Text>
                                    </Left>
                                    <Right>
                                        <Text>{l.ticketNu}</Text>
                                    </Right>
                                </ListItem>
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
      height: 56,
      width: 90,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ServiceTicketListScreen));
