import React from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import theme from '../../theme';
import _get from 'lodash/get';
import { logoutUser } from '../../actions/auth';
import { Button } from 'native-base';
import withLocalization from '../hocs/withLocalization';
class Logout extends React.Component {
    render() {
        return (
            <View style={{ backgroundColor: '#ffffff' }}>
                <Button style={[theme.buttonNormal]} onPress={this.props.logoutUser} full>
                    <Text style={theme.butttonFixTxt}>{_get(this.props, 'strings.logoutTitle', 'LOGOUT')}</Text>
                </Button>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(Logout));
