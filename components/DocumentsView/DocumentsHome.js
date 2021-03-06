import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, RefreshControl, Platform, ActivityIndicator } from 'react-native';
import documentsImg from '../../assets/images/active-icons/document-active.png';
import pdfIcon from '../../assets/images/pdficon.png';
// import Input from 'react-native-elements';
import { ListItem, Card, Image } from 'react-native-elements';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';


import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { postData } from '../../actions/commonAction';
import { showToast } from '../../utils';
import withLocalization from '../hocs/withLocalization';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import CustomText from '../stateless/CustomText';

const ContainerWithLoading = withLoadingScreen(Container);

const options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class DocumentsHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: '',
      expense: '',
      links: [],
      value: {},
    };
  }
    static navigationOptions = {
      header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {
      this.loadAssetDocuments();
    }
    loadAssetDocuments = () => {
      const url = `/Assets/GetMandatoryDocuments`;
      const constants = {
        init: 'GET_ASSET_DOCUMENTS_INIT',
        success: 'GET_ASSET_DOCUMENTS_SUCCESS',
        error: 'GET_ASSET_DOCUMENTS_ERROR',
      };
      const data = {
        id: _get(this.props, 'userDetails.clockedInto.id', ''),
      };
      const identifier = 'GET_ASSET_DOCUMENTS';
      const key = 'assetDocuments';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('asset documents fetched successfully.');
            showToast('success', `${this.props.strings.docFetchSuccessMsg}.`, 3000);
          }, (err) => {
            console.log('error while fetching asset documents', err);
          });
    }
    handleDocumentItem = (item, index) => {
      this.setState({
        selectedIndex: index,
      });
    }
    _onRefresh = () => {
      this.loadAssetDocuments();
    }
    getLocalPath = (url) => {
      const filename = url.split('/').pop();
      // feel free to change main path according to your requirements
      return `${RNFS.DocumentDirectoryPath}/${filename}`;
    }
    handleFileClick = (item) => {
      const localFile = this.getLocalPath(item.link);

      const options = {
        fromUrl: item.link,
        toFile: localFile,
      };
      this.setState({
        loadingFile: true,
      });
      RNFS.downloadFile(options).promise
          .then(() => {
            this.setState({
              loadingFile: false,
            });
            FileViewer.open(localFile)
                .then(() => {
                  // success
                  console.log('opening file');
                })
                .catch((error) => {
                  // error
                  console.log('error in opening file', error);
                });
          })
          .catch((error) => {
            // error
            this.setState({
              loadingFile: false,
            });
            console.log('error in downloading file', error);
          });
      // if (item.link.indexOf('pdf') !==-1) {
      //   this.props.navigation.navigate('PdfViewScreen', { uri: item.link });
      // } else {
      //   this.props.navigation.navigate('ImageViewScreen', { uri: item.link });
      // }
    }
    handleDocumentUpload = () => {
      this.props.navigation.navigate('ExpenseReportHomeScreen');
      // this.uploadImage();
    }
    uploadImage = () => {
      // showAlert('This is for upload image', '');
      this.chooseImage('Expense Pic');
    }

    chooseImage = (title) => {
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          response.title = title;
          response.owner = 'operator';
          if (Platform.OS == 'ios') {
            //    fileName = 'Image'+ new Date().toString() + '.jpg';
            const strs = response.uri.split('/');
            response.fileName = strs[strs.length - 1];
            response.type = 'image/jpeg';
          }
          this.setFile(response);
        }
      });
    }
    setFile = (res) => {
      const { uri, type: mimeType, fileName } = res || {};
      ImageResizer.createResizedImage(uri, 1024, 1024, 'JPEG', 99).then((response) => {
        const { uri, name } = response || {};
        this.setState({
          imageSource: uri,
          fileName: name,
          uploadingFile: true,
        });
        const formData = new FormData();
        formData.append('file', { uri, type: mimeType, name });
        if (uri && !_isEmpty(uri)) {
          console.log('data to be upload', formData);
          this.uploadData(formData);
        }
      }).catch((err) => {
        console.log('error while resizing image', err);
      });
    }

    uploadData = (formData) => {
      const url = `/Upload/File`;
      const constants = {
        init: 'UPLOAD_DOCUMENTS_INIT',
        success: 'UPLOAD_DOCUMENTS_SUCCESS',
        error: 'UPLOAD_DOCUMENTS_ERROR',
      };
      // let data = {
      //   id: _get(this.props, 'userDetails.clockedInto.id', ''),
      // };
      const identifier = 'UPLOAD_DOCUMENTS';
      const key = 'uploadedDocuments';
      this.props.postData(url, formData, constants, identifier, key)
          .then((data) => {
            console.log('documents uploaded successfully.');
            const links = _cloneDeep(this.state.links);
            const uploadedLinks = _cloneDeep(this.state.uploadedLinks) || [];
            const imageData = {
              imageSource: this.state.imageSource,
              fileName: this.state.fileName,
            };
            links.push(imageData);
            uploadedLinks.push(data.url);

            this.setState({
              links,
              uploadedLinks,
            });
            showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
          }, (err) => {
            console.log('error while uploading documents', err);
          });
    }

    render() {
      const { assetDocuments, strings } = this.props;
      // console.log('asset documents', assetDocuments);
      const { selectedIndex, loadingFile } = this.state;
      const images = [];
      !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link, index) => {
        images.push(
            <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
              {
                link.imageSource && link.imageSource != '' &&
                        <Image PlaceholderContent={<ActivityIndicator />} source={{ uri: link.imageSource }} style={{ width: 100, height: 100 }} />
              }
              <View style={{ margin: 10 }}>
                <CustomText style={{ flexWrap: 'wrap' }}>{link.fileName}</CustomText>
              </View>
              <View style={{ margin: 10 }}>
                {
                  link.imageSource && link.imageSource != '' &&
                        <Icon onPress={() => this.handleDelete(index)} name='delete' type="MaterialCommunityIcons" />
                }
              </View>
            </View>
        );
      });
      return (
        <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading || loadingFile}>
          <Header translucent={false} style={{ backgroundColor: '#059312', borderBottomWidth: 0 }} androidStatusBarColor="#059312">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.documentButton}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this._onRefresh}
              />
            }
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={[theme.centerAlign, { backgroundColor: '#059312', paddingBottom: 30 }]}>
                <Image source={documentsImg} style={styles.profileImg} />
              </View>
              <View style={{ flex: 1, paddingTop: 15 }}>
                <View style={{ flex: 1 }}>
                  {
                    assetDocuments && assetDocuments.map((l, i) => (
                      <React.Fragment key={i}>
                        <ListItem
                          key={i}
                          // rightIcon={{ name: 'camera', type: 'font-awesome' }}
                          title={
                            l.documentType.label
                            // getDocumentType(l.documentType.value, strings)
                          }
                          titleStyle={{ fontFamily: 'Montserrat-Regular' }}
                          subtitle={l.subtitle}
                          onPress={()=>this.handleDocumentItem(l, i)}
                        />
                        {
                          selectedIndex === i &&
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                      <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                        onPress={() => this.handleFileClick(l)} >
                                        <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0 }} containerStyle={{ flex: 1, margin: 0 }}>
                                          <Image PlaceholderContent={<ActivityIndicator />} source={ l.link.indexOf('pdf') !==-1 ? pdfIcon: { uri: l.link }} style={{ width: 110, height: 109 }} />
                                        </Card>
                                      </TouchableOpacity>
                                    </View>
                        }
                      </React.Fragment>
                    ))
                  }
                  <ListItem
                    rightIcon={{ name: 'camera', type: 'font-awesome' }}
                    title={`${strings.uploadInvoiceTitle}`}
                    titleStyle={{ fontFamily: 'Montserrat-Regular' }}
                    // subtitle={l.subtitle}
                    onPress={()=>this.handleDocumentUpload()}
                  />
                </View>
              </View>
            </View>
            {
              images
            }
          </Content>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { commonReducer } = state || {};
  const { userDetails } = commonReducer || {};
  const { appLanguage, languageDetails } = commonReducer || 'en';
  const { assetDocuments } = commonReducer || [];

  return {
    decodedToken,
    userDetails,
    assetDocuments,
    appLanguage,
    languageDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
  };
}

const styles = StyleSheet.create({
  profileImg: {
    width: 80,
    height: 67,
  },
});

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(DocumentsHomeScreen)));
