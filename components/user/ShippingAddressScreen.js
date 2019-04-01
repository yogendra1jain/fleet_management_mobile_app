import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import t from 'tcomb-form-native';
import { saveShippingAddress } from '../../actions/user';

import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';

import withErrorBoundary from '../hocs/withErrorBoundary';

const ContainerWithLoading = withLoadingScreen(Container);
const Form = t.form.Form;

class ShippingAddressScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.BillingAddress = t.struct({
            zipcode: t.maybe(t.String),
            city: t.maybe(t.String),
            state: t.maybe(t.String),
            addressLine1: t.maybe(t.String),
            addressLine2: t.maybe(t.String),
        });
        this.facilityId = this.props.navigation.getParam('facilityId', '');
        this.manufracturerId = this.props.navigation.getParam('manufracturerId', '');
        this.manufracturerName = this.props.navigation.getParam('manufracturerName', '');
    }

    static navigationOptions = {
        header: null,
    };
    onPress = () => {
        const value = this.refs.billingAddressForm.getValue();
        if (value) {
            let data = {};
            data.address = this.state.value;
            data.billingAddress = data.address;
            data.id = this.facilityId;
            console.log('data for save shipping address', data);
            this.props.saveShippingAddress(data, this.manufracturerId, this.manufracturerName);
        }
    }
    onChange = (value) => {
        this.setState({ value });
        // this.props.newMedicalFacility(value, 'newDoctor');
    }
    componentDidMount() {
        let address = this.props.navigation.getParam('shippingAddress', {});

        let value = Object.assign({}, this.state.value, address);
        this.setState({ value });
    }

    componentWillReceiveProps(props) {
    }

    addresszipcodeBlur = (value, forBillingAddress) => {
        this.setAddress = true;
        let zipCode = '';
        zipCode = _get(this.state, 'value.zipcode', '');
        if (zipCode.length == 5 || zipCode.length == 9) {
            this.props.fetchAddressDetails(zipCode);
        }
    }

    render() {
        const billingAddressOptions = {
            fields: {
                addressLine1: {
                    keyboardType: 'default',
                    label: 'Address Line1',
                    // stylesheet: this.stylesheet,
                    onSubmitEditing: () => this.refs.billingAddressForm.getComponent('addressLine2').refs.input.focus(),
                },
                addressLine2: {
                    keyboardType: 'default',
                    label: 'Address Line2',
                    // stylesheet: this.stylesheet,
                    onSubmitEditing: () => this.refs.billingAddressForm.getComponent('city').refs.input.focus(),
                },
                zipcode: {
                    keyboardType: 'numeric',
                    label: 'Zip Code',
                    onBlur: this.addresszipcodeBlur,
                    // stylesheet: this.stylesheet,
                    // onSubmitEditing: () => this.refs.billingAddressForm.getComponent('address').refs.input.focus(),
                },
                city: {
                    keyboardType: 'default',
                    label: 'City',
                    editable: true,
                    // onSubmitEditing: () => this.refs.billingAddressForm.getComponent('state').refs.input.focus(),
                },
                state: {
                    keyboardType: 'default',
                    label: 'State',
                    editable: true,
                    // stylesheet: this.stylesheet,
                    // onSubmitEditing: () => this.refs.billingAddressForm.getComponent('address').refs.input.focus(),
                },
            },
        };
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#00A9E0' }} androidStatusBarColor="#00A9E0" iosBarStyle="light-content">
                    <Left >
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#fff' }} >Shipping Address</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ backgroundColor: '#ededed' }}>
                    <View style={theme.plrb15}>
                        <View style={theme.headingstyle2}>
                            <View><Text style={theme.headingstyletxt2}>Shipping Address</Text></View>
                        </View>
                        <Form
                            ref="billingAddressForm"
                            options={billingAddressOptions}
                            type={this.BillingAddress}
                            value={this.state.value}
                            onChange={this.onChange}
                        />
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.onPress()} full>
                        <Text style={theme.butttonFixTxt}>SAVE</Text>
                    </Button>
                </View>

            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { auth, signup, doctors, user } = state;
    let { newDoctor, npiData, newAssistant } = signup || {};
    let { uploadedDoc, documentTypes } = signup || [];
    let { isLoading } = user || false;
    let { medicalFacilityList, manufracturerList } = doctors || [];


    return {
        newDoctor,
        auth,
        isLoading,
        medicalFacilityList,
        manufracturerList,
        npiData,
        uploadedDoc,
        documentTypes,
        newAssistant,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAddressDetails: zipcode => dispatch(fetchAddressDetails(zipcode)),
        saveShippingAddress: (data, manufracturerId, manufracturerName) => dispatch(saveShippingAddress(data, manufracturerId, manufracturerName)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ShippingAddressScreen));
