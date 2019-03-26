import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import theme from '../../theme';
import _get from 'lodash/get';
import { logoutUser } from '../../actions/auth';
import { Button } from 'native-base';
import withLocalization from '../hocs/withLocalization';
import { postData } from '../../actions/commonAction';

class Logout extends React.Component {
    handleLogout = () => {
        let url = `/login/Logout`;
        let constants = {
            init: 'LOGOUT_FROM_SERVER_INIT',
            success: 'LOGOUT_FROM_SERVER_SUCCESS',
            error: 'LOGOUT_FROM_SERVER_ERROR',
        };
        let data = {
            id: _get(this.props, 'decodedToken.FleetUser.id', ''),
        };
        let identifier = 'LOGOUT_FROM_SERVER';
        let key = 'logoutFromServer';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('documents uploaded successfully.');
                this.props.logoutUser()
            }, (err) => {
                console.log('error while uploading documents', err);
            });
    }
    render() {
        return (
            <View style={{ backgroundColor: '#ffffff' }}>
                <Button style={[theme.buttonNormal]} onPress={() => this.handleLogout()} full>
                    <Text style={theme.butttonFixTxt}>{_get(this.props, 'strings.logoutTitle', 'LOGOUT')}</Text>
                </Button>
            </View>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    console.log('decoded token', decodedToken);
    return {
        decodedToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(Logout));
