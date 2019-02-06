import React from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';

/*
 Since Native Auth is not mandatory, this component is not doing anything right now.
*/
class HomeWrapperScreen extends React.Component {
    constructor(props) {
        super(props);
        this.listener = null;
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this.registerListener();
    }

    doTheOnlyJob = () => {
        if (this.props.nativeAuth.isEnabled) {
            this.props.navigation.replace('HomeContent');
        } else {
            this.props.navigation.replace('HomeContent');
        }
    }

    registerListener = () => {
        this.listener = this.props.navigation.addListener('didFocus', () => {
        //    console.log('INSIDE THE WILL FOCUS LISTENER');
            this.doTheOnlyJob();
        });
    }

    componentWillUnmount() {
        this.releaseListener();
    }

    releaseListener = () => {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentDidUpdate() {
        console.log('HOME WRAPPER COMPONENT DID UPDATE');
    }

    render() {
        return (
            <View>
                <Image source={require('../assets/images/homeImg/bg.png')} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        nativeAuth: state.nativeAuth,
    };
}

export default connect(mapStateToProps)(HomeWrapperScreen);
