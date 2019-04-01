import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert } from 'react-native';
import _get from 'lodash/get';
// import Input from 'react-native-elements';
import { showAlert } from '../../utils/index';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, ListItem, Left, Right, Icon, Radio } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);


const list = [
    {
      name: 'Engine Related',
      avatar_url: '',
      subtitle: '',
    },
    {
      name: 'Hydraulics Issues',
      avatar_url: '',
      subtitle: '',
    },
    {
        name: 'Other......',
        avatar_url: '',
        subtitle: '',
      },
  ];

class OtherTicketScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            notes: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleNotes = (value) => {
        this.setState({
            notes: value,
        });
    }
    onSave = () => {
        let title= 'Submission Confirmition';
        let message = 'Your Information is being submitted. Please select "Confirm" otherwise select "Go Back"...';
        Alert.alert(
            `${title}`,
            `${message}`,
            [
                { text: 'Go Back', onPress: () => {} },
                { text: 'Confirm', onPress: () => this.props.navigation.navigate('Home') },
            ],
            { cancelable: false }
        );
    }
    handleOption = (item) => {
        this.setState({
            selectedOption: item.name,
        });
    }

    render() {
        const { selectedOption, notes } = this.state;
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{backgroundColor: '#00A9E0'}} androidStatusBarColor='#00A9E0'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >Other Repair Request</Title>
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
                                <Text>Other Repair Request</Text>
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
                    <View style={{ flex: 1, paddingTop: 15 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <Text>Notes: (as detailed as possible)</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                <TextInput
                                    style={{ height: 135, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                    onChangeText={value => this.handleNotes(value)}
                                    multiline={true}
                                    maxLength={120}
                                    value={_get(this, 'state.notes', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <Text>{`${notes.length}/120`}</Text>
                            </View>
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.onSave()} full>
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(OtherTicketScreen));
