import React from 'react';
import { connect } from 'react-redux';
import { View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { Text } from 'react-native-elements';
import loginbg from '../../assets/images/login_bg/loginbg.png';
import CarBg from '../../assets/images/bg.jpg';
import logoimg from '../../assets/images/login_screen_logo.png';

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
        this.state = { value: {}, isCondition: false };
        this.stylesheet = _cloneDeep(stylesheet);
        this.stylesheet.textbox.normal.color = 'white';
        this.stylesheet.controlLabel.normal.color = 'white';
        this.stylesheet.textboxView.normal.borderBottomColor = 'white';
        this.stylesheet.textbox.error.color = 'white';
        this.stylesheet.controlLabel.error.color = 'white';
        this.stylesheet.textboxView.error.borderBottomColor = 'white';
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
    render() {
        const { error, strings, appLanguage } = this.props;
        const options = {
            fields: {
                email: {
                    // placeholder: 'Enter email',
                    // autoFocus: true,
                    label: `${strings.emailLabel}`,
                    stylesheet: this.stylesheet,
                    onSubmitEditing: () => this.refs.form.getComponent('password').refs.input.focus(),
                },
                password: {
                    secureTextEntry: true,
                    // placeholder: 'Enter Password',
                    returnKeyType: 'done',
                    label: `${strings.passwordLabel}`,
                    stylesheet: this.stylesheet,
                    onSubmitEditing: () => this.onPress(),
                },
            },

        };


        return (
            <ContainerWithLoading style={theme.container} androidStatusBarColor="#0e0a65" iosBarStyle="light-content" isLoading={this.props.isLoading}>
                
                <ImageBackground source={CarBg}
                    style={theme.backgroundImage}>
                    <Header transparent translucent>
                        <Left style={{ flex: 1 }}>
                            <Button transparent onPress={() => this.props.navigation.navigate('LanguageSelection')}>
                                <Icon name='arrow-back' style={{ color: '#fff' }} />
                            </Button>
                        </Left>
                     </Header>
                    <Content style={{ paddingTop: 50 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ paddingBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                        </View>
                        <View style={[theme.mart15, theme.marL15, theme.marR15]}>
                            <Form
                                ref="form"
                                options={options}
                                type={LoginUser}
                                value={this.state.value}
                                onChange={this.onChange}
                                style={theme.formStyle}
                            />
                        </View>
                    </View>
                    <View >
                        <Button style={[theme.buttonLogin]} onPress={() => this.onPress()} full>
                            <Text style={theme.butttonFixTxt}>{`${strings.loginLabel}`}</Text>
                        </Button>
                    </View>

                    <View style={{ paddingTop: 15, paddingBottom: 15, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.onPressSignup()}>
                            <Text style={[theme.butttonFixTxt, { color: 'white' }]}>{`${strings.signupText}`}</Text>
                        </TouchableOpacity>
                    </View>
                    </Content>
                </ImageBackground>
                
            </ContainerWithLoading>
        );
    }
}

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
