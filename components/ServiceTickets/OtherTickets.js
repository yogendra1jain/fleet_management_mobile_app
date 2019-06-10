import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image } from 'react-native';
import _get from 'lodash/get';
import { CheckBox } from 'react-native-elements';
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
      majorService: false,
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
        this.props.navigation.navigate('NewTicketScreen', { notes: this.state.notes, majorService: this.state.majorService });
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
      const { userDetails, decodedToken } = this.props;
      const assetListView = [];
      // const role = _get(decodedToken, 'FleetUser.role', 0);
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
    handleCheckbox = () => {
      this.setState({
        majorService: !this.state.majorService,
      });
    }

    render() {
      const { notes } = this.state;
      const { strings } = this.props;
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
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>{`Major Service`}</Text>
                <CheckBox
                  iconRight={true}
                  right={true}
                  containerStyle={{ backgroundColor: '#ededed' }}
                  checked={_get(this, 'state.majorService', false)}
                  onPress={() => this.handleCheckbox()}
                />
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
