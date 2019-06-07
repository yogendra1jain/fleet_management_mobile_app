import React from 'react';
import { connect } from 'react-redux';
import { View, Image, TouchableHighlight, Alert, TextInput } from 'react-native';
// import truckImg from '../../assets/images/truckImg.png';
// import assetLocation from '../../assets/images/assetLocation.png';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
// import Input from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { showToast, chooseImage } from '../../utils/index';
import { postData } from '../../actions/commonAction';
import cameraIcon from '../../assets/images/cameraIcon.png';

import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import CustomBoldText from '../stateless/CustomBoldText';
// import CustomText from '../stateless/CustomText';

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import pdfIcon from '../../assets/images/pdficon.png';
import videoIcon from '../../assets/images/videoIcon.png';
import TextToSpeech from '../stateless/SpeechToText';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import BusinessCardView from '../stateless/BusinessCardView';
const ContainerWithLoading = withLoadingScreen(Container);
const ImageWithLoading = withLoadingScreen(Image);

class TaskAttachmentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      selectedIndex: '',
      prevStateData: props.navigation.getParam('stateData', {}),
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
      this.loadServiceProviders();
    }
      loadServiceProviders = () => {
        let data = {};
        data = {
          userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
          clientId: _get(this.props, 'decodedToken.Client.id', ''),
          text: '',
          limit: 100,
          offset: 0,
        };
        const url = `/BusinessCard/Search`;
        const constants = {
          init: 'GET_BUSINESS_CARDS_INIT',
          success: 'GET_BUSINESS_CARDS_SUCCESS',
          error: 'GET_BUSINESS_CARDS_ERROR',
        };
        const identifier = 'GET_BUSINESS_CARDS';
        const key = 'businessCards';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
              console.log('business cards fetched successfully.');
            }, (err) => {
              console.log('error while cancelling Ticket', err);
            });
      }

    handleComments = (value, index) => {
      const links = _cloneDeep(this.state.links);
      links[index].comments = value;
      this.setState({
        links,
      });
    }

    chooseSelectFileMethod = (title) => {
      Alert.alert(
          'Select File',
          `Please Select which file you want to select.`,
          [
            { text: 'Select PDF', onPress: () => this.chooseFile(title) },
            { text: 'Select Image', onPress: () => this.uploadImage('photo') },
            { text: 'Select Video', onPress: () => this.uploadImage('video') },
            { text: 'Cancel', onPress: () => { } },
          ],
          { cancelable: true }
      );
    }
      chooseFile = (title) => {
        if (DocumentPicker && DocumentPicker.show) {
          DocumentPicker.show({
            filetype: [DocumentPickerUtil.pdf()],
          }, (error, res) => {
            // Android
            if (!error) {
              res.title = title;
              res.owner = 'doctor';
              this.setFile(res);
            }
          });
        }
      }
      setFile = (res) => {
        const { uri, type: mimeType, fileName } = res || {};
        const links = _cloneDeep(this.state.links);
        const imageData = {
          imageSource: uri,
          fileName: fileName,
          isLoading: true,
          isPdf: true,
        };
        links.push(imageData);
        this.setState({
          imageSource: uri,
          fileName: fileName,
          uploadingFile: true,
          links,
        });
        const formData = new FormData();
        formData.append('file', { uri, type: mimeType, name: fileName });
        if (uri && !_isEmpty(uri)) {
          // console.log('data to be upload', formData);
          this.uploadData(formData, uri);
        }
      }
      uploadImage = (mediaType) => {
        // showAlert('This is for upload image', '');
        chooseImage(mediaType)
            .then((data) => {
              const { uri, name, mimeType } = data || {};
              const links = _cloneDeep(this.state.links);
              const imageData = {
                imageSource: uri,
                fileName: name,
                isLoading: true,
                isVideo: mediaType=='video'? true: false,
              };
              links.push(imageData);
              this.setState({
                imageSource: uri,
                fileName: name,
                uploadingFile: true,
                links,
              });
              const formData = new FormData();
              if (mediaType == 'photo') {
                formData.append('file', { uri, type: mimeType, name });
              } else {
                formData.append('file', { uri, type: 'video/MP4', name: `${(new Date().getTime())}.MP4` });
              }
              if (uri && !_isEmpty(uri)) {
                // console.log('data to be upload', formData);
                this.uploadData(formData, uri);
              }
              // console.log('documents uploaded successfully.', data);
              // showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
            }, (err) => {
            });
      }
      uploadData = (formData, uri) => {
        const url = `/Upload/File`;
        const constants = {
          init: 'UPLOAD_DOCUMENTS_INIT',
          success: 'UPLOAD_DOCUMENTS_SUCCESS',
          error: 'UPLOAD_DOCUMENTS_ERROR',
        };
        const identifier = 'UPLOAD_DOCUMENTS';
        const key = 'uploadedDocuments';
        this.props.postData(url, formData, constants, identifier, key)
            .then((data) => {
              const links = _cloneDeep(this.state.links);
              const imgIndex = _findIndex(links, { imageSource: uri });
              if (imgIndex != -1) {
                links[imgIndex].isLoading = false;
                links[imgIndex].linkUrl = data.url;
              }
              const uploadedLinks = _cloneDeep(this.state.uploadedLinks) || [];
              uploadedLinks.push(data.url);
              // console.log('uploaded urls', uploadedLinks);

              this.setState({
                uploadedLinks,
                links,
              });
              // console.log('documents uploaded successfully.', data);
              // this.getCurrentLocation();
              // showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
            }, (err) => {
              console.log('error while uploading documents', err);
            });
      }
      handleSave = () => {
        const attachments = [];
        !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link) => {
          attachments.push({
            link: link.linkUrl,
            comment: link.comments || '',
          });
        });
        let data = {};
        console.log('state data', _get(this, 'state.prevStateData', ''));
        data = {
          assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
          userId: _get(this.props, 'userDetails.user.id', ''),
          clientId: _get(this.props, 'userDetails.clockedInto.clientId', ''),
          description: _get(this, 'state.prevStateData.description', ''),
          type: parseInt(_get(this, 'state.prevStateData.type', '')),
          attachments: attachments,
          comment: {
            comment: _get(this, 'state.prevStateData.comment', ''),
            userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
          },
          dueDate: {
            seconds: parseInt(
                _get(this, 'state.prevStateData.dueDate', new Date()).getTime() / 1000,
                10
            ),
          },
        };
        if (!_isEmpty(this.state.selectedIndex)) {
          data.destination = {
            destinationId: this.state.selectedIndex,
            type: 0,
          };
        }
        const url = `/Task/Add`;
        const constants = {
          init: 'SAVE_TASK_DATA_INIT',
          success: 'SAVE_TASK_DATA_SUCCESS',
          error: 'SAVE_TASK_DATA_ERROR',
        };
        const identifier = 'SAVE_TASK_DATA';
        const key = 'savedTaskData';
        console.log('data ', data);
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
              console.log('task saved successfully.', data);
              this.setState({
                isSaved: true,
              });
              showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
              // setTimeout(() => {
              this.props.navigation.navigate('TaskForManagerScreen');
              // }, 2000);
            }, (err) => {
              console.log('error while saving task', err);
            });
      }

    handleDelete = (index) => {
      const { links } = this.state || [];
      links.splice(index, 1);
      this.setState({
        links,
      });
    }
    handleCheckbox = () => {
      this.setState({
        showServiceProviders: !this.state.showServiceProviders,
      });
    }
    handleCardClick = (card) => {
      this.setState({
        selectedIndex: card.id,
      });
    }
    renderCards = (strings) => {
      const { businessCards } = this.props;
      const { selectedIndex } = this.state;
      const cardListView = [];
      // console.log('assets', managerAssets);
      !_isEmpty(_get(businessCards, 'cards', [])) && _get(businessCards, 'cards', []).map((cardData, index) => {
        cardListView.push(
            <BusinessCardView
              key={index}
              index={index}
              selectedIndex={selectedIndex}
              cardData={cardData}
              strings={strings}
              handleCardClick={() => this.handleCardClick(cardData, false)}
              decodedToken={this.props.decodedToken}
              userDetails={this.props.userDetails}
            />
        );
      }
      );
      return cardListView;
    }

    render() {
      const { strings } = this.props;
      const images = [];
      !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link, index) => {
        images.push(
            <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
              {
                <ImageWithLoading isLoading={link.isLoading} source={link.isVideo? videoIcon: !link.isPdf ? { uri: link.imageSource }: pdfIcon} style={{ width: 100, height: 100 }} />
              }
              <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
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
        <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
          <Header style={{ backgroundColor: '#ff585d' }} androidStatusBarColor='#ff585d'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff' }} >Task</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, paddingTop: 15 }}>
              {
                images
              }
              <TouchableHighlight onPress={() => this.chooseSelectFileMethod('service img')}>
                <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', margin: 20 }]}>
                  <View style={{ flex: 1, marginBottom: 15 }}>
                    <CustomSemiBoldText style={{ fontSize: 20, color: 'black' }}>{`${strings.goToCamera}`}</CustomSemiBoldText>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={cameraIcon} style={{ width: 100, height: 101 }} />
                  </View>
                </View>
              </TouchableHighlight>
              {
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CustomSemiBoldText style={{ textAlign: 'center', paddingLeft: 25 }}>{`Want to send to Service Provider`}</CustomSemiBoldText>
                  <CheckBox
                    iconRight={true}
                    right={true}
                    containerStyle={{ backgroundColor: '#ededed' }}
                    checked={_get(this, 'state.showServiceProviders', false)}
                    onPress={() => this.handleCheckbox()}
                  />
                </View>
              }
              {
                _get(this, 'state.showServiceProviders', false) &&
                  <View>
                    {this.renderCards(strings)}
                  </View>
              }
            </View>
          </Content>
          <View style={{ backgroundColor: '#ededed' }}>
            <Button style={[theme.buttonNormal, { backgroundColor: '#ff585d' }]} onPress={() => this.handleSave()} full>
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
  const { userDetails, businessCards } = commonReducer || {};
  // console.log('user details in ticket', userDetails);
  const isLoading = commonReducer.isFetching || false;

  return {
    decodedToken,
    userDetails,
    isLoading,
    businessCards,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
  };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(TaskAttachmentScreen)));
