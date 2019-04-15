import React from 'react';
import { connect } from 'react-redux';
import { View, RefreshControl } from 'react-native';
import { Card, CheckBox } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import theme from '../../theme';
import strings from '../../utils/localization';

import withLoadingScreen from '../withLoadingScreen';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Body, Title, Icon, Button } from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { postData, setLanguage } from '../../actions/commonAction';

const ContainerWithLoading = withLoadingScreen(Container);

class LanguageSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: 'spn',
        };
        this.fromMain = this.props.navigation.getParam('fromMain', false);
    }
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        SplashScreen.hide();
        // this.props.setLanguage('en');
        // const { decodedToken } = this.props;
        this.loadLanguageInfo();
        // console.log('this.props in languae screen', this.props);
    }
    _onRefresh = () => {
        this.loadLanguageInfo();
    }
    loadLanguageInfo = () => {
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
                console.log('language data fetched successfully.', data);
            }, (err) => {
                console.log('error while fetching language data', err);
            });
    }
  
    setLanguage = (lan) => {
        this.setState({
            language: lan,
        });
        this.props.setLanguage(lan);
    }
    onProceed = () => {
        if (this.fromMain) {
            this.props.navigation.navigate('Home');
        } else {
            this.props.navigation.navigate('WhichUser');
        }
        
    }
    handleItem = (lan) => {
        this.setState({
            language: lan,
        });
        this.props.setLanguage(lan);
    }

    render() {
        const { appLanguage, languageDetails } = this.props;
        const { supportedLanguages, bundle } = strings || [];
        const string = bundle[appLanguage];
        let languageList = [];
        !_isEmpty(supportedLanguages) && supportedLanguages.map((language, i) => {
            languageList.push(
                <ListItem key={i} selected={appLanguage==language.value } onPress={() => this.handleItem(language.value)}>
                    <Left>
                        <Text style={{ fontFamily: 'Montserrat-Regular' }}>{`${language.value == 'en' ? string.englishTitle: string.spanishTitle}`}</Text>
                    </Left>
                    <Right>
                    </Right>
                </ListItem>
            );
        });
        return (
            <ContainerWithLoading isLoading={this.props.isLoading}>
               <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor='#00A9E0'>
                   {
                       this.fromMain &&
                       <Left style={{ flex: 1 }}>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={{ color: '#fff' }} />
                            </Button>
                        </Left>
                   }
                    <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={{ fontFamily: 'Montserrat-Bold' }}>{`${string.selectLanguageTitle}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
               </Header>
                <Content
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.isLoading}
                        onRefresh={this._onRefresh}
                    />
                }
                >
                    <List>
                        {
                            languageList
                        }
                    </List>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.onProceed()} full>
                        <Text style={theme.butttonFixTxt}>{`${string.proceedText}`}</Text>
                    </Button>
                </View>
            </ContainerWithLoading >

        );
    }
}

function mapStateToProps(state) {
    let { auth, commonReducer } = state;
    let { userDetails, languageDetails } = commonReducer || {};
    let { appLanguage } = commonReducer || 'en';
    let { token } = auth.userStatus;
    let isLoading = commonReducer.isFetching || false;
    let { decodedToken, time, isCheckInAsset } = auth || {};
    return {
        auth,
        token,
        isLoading,
        decodedToken,
        userDetails,
        isCheckInAsset,
        time,
        appLanguage,
        languageDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setLanguage: language => dispatch(setLanguage(language)),
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    };
}

export default withErrorBoundary()((connect(mapStateToProps, mapDispatchToProps)(withLocalization(LanguageSelectionScreen))));

