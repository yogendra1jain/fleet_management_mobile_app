import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import serviceImg from '../../assets/images/active-icons/service-ticket-active.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';

import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';

import withLocalization from '../hocs/withLocalization';

const ContainerWithLoading = withLoadingScreen(Container);

class ServiceTicketHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mileage: '',
        };
    }
    getListLabels = (strings) => {
        return [
            {
              name: strings.openNewTicketLabel,
              avatar_url: '',
              subtitle: '',
            },
            {
              name: strings.reviewOpenTicketsLabel,
              avatar_url: '',
              subtitle: '',
            },
            {
                name: strings.approvedTicketsLabel,
                avatar_url: '',
                subtitle: '',
              },
              {
                name: strings.rejectedTicketsLabel,
                avatar_url: '',
                subtitle: '',
              },
          ];
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleTicketItem = (item, strings) => {
        console.log('item', item);
        switch (item.name) {
            case strings.openNewTicketLabel:
                this.props.navigation.navigate('NewTicketScreen');
                break;
            case strings.reviewOpenTicketsLabel:
                this.props.navigation.navigate('ServiceTicketListScreen', { status: 0 });
                break;
            case strings.approvedTicketsLabel:
                this.props.navigation.navigate('ServiceTicketListScreen', { status: 2 });
                break;
            case strings.rejectedTicketsLabel:
                this.props.navigation.navigate('ServiceTicketListScreen', { status: 1 });
                break;
            default:
                return;
        }
    }
    goBack = () => {
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 2000);
    }

    render() {
        const { strings } = this.props;
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header translucent={false} style={{backgroundColor: '#ff585d', borderBottomWidth: 0 }} androidStatusBarColor='#ff585d'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.serviceButton}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                {/* <NavigationEvents
                    onDidFocus={payload => this.goBack()}
                /> */}
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#ff585d', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={serviceImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        {/* <View style={[theme.centerAlign, { paddingBottom: 30, paddingTop: 30 }]}>
                            <Image source={comingSoonImg} style={{ width: 140, height: 135 }} />
                        </View>

                        <View style={[theme.centerAlign]}>
                            <CustomBoldText style={{ fontSize: 25, color: 'black' }}>COMING SOON...</CustomBoldText>
                        </View> */}
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {
                                this.getListLabels(strings).map((l, i) => (
                                <ListItem
                                    key={i}
                                    leftAvatar={{ source: { uri: l.avatar_url } }}
                                    title={l.name}
                                    subtitle={l.subtitle}
                                    onPress={()=>this.handleTicketItem(l, strings)}
                                />
                                ))
                            }
                            </View>
                        </View>
                        {/* <TouchableHighlight onPress={() => {}}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'row', margin: 20 }]}>
                                    <Icon name='ios-calendar' />
                               
                                    <CustomText style={{ marginLeft: 10 }}>{`${strings.upcomingAppointmentsLabel}`}</CustomText>
                            </View>
                        </TouchableHighlight> */}
                    </View>
                    {/* <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('TaskListScreen')} style={{ flex: 1, justifyContent: 'flex-start' }}>
                            <View>
                                <Icon
                                    name='tasks'
                                    type='FontAwesome'
                                />
                                <View style={{ flexWrap: 'wrap' }}>
                                    <CustomText>{`${strings.TASKS}`}</CustomText>
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
                                    <CustomText>{`${strings.contactManagerLabel}`}</CustomText>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View> */}
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ServiceTicketHomeScreen)));
