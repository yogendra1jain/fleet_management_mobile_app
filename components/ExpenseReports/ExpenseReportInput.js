import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Platform, Keyboard } from 'react-native';
// import expenseImg from '../../assets/images/expense.png';
import documentsImg from '../../assets/images/active-icons/document-active.png';
import ImagePicker from 'react-native-image-picker';
import cameraIcon from '../../assets/images/cameraIcon.png';

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import { showAlert, showToast } from '../../utils/index';
import t from 'tcomb-form-native';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { uploadDoc } from '../../actions/signup';
import { postData } from '../../actions/commonAction';
import ImageResizer from 'react-native-image-resizer';
import CustomText from '../stateless/CustomText';


const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

const ValidExpense = t.refinement(t.Number, (n) => {
    if (n) {
        return n > 0;
    }
});

class ExpenseReportInputScreen extends React.Component {
    constructor(props) {
        super(props);
        this.sameExpense = t.refinement(t.String, (s) => {
            return s == this.state.value.expense;
        });
        this.state = {
            expense: '',
            uploadedLinks: this.props.navigation.getParam('links', []),
            value: {},
        };
        this.ExpenseStruct = t.struct({
            expense: ValidExpense,
            confirmExpense: this.sameExpense,
        });
        this.validate = null;
        this.stylesheet = _cloneDeep(stylesheet);
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    setMileage = (value) => {
        this.setState({
            expense: value,
        });
    }
    getCurrentLocation = (value) => {
        this.setState({
            isLoading: true,
        });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    isLoading: false,
                });
                let data = {};
                data = {
                    assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
                    userId: _get(this.props, 'userDetails.user.id', ''),
                    documentType: 7,
                    amount: Number(value.expense),
                    links: this.state.uploadedLinks,
                    coordinate: {
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                    },
                };
                this.saveMileageData(data);
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
    }
    onSave = () => {
        Keyboard.dismiss();
        const value = this.refs.form.getValue();
       if (!value) {
            this.refs.form.getComponent('expense').refs.input.focus();
        } else {
            this.getCurrentLocation(value);
        }
    }
    onChange = (value) => {
        this.setState({ value });
        if (value.confirmExpense != null && value.confirmExpense != '') {
            this.validate = this.refs.form.getValue();
        }
    }

    saveMileageData = (data) => {
        let url = `/Assets/UploadMandatoryDocument`;
        let constants = {
            init: 'SAVE_MILEAGE_DATA_INIT',
            success: 'SAVE_MILEAGE_DATA_SUCCESS',
            error: 'SAVE_MILEAGE_DATA_ERROR',
        };
        let identifier = 'SAVE_MILEAGE_DATA';
        let key = 'savedMileageData';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                // console.log('mileage saved successfully.', data);
                showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
                this.props.navigation.navigate('Home');
            }, (err) => {
                console.log('error while saving mileage', err);
            });
    }
    render() {
        const { strings } = this.props;
        const options = {
            fields: {
                expense: {
                    keyboardType: 'numeric',
                    autoFocus: false,
                    returnKeyType: 'done',
                    secureTextEntry: false,
                    label: `${strings.expenseLabel}`,
                    error: `${strings.expenseErrorText}`,
                    onSubmitEditing: () => this.refs.form.getComponent('confirmExpense').refs.input.focus(),
                },
                confirmExpense: {
                    keyboardType: 'numeric',
                    autoFocus: false,
                    secureTextEntry: false,
                    returnKeyType: 'done',
                    label: `${strings.confirmExpenseLabel}`,
                    error: `${strings.confExpenseErrorText}`,
                    onSubmitEditing: () => this.onSave(),
                },
            },

        };
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading || this.state.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#059312', borderBottomWidth: 0 }} androidStatusBarColor='#059312'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.expenseReportTitle}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#059312', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={documentsImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>

                        <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                            <View style={{ justifyContent: 'flex-start', paddingRight: 5 }}>
                                <Icon name='exclamation' style={{ color: '#f6a800' }} type="FontAwesome" />
                            </View>
                            <View style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#f6a800', flexWrap: 'wrap' }}>
                                <CustomText style={{ fontSize: 13 }}>
                                    {`${strings.expenseAmountHelperText}`}
                                </CustomText>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                        <View style={[theme.marL15, theme.marR15, theme.mart15]} >
                            <Form
                                ref="form"
                                options={options}
                                type={this.ExpenseStruct}
                                value={this.state.value}
                                onChange={this.onChange}
                                style={[theme.formStyle]}
                            />
                        </View>
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ededed' }}>
                    <Button style={[theme.buttonNormal]} onPress={() => this.onSave()} full>
                        <Text style={theme.butttonFixTxt}>{`${strings.saveButton}`}</Text>
                    </Button>
                </View>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    let isLoading = commonReducer.isFetching || false;
    let { appLanguage, languageDetails } = commonReducer || 'en';

    return {
        decodedToken,
        userDetails,
        isLoading,
        appLanguage,
        languageDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
        uploadDoc: (formData, doc) => dispatch(uploadDoc(formData, doc)),
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
        width: 80,
        height: 67,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ExpenseReportInputScreen)));
