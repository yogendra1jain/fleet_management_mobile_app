import * as React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { ActivityIndicator, StyleSheet, View } from "react-native";

const withLoadingScreen = (WrappedComponent) => {
  class LoadingScreen extends React.PureComponent {
    render() {
      if (this.props.isLoading) {
        // console.log('came in loading hoc', this.props.isLoading);
        return (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="black" />
          </View>);
      }
      return <WrappedComponent {...this.props}>{this.props.children}</WrappedComponent>;
    }
  }

  hoistNonReactStatics(LoadingScreen, WrappedComponent);

  return (LoadingScreen);
};

export default withLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
