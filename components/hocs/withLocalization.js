import * as React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
// import { ActivityIndicator, StyleSheet, View } from "react-native";
import strings from '../../utils/localization';

const withLocalization = (WrappedComponent) => {
  class LocalizedScreen extends React.PureComponent {
    render() {
        const { appLanguage, languageDetails } = this.props || 'en';
        // console.log('language details from server', languageDetails);
        const string = strings[appLanguage];
        return <WrappedComponent {...this.props} strings={string}>{this.props.children}</WrappedComponent>;
    }
  }

  hoistNonReactStatics(LocalizedScreen, WrappedComponent);


function mapStateToProps(state) {
  let { commonReducer } = state;
  let { appLanguage } = commonReducer || 'en';

  return {
      appLanguage,
  };
}

  return connect(mapStateToProps)(LocalizedScreen);
};


export default (withLocalization);
