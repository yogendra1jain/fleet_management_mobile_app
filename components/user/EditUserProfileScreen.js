import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, StyleSheet, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-elements';
import t from 'tcomb-form-native';

import theme from '../../theme';
import { updateUserProfile } from '../../actions/user';

const Form = t.form.Form;

const UserProfile = t.struct({
    firstName: t.String,
    lastName: t.String,
    email: t.String,
    medicalId: t.String,
    drivingLicenseNo: t.String,
    zipCode: t.String,
});

class EditUserprofileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: props.user };
    }

    static navigationOptions = {
        title: 'Edit User Profile',
    };

    onChange = (value) => {
        //  const val = this.refs.form.getValue();
        this.setState({ value });
    }

    onPress = () => {
        const value = this.refs.form.getValue();
        if (value) {
            console.log('Done move forward: ', value);
            this.props.updateUserProfile(value);
        } else {
            // console.log('Inside else' + this.refs.form.getComponent('phoneNo').refs.input.focus);
        }
    }

    render() {
        const options = {
            fields: {
                firstName: {
                    autoFocus: true,
                    onSubmitEditing: () => this.refs.form.getComponent('lastName').refs.input.focus(),
                },
                lastName: {
                    onSubmitEditing: () => this.refs.form.getComponent('email').refs.input.focus(),
                },
                email: {
                    onSubmitEditing: () => this.refs.form.getComponent('medicalId').refs.input.focus(),
                },
                medicalId: {
                    onSubmitEditing: () => this.refs.form.getComponent('drivingLicenseNo').refs.input.focus(),
                },
                drivingLicenseNo: {
                    onSubmitEditing: () => this.refs.form.getComponent('zipCode').refs.input.focus(),
                },
                zipCode: {
                    onSubmitEditing: () => this.onPress(),
                },
            },
        };
        return (
            <ScrollView>
                <View style={theme.container}>
                    <Text h4>User Details</Text>
                    <KeyboardAvoidingView style={theme.containerContent} behavior="padding">

                        <Form
                            ref="form"
                            options={options}
                            type={UserProfile}
                            value={this.state.value}
                            onChange={this.onChange}
                        />
                        <TouchableHighlight style={theme.buttonFix} onPress={this.onPress} underlayColor='#99d9f4'>
                            <Text style={theme.buttonText}>Save -> </Text>
                        </TouchableHighlight>
                    </KeyboardAvoidingView>

                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateUserProfile: userProfile => dispatch(updateUserProfile(userProfile)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserprofileScreen);

