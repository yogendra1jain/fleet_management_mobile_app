
import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, View, Image } from 'react-native';
import theme from '../../theme';
import { Container, Header, Button, Left, Right, Icon } from 'native-base';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class ImageViewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.uri = this.props.navigation.getParam('uri', '');
    this.fromScreen = this.props.navigation.getParam('fromScreen', '');
  }
    static navigationOptions = {
      header: null,
    };
    goBack = () => {
      if (this.fromScreen == '') {
        this.props.navigation.goBack();
      } else {
        this.props.navigation.navigate(this.fromScreen);
      }
    }
    render() {
      // const source = { uri: this.uri, cache: true};
      return (
        <Container style={theme.container} isLoading={this.props.isLoading}>
          <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor='#00A9E0'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          {/* <Content> */}
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <TouchableOpacity
                activeOpacity={ 0.75 }
                style={ styles.item }
              >
                <Image
                  style={ styles.image }
                  resizeMode='contain'
                  source={ { uri: this.uri } }
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
          {/* </Content> */}
        </Container>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  item: {
    // backgroundColor: 'orange',
    width: deviceWidth,
    height: deviceHeight,
  },
  image: {
    width: deviceWidth,
    height: deviceHeight,
  },
});
