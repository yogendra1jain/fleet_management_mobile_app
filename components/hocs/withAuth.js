import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import VerifyAuth from '../auth/VerifyAuth';

const withAuth = isNativeAuthRequired => (Component) => {
    class WithAuthComponent extends React.Component {
        render() {
            return (
                <VerifyAuth nativeAuthRequired={isNativeAuthRequired}>
                    <Component {...this.props} />
                </VerifyAuth>
            );
        }
    }
    hoistNonReactStatic(WithAuthComponent, Component);
    return WithAuthComponent;
};

export default withAuth;
