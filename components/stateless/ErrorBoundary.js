import React from 'react';
import { View, Text } from 'react-native';
import { logError } from '../../utils';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        logError('component', error);
        this.setState({
            error: true,
            errorInfo: errorInfo,
        });
    }

    render() {
        if (this.state.error) {
            // Error path
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Something went wrong...</Text>
                </View>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
