import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import mapIcon from '../../assets/images/mapIcon.png';
// import Input from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);

class MechanicProfile extends React.Component {
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
    handleMechanic = () => {

    }

    render() {
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >Mechanic Profile</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 1, padding: 15 }}>
                            <View style={{ flex: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ paddingTop: 25 }}>
                                        <Icon name='screwdriver' type='MaterialCommunityIcons' />
                                    </View>
                                    <View style={[styles.subtitleView, { flexDirection: 'column', flexWrap: 'wrap' }]}>
                                        <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>John Snow</Text>
                                          <Text style={styles.ratingText}>Some info about mechanic</Text>
                                          <Text style={styles.ratingText}>663-3320-2311</Text>
                                    </View>
                                    <View >
                                    <View style={styles.subtitleView}>
                                        <Image source={mapIcon} style={{ width: 100, height: 80 }}/>
                                    </View>
                                    </View>

                                </View>
                            </View>
                            <View style={{ flex: 1, borderBottomColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.subtitleView, { flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-start' }]}>
                                          <Text style={{ fontWeight: 'bold', paddingLeft: 8 }}>Specialization</Text>
                                          <Text style={styles.ratingText}>Some info about mechanic</Text>
                                          <Text style={styles.ratingText}>663-3320-2311</Text>
                                    </View>
                                    <View >
                                    <View style={[theme.centerAlign, { paddingTop: 25, flexDirection: 'column' }]}>
                                        <Icon name='ios-calendar' />
                                        <Text style={{ }}>Book Appointment</Text>
                                    </View>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
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
      height: 120,
      width: 120,
      borderRadius: 40,
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 0,
        paddingTop: 5,
      },
      ratingImage: {
        height: 19.21,
        width: 100,
      },
      ratingText: {
        paddingLeft: 10,
        color: 'grey',
      },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(MechanicProfile));
