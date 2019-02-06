import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import contactMechanic from '../../assets/images/contactMechanic.png';
// import Input from 'react-native-elements';
import { ListItem } from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
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
        console.log('item', item);
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
                        <Title style={{ color: '#fff' }} >Contact Person</Title>
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
                                <Image source={contactMechanic} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>Contact Person</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
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
                        </View>
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ContactPersonHomeScreen));
