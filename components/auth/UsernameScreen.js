import React from 'react';
import { connect } from 'react-redux';
import { View, ImageBackground, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { Text } from 'react-native-elements';
import loginbg from '../../assets/images/login_bg/loginbg.png';
import CarBg from '../../assets/images/bg.jpg';
import logoimg from '../../assets/images/login_screen_logo.png';
import loginLogo from '../../assets/images/fleetLoginLogo.png';

import t from 'tcomb-form-native';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';

import theme from '../../theme';
import { login } from '../../actions/auth';
import { postData } from '../../actions/commonAction';
import { clearNewDoctorData } from '../../actions/signup';
import { Container, Content, Button, Header, Body, Left, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import SplashScreen from 'react-native-splash-screen';
import withLocalization from '../hocs/withLocalization';
import CustomText from '../stateless/CustomText';


const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);


const ValidEmail = t.refinement(t.String, (n) => {
    if (n) {
        return n.toString().length > 3;
    }
});

const LoginUser = t.struct({
    email: ValidEmail,
    password: t.String,
});

class UsernameScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: {}, isCondition: false, num: '' };
        this.stylesheet = _cloneDeep(stylesheet);
        this.stylesheet.textbox.normal.color = 'black';
        this.stylesheet.controlLabel.normal.color = 'black';
        this.stylesheet.textboxView.normal.borderBottomColor = 'black';
        this.stylesheet.textbox.error.color = 'red';
        this.stylesheet.controlLabel.error.color = 'red';
        this.stylesheet.textboxView.error.borderBottomColor = 'red';
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        SplashScreen.hide();
        if (this.props.auth.user) {
            if (this.props.auth.user.isVerified) {
                this.props.navigation.navigate('Home');
            } else {
                // TODO.. move to the password setup screens.
            }
        }
        this.loadLanguageData();
    }

    onChange = (value) => {
        // const val = this.refs.form.getValue();
        // this.handleInputChange(value.email);
        this.setState({ value });
    }
    loadLanguageData = () => {
        let url = `/LanguageBundle/Get`;
        let constants = {
            init: 'GET_LANGUAGE_DETAILS_INIT',
            success: 'GET_LANGUAGE_DETAILS_SUCCESS',
            error: 'GET_LANGUAGE_DETAILS_ERROR',
        };
        let data = {
            id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        };
        let identifier = 'GET_LANGUAGE_DETAILS';
        let key = 'languageDetails';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('language data fetched successfully.');
            }, (err) => {
                console.log('error while fetching language data', err);
            });
    }

    onPress = () => {
        const value = this.refs.form.getValue();
        let data = {};
        if (value) {
            _set(data, 'email', value.email.toString());
            _set(data, 'password', value.password.toString());
            this.props.login(data);
        } else {
            // TODO... this statement below is somehow not working when onPress is called from onSubmitEditing.. when keyboard green tick key is pressed
            this.refs.form.getComponent('email').refs.input.focus();
        }
    }
    onPressSignup = () => {
        this.props.clearNewDoctorData('newDoctor');
        this.props.navigation.navigate('SignupScreen');
    }
    handlePasswordVisiblity = () => {
        console.log('came in handle password.==============>');
        this.setState({
            showPassword: !this.state.showPassword,
        });
    }
    
    render() {
        const { error, strings, appLanguage } = this.props;
        const options = {
            fields: {
                email: {
                    // placeholder: 'Enter email',
                    // autoFocus: true,
                    label: `${strings.emailLabel}`,
                    stylesheet: this.stylesheet,
                    config: {
                        strings: strings,
                    },
                    onSubmitEditing: () => this.refs.form.getComponent('password').refs.input.focus(),
                },
                password: {
                    secureTextEntry: !this.state.showPassword,
                    // placeholder: 'Enter Password',
                    returnKeyType: 'done',
                    label: `${strings.passwordLabel}`,
                    stylesheet: this.stylesheet,
                    config: {
                        handlePasswordVisiblity: () => this.handlePasswordVisiblity(),
                        strings: strings,
                    },
                    onSubmitEditing: () => this.onPress(),
                },
            },

        };


        return (
            <ContainerWithLoading style={theme.container} androidStatusBarColor="#00A9E0" iosBarStyle="light-content" isLoading={this.props.isLoading}>
                    <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0">
                        <Left style={{ flex: 1 }}>
                            <Button transparent onPress={() => this.props.navigation.navigate('LanguageSelection')}>
                                <Icon name='arrow-back' style={{ color: '#fff' }} />
                            </Button>
                        </Left>
                     </Header>
                    <Content style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#DBDBDB' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#00A9E0', paddingBottom: 60, marginBottom: Dimensions.get('window').height - 230 }]}>
                            <Image source={loginLogo} style={styles.profileImg} />
                        </View>
                        <View style={[theme.cardShape, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                         backgroundColor: '#f3f3f3', margin: 20, marginTop: 100, zIndex: 9999, borderRadius: 5 }]}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 40, paddingTop: 40 }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#00A9E0' }}>LOGIN</Text>
                            </View>
                            <View style={[theme.mart15, theme.marL25, theme.marR25]}>
                                <Form
                                    ref="form"
                                    options={options}
                                    type={LoginUser}
                                    value={this.state.value}
                                    onChange={this.onChange}
                                    style={theme.formStyle}
                                />
                            </View>
                            <View style={[theme.mart25]}>
                                <Button style={[theme.buttonLogin, { backgroundColor: '#00A9E0' }]} onPress={() => this.onPress()} full>
                                    <Text style={[theme.butttonFixTxt]}>{`${strings.loginLabel}`}</Text>
                                </Button>
                            </View>
                            <View style={[theme.mart10, { justifyContent: 'center', alignItems: 'center' }]}>
                                <CustomText style={{ fontSize: 10 }}>{`${strings.customerSupport}`}</CustomText>
                            </View>
                        </View>
                    </Content>
            </ContainerWithLoading>
        );
    }
}


const styles = StyleSheet.create({
    profileImg: {
        width: 140,
        height: 67,
    },
  });

function mapStateToProps(state) {
    let { auth, commonReducer } = state;
    let { userStatus } = auth || [];
    let { isLoading } = auth || false;
    let { appLanguage } = commonReducer || 'en';

    let error = _get(auth, 'error.errors[0].message', '');
    return {
        userStatus,
        auth,
        isLoading,
        error,
        appLanguage,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: data => dispatch(login(data)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
        clearNewDoctorData: id => dispatch(clearNewDoctorData(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(UsernameScreen));
