import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ErrorBoundary from '../stateless/ErrorBoundary';

const withErrorBoundary = () => (Component) => {
    class WithErrorBoundaryComponent extends React.Component {
        render() {
            return (
                <ErrorBoundary>
                    <Component {...this.props} />
                </ErrorBoundary>
            );
        }
    }
    hoistNonReactStatic(WithErrorBoundaryComponent, Component);
    return WithErrorBoundaryComponent;
};

export default withErrorBoundary;
