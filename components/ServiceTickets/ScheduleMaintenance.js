import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import truckImg from '../../assets/images/truckImg.png';
import assetLocation from '../../assets/images/assetLocation.png';

// import Input from 'react-native-elements';


import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, ListItem, Left, Right, Icon, Radio } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);


const list = [
    {
      name: 'Oil Change A',
      avatar_url: '',
      subtitle: '',
    },
    {
      name: 'Schedule PM II',
      avatar_url: '',
      subtitle: '',
    },
    {
        name: 'Other......',
        avatar_url: '',
        subtitle: '',
      },
  ];

class ScheduleMaintenanceScreen extends React.Component {
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
    onSave = () => {

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
                        <Title style={{ color: '#fff' }} >Schedule Maintainance</Title>
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
                                <Text>Schedule Maintainance</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            {
                                list.map((l, i) => (
                                <ListItem
                                    key={i}
                                    onPress={()=>this.handleOption(l)}
                                >
                                    <Left>
                                        <Text>{l.name}</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={ l.name == selectedOption } />
                                    </Right>
                                </ListItem>
                                ))
                            }
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={[theme.buttonNormal, {backgroundColor: '#ff585d'}]} onPress={() => this.onSave()} full>
                        <Text style={theme.butttonFixTxt}>Confirm</Text>
                    </Button>
                </View>
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ScheduleMaintenanceScreen));
