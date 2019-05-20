import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image } from 'react-native';
import _get from 'lodash/get';
// import Input from 'react-native-elements';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import { postData } from '../../actions/commonAction';

import CustomText from '../stateless/CustomText';
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, ListItem, Left, Right, Icon, Radio } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomBoldText from '../stateless/CustomBoldText';
import pdfIcon from '../../assets/images/pdficon.png';
import videoIcon from '../../assets/images/videoIcon.png';
// import Voice from 'react-native-voice';
import TextToSpeech from '../stateless/SpeechToText';
import AssetView from '../stateless/AssetView';

const ContainerWithLoading = withLoadingScreen(Container);
const ImageWithLoading = withLoadingScreen(Image);

class OtherTicketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      notes: '',
      imageSource: '',
      links: [],
      uploadedLinks: [],
      isSpeeking: false,
    };
  }
    static navigationOptions = {
      header: null,
    };
    componentWillUnmount() {
    }
    componentDidMount() {
    }
    handleNotes = (value) => {
      this.setState({
        notes: value,
      });
    }
    onSave = () => {
    //   const title= 'Submission Confirmition';
    //   const message = 'Your Information is being submitted. Please select "Confirm" otherwise select "Go Back"...';
      if (this.state.notes == '') {
        Alert.alert(
            `Warning`,
            `Please fill Notes field to Save.`,
            [
              { text: 'Ok', onPress: () => {} },
            ],
            { cancelable: false }
        );
      } else {
        this.props.navigation.navigate('NewTicketScreen', { notes: this.state.notes });
        // Alert.alert(
        //     `${title}`,
        //     `${message}`,
        //     [
        //       { text: 'Go Back', onPress: () => {} },
        //       { text: 'Confirm', onPress: () => this.handleSave() },
        //     ],
        //     { cancelable: false }
        // );
      }
    }
    handleOption = (item) => {
      this.setState({
        selectedOption: item.name,
      });
    }
    handleTextToSpeech = (e, name) => {
      this.setState({
        [name]: _get(e, 'value[0]', ''),
      });
    }

    renderContent = (strings) => {
      const { userDetails } = this.props;
      const assetListView = [];
      assetListView.push(
          <AssetView
            key={0}
            index={0}
            selectedIndex={0}
            asset={_get(userDetails, 'clockedInto', {})}
            strings={strings}
            handleAssetClick={this.handleAssetClick}
            handleCheckIn={this.getCurrentLocation}
            decodedToken={this.props.decodedToken}
            userDetails={this.props.userDetails}
            handleCheckOut={this.handleCheckOut}
            hideButton={true}
          />
      );
      return assetListView;
    }

    render() {
      const { notes } = this.state;
      const { strings } = this.props;
      const images = [];
      !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link, index) => {
        // console.log('link in loop', link, 'uploaded links', this.state.uploadedLinks);
        images.push(
            <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
              {
                <ImageWithLoading isLoading={link.isLoading} source={link.isVideo? videoIcon: !link.isPdf ? { uri: link.imageSource }: pdfIcon} style={{ width: 100, height: 100 }} />
              }
              <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                  {/* <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <Text>Comments: </Text>
                            </View> */}
                  <View style={{ flex: 1, marginLeft: 10, marginRight: 10, position: 'relative' }}>
                    <TextInput
                      style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                      onChangeText={value => this.handleComments(value, index)}
                      multiline={true}
                      placeholder={'Comments'}
                      maxLength={120}
                      value={_get(link, 'comments', '').toString()}
                      underlineColorAndroid={'transparent'}
                      keyboardType={'default'}
                    />
                    <TextToSpeech
                      handleTextToSpeech={e => this.handleComments(_get(e, 'value[0]', ''), index)}
                    />
                  </View>
                </View>
              </View>
              <View style={{ margin: 10 }}>
                {
                  !link.isLoading &&
                        <Icon onPress={() => this.handleDelete(index)} name='delete' type="MaterialCommunityIcons" />
                }
              </View>
            </View>
        );
      });

      return (
        <ContainerWithLoading style={theme.container} isLoading={_findIndex(this.state.links, { isLoading: true }) == -1 && this.props.isLoading}>
          <Header style={{ backgroundColor: '#ff585d', borderBottomWidth: 0 }} androidStatusBarColor='#ff585d'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.otherRepairReqTitle}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            {/* <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            {
                                list.map((l, i) => (
                                <ListItem
                                    key={i}
                                    onPress={()=>this.handleOption(l)}
                                >
                                    <Left>
                                        <Text>{l.name}</Text>
                                    </Left>
                                    <Right>
                                        <Radio selected={ l.name == selectedOption } />
                                    </Right>
                                </ListItem>
                                ))
                            }
                        </View>
                    </View> */}
            {this.renderContent(strings)}
            <View style={{ flex: 1, paddingTop: 15 }}>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                  <CustomText>{`${strings.notesLabel}`}</CustomText>
                </View>
                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                  <TextInput
                    style={{ height: 135, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                    onChangeText={value => this.handleNotes(value)}
                    multiline={true}
                    maxLength={1200}
                    value={_get(this, 'state.notes', '').toString()}
                    underlineColorAndroid={'transparent'}
                    keyboardType={'default'}
                  />
                  <TextToSpeech
                    handleTextToSpeech={e => this.handleTextToSpeech(e, 'notes')}
                  />
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                  <CustomText>{`${notes.length}/1200`}</CustomText>
                </View>
              </View>
            </View>
          </Content>
          <View style={{ backgroundColor: '#ededed' }}>
            <Button style={[theme.buttonNormal, { backgroundColor: '#ff585d' }]} onPress={() => this.onSave()} full>
              <CustomBoldText style={theme.butttonFixTxt}>{`${strings.confirmText}`}</CustomBoldText>
            </Button>
          </View>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { commonReducer } = state || {};
  const { userDetails } = commonReducer || {};
  // console.log('user details in ticket', userDetails);
  const isLoading = commonReducer.isFetching || false;

  return {
    decodedToken,
    userDetails,
    isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
  };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(OtherTicketScreen)));
