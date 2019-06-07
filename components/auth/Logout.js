import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../../theme';
import _get from 'lodash/get';
import { logoutUser } from '../../actions/auth';
import { Button } from 'native-base';
import withLocalization from '../hocs/withLocalization';
import { postData } from '../../actions/commonAction';
import { setCheckInAsset } from '../../actions/auth';

class Logout extends React.Component {
    handleLogout = () => {
      const url = `/login/Logout`;
      const constants = {
        init: 'LOGOUT_FROM_SERVER_INIT',
        success: 'LOGOUT_FROM_SERVER_SUCCESS',
        error: 'LOGOUT_FROM_SERVER_ERROR',
      };
      const data = {
        id: _get(this.props, 'decodedToken.FleetUser.id', ''),
      };
      const identifier = 'LOGOUT_FROM_SERVER';
      const key = 'logoutFromServer';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('documents uploaded successfully.');
            // this.handleCheckOut();
            this.props.logoutUser();
          }, (err) => {
            console.log('error while uploading documents', err);
            this.props.logoutUser();
          });
    }
    handleCheckOut = () => {
      if (_get(this.props, 'userDetails.clockedInto.id', '') == '' || _get(this, 'props.decodedToken.FleetUser.role', 0)!= 1) {
        this.handleLogout();
        return;
      } else {
        const url = `/Assets/ClockOut`;
        const constants = {
          init: 'CHECKIN_FOR_ASSET_INIT',
          success: 'CHECKIN_FOR_ASSET_SUCCESS',
          error: 'CHECKIN_FOR_ASSET_ERROR',
        };
        const data = {
          operatorId: _get(this.props, 'decodedToken.FleetUser.id', ''),
          assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
        };
        const identifier = 'CHECKIN_FOR_ASSET';
        const key = 'checkInForAsset';
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
      if (this.props.isLoading) {
        return (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="black" />
          </View>
        );
      } else {
        return (
          <View style={{ backgroundColor: '#ffffff' }}>
            <Button style={[theme.buttonNormal]} onPress={() => this.handleCheckOut()} full>
              <Text style={theme.butttonFixTxt}>{_get(this.props, 'strings.logoutTitle', 'LOGOUT')}</Text>
            </Button>
          </View>
        );
      }
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});


function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { commonReducer } = state || {};
  const isLoading = commonReducer.isFetching || false;
  const { userDetails } = commonReducer || {};
  return {
    decodedToken,
    userDetails,
    isLoading,
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
