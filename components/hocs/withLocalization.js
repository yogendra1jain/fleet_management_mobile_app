import * as React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
// import { ActivityIndicator, StyleSheet, View } from "react-native";
import strings from '../../utils/localization';

const withLocalization = (WrappedComponent) => {
  class LocalizedScreen extends React.PureComponent {
    render() {
      const { appLanguage, languageDetails } = this.props;
      // const { bundle } = languageDetails || {};
      const { bundle } = strings || {};
      let string = bundle ? bundle[appLanguage]: {};
      if (!string) {
        string = {};
      }
      // console.log('language details from server', strings);
      // const string = strings[appLanguage];
      return <WrappedComponent {...this.props} strings={string}>{this.props.children}</WrappedComponent>;
    }
  }

  hoistNonReactStatics(LocalizedScreen, WrappedComponent);


  function mapStateToProps(state) {
    const { commonReducer } = state;
    const { appLanguage, languageDetails } = commonReducer || 'en';

    return {
      appLanguage,
      languageDetails,
    };
  }

  return connect(mapStateToProps)(LocalizedScreen);
};


export default (withLocalization);
