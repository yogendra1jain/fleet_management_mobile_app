import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import theme from '../../theme';
import _get from 'lodash/get';
import { logoutUser } from '../../actions/auth';
import { Button } from 'native-base';
import withLocalization from '../hocs/withLocalization';
import { postData } from '../../actions/commonAction';
import { setCheckInAsset } from '../../actions/auth';

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
                // this.handleCheckOut();
                this.props.logoutUser()
            }, (err) => {
                console.log('error while uploading documents', err);
            });
    }
    handleCheckOut = () => {
        if (_get(this.props, 'userDetails.checkedInto.id', '') == '') {
            this.handleLogout();
            return;
        } else {
            let url = `/Assets/CheckOut`;
            let constants = {
                init: 'CHECKIN_FOR_ASSET_INIT',
                success: 'CHECKIN_FOR_ASSET_SUCCESS',
                error: 'CHECKIN_FOR_ASSET_ERROR',
            };
            let data = {
                operatorId: _get(this.props, 'decodedToken.FleetUser.id', ''),
                assetId: _get(this.props, 'userDetails.checkedInto.id', ''),
            };
            let identifier = 'CHECKIN_FOR_ASSET';
            let key = 'checkInForAsset';
            this.props.postData(url, data, constants, identifier, key)
                .then((data) => {
                    console.log('checked out successfully.');
                    // this.props.timerFunc(0);
                    this.props.setCheckInAsset(false);
                    this.handleLogout();
                    // showToast('success', `Checked Out Successfully.`, 3000);
                    // this.loadUserInfo();
                }, (err) => {
                    console.log('error while checking in operator', err);
                    this.props.setCheckInAsset(false);
                    this.handleLogout();
                });
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: '#ffffff' }}>
                <Button style={[theme.buttonNormal]} onPress={() => this.handleCheckOut()} full>
                    <Text style={theme.butttonFixTxt}>{_get(this.props, 'strings.logoutTitle', 'LOGOUT')}</Text>
                </Button>
            </View>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    console.log('decoded token', decodedToken, 'user details', userDetails);
    return {
        decodedToken,
        userDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
        setCheckInAsset: isCheckin => dispatch(setCheckInAsset(isCheckin)),
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(Logout));
