import React from 'react';
import { Alert, View, AppState } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { updateAuthTime } from '../../actions/nativeAuth';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { getActiveRouteName, getCurrentTime, setAxiosAuthHeader } from '../../utils';
import { logoutUser } from '../../actions/auth';

/*
    VerifyAuth component will be used in any other component to allow only authenticated users
    PROBLEM... as such the component render function should not create side effects.
    But probably using navigation to navigate within the WillMount function will cause side effect.
    TODO..Possible way to resolve this out is to move the navigation to action and simply create a dispatch from here.
*/

class VerifyAuth extends React.Component {
    constructor(props) {
        super(props);
        this.controls = {
            // This control is to ensure that the native auth verification is done only
            // once for the lifecycle of the component holding VerifyAuth
            toVerify: true,
            isNatveMandatory: false,
            timeout: 15, // Timeout for the verified state is 15 mins
        };
        this.state = {
            isVerified: false,
        };
        this.listener = null;
    }

    componentDidMount() {
        this.registerListener();
        this.verify();
    }

    componentDidUpdate() {
        this.verify();
    }

    reVerifyAuth = (nextAppState) => {
        if (nextAppState === 'active' && !this.controls.toVerify && this.props.navigation.isFocused()) {
            this.controls.toVerify = true;
            this.setState({ isVerified: true });
        }
    }

    registerListener = () => {
        AppState.addEventListener('change', this.reVerifyAuth);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.reVerifyAuth);
    }

    verify = () => {
        const { nativeAuthRequired, navigation, nativeAuth, token } = this.props;
        if (!this.props.navigation.isFocused()) {
            return;
        }
        if (_isEmpty(token)) {
            navigation.navigate('Auth');
            return;
        } else {
            if (_get(this.props.auth, 'decodedToken.exp', 0)*1000 < new Date().getTime()) {
                console.log('exp time is lesser');
                this.props.logoutUser();
                console.log('fired logout action');
            } else {
                setAxiosAuthHeader(token);
            }
        }
        if (!nativeAuthRequired && this.controls.toVerify) {
            this.controls.toVerify = false;
            this.setState({ isVerified: false });
            return;
        }

        const nativeAuthResult = navigation.getParam('nativeAuthResult');

        if (nativeAuthResult && this.controls.toVerify) {
            if (!nativeAuthResult.success) {
                this.showFailureAlert();
            } else {
                this.setState({ isVerified: true });
                this.props.updateAuthTime(getCurrentTime());
            }
            this.controls.toVerify = false;
            navigation.setParams({ nativeAuthResult: null });
            return;
        }

        const isAlreadyAuthenticated = () => {
            // Allowing the user to be authenticated for this.controls.timeout mins.
            return (getCurrentTime() - nativeAuth.lastSuccessTime) <= this.controls.timeout * 60000;
        };

        if (nativeAuthRequired && this.controls.toVerify) {
            if (isAlreadyAuthenticated()) {
                this.controls.toVerify = false;
                this.setState({ isVerified: true });
            } else {
                if (nativeAuth.isEnabled) {
                    const params = {
                        returnRoute: getActiveRouteName(navigation.state),
                        verify: true,
                    };
                    console.log('Navigating to NativeAuthEntry from VerifyAuth');
                    navigation.navigate('NativeAuthEntry', params);
                } else {
                    if (this.controls.isNatveMandatory) {
                        this.showNativeAuthNotSetAlert();
                    } else {
                        this.controls.toVerify = false;
                        this.setState({ isVerified: true });
                    }
                }
            }
        }
    };

    showFailureAlert = () => {
        Alert.alert(
            'Native Authentication Failed.',
            'Press Ok To go back to initial screen.',
            [
                {
                    text: 'Ok', onPress: () => {
                        this.props.navigation.replace('Home');
                    },
                },
            ],
            {
                onDismiss: () => this.props.navigation.replace('Home'),
            }
        );
    };

    showNativeAuthNotSetAlert = () => {
        Alert.alert(
            'Native Authentication Required to access this Feature.',
            'Please proceed to setup your authentication method',
            [
                {
                    text: 'Proceed', onPress: () => {
                        this.props.navigation.replace('SetupNativeAuth');
                    },
                },
            ],
            {
                cancelable: false,
            }
        );
    };

    render() {
        if (this.props.children && this.state.isVerified) {
            return this.props.children;
        }
        return <View />;
    }
}

function mapStateToProps(state) {
    let { auth, nativeAuth } = state;
    let token = '';
    if (!_isEmpty(_get(auth, 'userStatus.token', ''))) {
        token = _get(auth, 'userStatus.token', '');
    }
    return {
        auth,
        nativeAuth,
        token,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateAuthTime: authTime => dispatch(updateAuthTime(authTime)),
        logoutUser: () => dispatch(logoutUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(VerifyAuth));
