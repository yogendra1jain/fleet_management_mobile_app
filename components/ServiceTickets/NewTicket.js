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
// import { ListItem } from 'react-native-elements';
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
const ContainerWithLoading = withLoadingScreen(Container);
const ImageWithLoading = withLoadingScreen(Image);

class NewTicketScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      notes: props.navigation.getParam('notes', ''),
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
            comment: link.comments,
          });
        });
        let data = {};
        data = {
          assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
          userId: _get(this.props, 'userDetails.user.id', ''),
          clientId: _get(this.props, 'userDetails.clockedInto.clientId', ''),
          description: this.state.notes,
          type: 1,
          attachments: attachments,
        };
        const url = `/Ticket/Add`;
        const constants = {
          init: 'SAVE_TICKET_DATA_INIT',
          success: 'SAVE_TICKET_DATA_SUCCESS',
          error: 'SAVE_TICKET_DATA_ERROR',
        };
        const identifier = 'SAVE_TICKET_DATA';
        const key = 'savedTicketData';
        console.log('data ', data);
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
              console.log('ticket saved successfully.', data);
              this.setState({
                isSaved: true,
              });
              showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
              // setTimeout(() => {
              this.props.navigation.navigate('ServiceTicketHome');
              // }, 2000);
            }, (err) => {
              console.log('error while saving mileage', err);
            });
      }

    handleDelete = (index) => {
      const { links } = this.state || [];
      links.splice(index, 1);
      this.setState({
        links,
      });
    }

    render() {
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
                      style={{ height: 70, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
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
              <Title style={{ color: '#fff' }} >Service Ticket</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            {/* <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
              <TouchableHighlight onPress={() => {}} style={{ flex: 1, paddingLeft: 15, justifyContent: 'flex-start' }}>
                <View>
                  <Image source={truckImg} style={{ width: 100, height: 100, backgroundColor: 'transparent' }} />
                  <View style={{ flexWrap: 'wrap' }}>
                    <Text>Asset Details</Text>
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={{ paddingRight: 15, justifyContent: 'flex-end' }}>
                <View>
                  <Image source={assetLocation} style={{ width: 100, height: 100 }} />
                  <View style={{ flexWrap: 'wrap' }}>
                    <Text>Asset Location </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View> */}
            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'row', margin: 20 }]}>
              <Text style={{ marginLeft: 10 }}>Select From</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: '#ff585d', borderRadius: 0, height: 55 }]} onPress={() => {}} full>
                <Text style={theme.butttonFixTxt}>Preventive Maintenance</Text>
              </Button>
              <Button full style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: '#ff585d', borderRadius: 0, height: 55 }]} onPress={() => {}}>
                <Text style={theme.butttonFixTxt}>Other Repair Request</Text>
              </Button>
            </View>
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(NewTicketScreen)));
