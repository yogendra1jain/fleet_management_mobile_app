import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, CheckBox } from 'react-native-elements';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import theme from '../../theme';
import { setupNativeAuth, disableNativeAuth } from '../../actions/nativeAuth';
import { Container, Content, Header, Button, Title, Body, Left, Icon } from 'native-base';

class SetupNativeAuthScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authMethod: props.nativeAuth.method,
            isFingerprintAv: false,
            changeResult: '',
        };
        this.controls = {
            setupInProcess: false,
            isNativeAuthAlreadyEnabled: props.nativeAuth.isEnabled,
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.checkForFingerprints();
    }

    componentDidUpdate() {
        // Possible that due to separate calls to setState and setParams the component is getting re-rendered multiple times
        // Should combine these calls to one- setParams
        const { navigation } = this.props;
        const nativeAuthResult = navigation.getParam('nativeAuthResult');
        if (nativeAuthResult && this.controls.setupInProcess) {
            const method = nativeAuthResult.method;
            if (method === 'pin') {
                // TODO.. reverify the pin
                this.setState({ changeResult: 'Pin set successfully' });
                this.props.setupNativeAuth(method, nativeAuthResult.pin);
            } else if (method === 'fingerprint') {
                if (nativeAuthResult.success) {
                    this.setState({ changeResult: 'Fingerprint enabled successfully' });
                    this.props.setupNativeAuth(method);
                } else {
                    this.setState({
                        changeResult: 'Error in Authenticating Fingerprint',
                        authMethod: this.props.nativeAuth.method,
                    });
                }
            }
            navigation.setParams({ nativeAuthResult: null });
        }
        this.controls.setupInProcess = false;
    }

    checkForFingerprints = async () => {
        let compatible = FingerprintScanner.isSensorAvailable()
        .catch(error => console.log('error in fingerprint scanner', error));
        if (compatible) {
            let isFingerprintAv = true;
            this.setState({ isFingerprintAv });
        }
    }

    enableFingerprintMethod = () => {
        // In this function where we are activating the control,
        // ideally, no other state change should happen
        // otherwise, it will call the componentDidUpdate with this control value and cause unexpected results.
        this.controls.setupInProcess = true;
        const params = {
            method: 'fingerprint',
            returnRoute: 'SetupNativeAuth',
            verify: true,
        };
        this.props.navigation.navigate('NativeAuthEntry', params);
    };

    enablePinMethod = () => {
        this.controls.setupInProcess = true;
        const params = {
            method: 'pin',
            returnRoute: 'SetupNativeAuth',
        };
        this.props.navigation.navigate('NativeAuthEntry', params);
    };

    disablePinMethod = () => {
        this.props.disableNativeAuth();
    }

    render() {
        return (
            <Container>
              <Header translucent={false} style={{ backgroundColor: '#00A9E0' }} androidStatusBarColor="#00A9E0" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Select Authentication Mode</Title>
                    </Body>
                </Header>
                <Content>
                   <View style={[theme.vialsblock, theme.padT10, theme.mart10]}>
                        <Text style={[theme.screenHeadingtxt1, theme.marL10, theme.marR10]}>Select a Mode for Authentication</Text>                      
                        <View style={[theme.marL15, theme.marR15, theme.mart15]}>
                            {this.state.isFingerprintAv && <CheckBox
                                title='Device Native Auth Method'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.props.nativeAuth.method === 'fingerprint'}
                                onPress={this.enableFingerprintMethod}
                            />}
                            <CheckBox
                                title='6-digit PIN'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.props.nativeAuth.method === 'pin'}
                                onPress={this.enablePinMethod}
                            />
                            <CheckBox
                                title='Disable'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={!this.props.nativeAuth.isEnabled}
                                onPress={this.disablePinMethod}
                            />
                            <Text>{this.state.changeResult}</Text>
                        </View>
                    </View>
                </Content>
            </Container>

        );
    }
}


function mapStateToProps(state) {
    return {
        nativeAuth: state.nativeAuth,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setupNativeAuth: (method, pin) => dispatch(setupNativeAuth(method, pin)),
        disableNativeAuth: () => dispatch(disableNativeAuth()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupNativeAuthScreen);
