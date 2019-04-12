import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import contactMechanic from '../../assets/images/active-icons/contact-mechnic-active.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import comingSoonImg from '../../assets/images/comingSoonImg.png';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomBoldText from '../stateless/CustomBoldText';
const ContainerWithLoading = withLoadingScreen(Container);

const list = [
    {
      name: 'Fleet Manager',
      icon: 'user',
      subtitle: '',
    },
    {
      name: 'Repair Facility',
      icon: 'user',
      subtitle: '',
    },
  ];

class ContactPersonHomeScreen extends React.Component {
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
    handleContactItem = (item) => {
        switch (item.name) {
            case 'Repair Facility':
                this.props.navigation.navigate('MechanicProfile');
                break;
            // case 'Review OPEN Ticket(s)':
            //     this.props.navigation.navigate('ServiceTicketListScreen');
            //     break;
            default:
                return;
        }
    }

    render() {
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{ backgroundColor: '#ffb81c', borderBottomWidth: 0 }} androidStatusBarColor="#ffb81c">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >Contact Person</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#ffb81c', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={contactMechanic} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        <View style={[theme.centerAlign, { paddingBottom: 30, paddingTop: 30 }]}>
                            <Image source={comingSoonImg} style={{ width: 140, height: 135 }} />
                        </View>

                        <View style={[theme.centerAlign]}>
                            <CustomBoldText style={{ fontSize: 25, color: 'black' }}>COMING SOON...</CustomBoldText>
                        </View>
                        {/* <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {
                                list.map((l, i) => (
                                <ListItem
                                    key={i}
                                    leftAvatar={{ name: l.icon, type: 'Entypo' }}
                                    title={l.name}
                                    subtitle={l.subtitle}
                                    onPress={()=>this.handleContactItem(l)}
                                />
                                ))
                            }
                            </View>
                        </View> */}
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
      height: 71,
      width: 80,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ContactPersonHomeScreen));
