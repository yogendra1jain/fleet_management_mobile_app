import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableHighlight, Platform, Text } from 'react-native';
import _get from 'lodash/get';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { AndroidBackHandler } from 'react-navigation-backhandler';
import { setTimer, timerFunc, callScanFingerPrint } from '../../actions/auth';
import theme from '../../theme';
import PinEntry from '../stateless/PinEntry';
import { Header, Button, Title, Body, Left, Icon } from 'native-base';

import FingerprintEntry from '../stateless/FingerprintEntry';

class NativeAuthEntryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entryError: false,
            attemptsDone: 0,
            allowedAttempts: 3,
            waitTime: 0,
        };
        this.controls = {
            isFirstTime: false,
        };
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        const { nativeAuth, navigation } = this.props;
        let method = navigation.getParam('method');
        /*
            This workaround has been done by defining firstTimeDone param.
            This is because AndroidBackHandler loads this component multiple times.
            And we want to start scanning in this function only once.
        */
        let firstTimeDone = navigation.getParam('firstTimeDone');
        if (!firstTimeDone) {
            this.controls.isFirstTime = true;
            navigation.setParams({ firstTimeDone: true });
        }
        if (!method) {
            method = nativeAuth.method;
        }
        if (method === 'fingerprint' && !firstTimeDone) {
            this.scanFingerprint();
        }
    }

    componentWillUnmount() {
        this.cancelActiveScanAndroid();
    }

    onBackButtonPressAndroid = () => {
        this.handleBack();
        return true;
    };

    handleBack = () => {
        this.cancelActiveScanAndroid();
        let returnRoute = this.props.navigation.getParam('returnRoute');
        const params = { nativeAuthResult: { success: false } };
        this.props.navigation.navigate(returnRoute, params);
    };

    cancelActiveScanAndroid = () => {
        if (Platform.OS === 'android') {
            console.log('Cancelling SCAN');
            FingerprintScanner.release();
        }
    };

    startWaitFlow = (timeToWait, onCompletion) => {
        this.props.timerFunc(timeToWait);
    };

    handleAuthenticationAttempted = (error = {}) => {
        console.log('came in error of onAttempt', error);
        let attemptsDone = this.state.attemptsDone + 1;
        this.setState({ entryError: true, attemptsDone });
    };

    scanFingerprint = async () => {
        console.log('STARTING SCAN');
        this.props.callScanFingerPrint(false);
        let result;
        let returnRoute = this.props.navigation.getParam('returnRoute');
        try {
            result = await FingerprintScanner.authenticate({ onAttempt: this.handleAuthenticationAttempted });
            this.props.setTimer(0);
            console.log('Scan Result:');
            let params = {
                nativeAuthResult: {
                    success: result,
                    method: 'fingerprint',
                    error: _get(result, 'name'),
                    returnContext: this.props.navigation.getParam('returnContext'),
                },
            };

            if (result) {
                this.props.navigation.navigate(returnRoute, params);
            }
        } catch (error) {
            console.log('error in catch of fingerprint', error);
            this.startWaitFlow(this.props.time > 0 ? this.props.time : 30, this.scanFingerprint);
        }
    }

    consumePinEntry = (code) => {
        let returnRoute = this.props.navigation.getParam('returnRoute');
        let success = (code === this.props.nativeAuth.pin);
        let verify = this.props.navigation.getParam('verify');
        let params = {
            nativeAuthResult: {
                success,
                method: 'pin',
                pin: code,
                returnContext: this.props.navigation.getParam('returnContext'),
            },
        };
        if (verify && !success) {
            let attemptsDone = this.state.attemptsDone + 1;
            this.setState({ entryError: true, attemptsDone });
            if (attemptsDone < this.state.allowedAttempts) {
                return;
            }
        }
        this.props.navigation.navigate(returnRoute, params);
    }

    render() {
        const { nativeAuth, navigation } = this.props;
        let method = navigation.getParam('method');
        if (!method) {
            method = nativeAuth.method;
        }
        return (
            <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
                <Header translucent={false} style={{ backgroundColor: '#4d47cd' }} androidStatusBarColor="#0e0a65" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Provide Authentication</Title>
                    </Body>
                </Header>
                <View style={theme.container}>
                    {/* <TouchableHighlight style={theme.button} onPress={this.handleBack} underlayColor='#99d9f4'>
                        <Text style={theme.buttonText}>Back</Text>
                    </TouchableHighlight> */}
                    {method === 'pin' &&
                        <PinEntry onFill={this.consumePinEntry} error={this.state.entryError} />
                    }
                    {method === 'fingerprint' &&
                        <FingerprintEntry error={this.state.entryError} onPress={() => this.scanFingerprint()} waitTime={this.props.time} isScanFingerPrint={this.props.isScanFingerPrint} />
                    }
                </View>
            </AndroidBackHandler>

        );
    }
}

function mapStateToProps(state) {
    let { time, isScanFingerPrint } = state.auth;
    return {
        nativeAuth: state.nativeAuth,
        time,
        isScanFingerPrint,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        setTimer: time => dispatch(setTimer(time)),
        timerFunc: time => dispatch(timerFunc(time)),
        callScanFingerPrint: scanFingerprint => dispatch(callScanFingerPrint(scanFingerprint)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NativeAuthEntryScreen);
