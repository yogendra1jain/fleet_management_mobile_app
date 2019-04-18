import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Platform } from 'react-native';
import mileageImg from '../../assets/images/active-icons/mileage-active.png';
// import Input from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import cameraIcon from '../../assets/images/cameraIcon.png';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { showAlert, showToast } from '../../utils/index';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { uploadDoc } from '../../actions/signup';
import { postData } from '../../actions/commonAction';
import ImageResizer from 'react-native-image-resizer';
import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import CustomText from '../stateless/CustomText';
import Geolocation from 'react-native-geolocation-service';

const ImageWithLoading = withLoadingScreen(Image);
const ContainerWithLoading = withLoadingScreen(Container);

const options = {
    title: 'Select Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class UpdateMileageHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mileage: '',
            link: '',
            imageSource: '',
            isSaved: false,
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    uploadImage = () => {
        // showAlert('This is for upload image', '');
        this.chooseImage('mileage Pic');
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
                    let strs = response.uri.split('/');
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
        let url = `/Upload/File`;
        let constants = {
            init: 'UPLOAD_DOCUMENTS_INIT',
            success: 'UPLOAD_DOCUMENTS_SUCCESS',
            error: 'UPLOAD_DOCUMENTS_ERROR',
        };
        let identifier = 'UPLOAD_DOCUMENTS';
        let key = 'uploadedDocuments';
        this.props.postData(url, formData, constants, identifier, key)
            .then((data) => {
                // console.log('documents uploaded successfully.', data);
                this.setState({
                    link: data.url,
                });
                this.getCurrentLocation();
                // showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
            }, (err) => {
                console.log('error while uploading documents', err);
            });
    }
    setMileage = (value) => {
        this.setState({
            mileage: value,
        });
    }
    getCurrentLocation = () => {
        this.setState({
            isLoading: true,
        });
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    isLoading: false,
                });
                this.onSave();
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: true },
          );
    }
    onSave = () => {
        if (this.state.link =='') {
            showAlert('Warning', 'Please select document to proceed.');
        } else {
            let data = {};
            data = {
                assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                documentType: 4,
                status: 1,
                link: this.state.link,
                coordinate: {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                },
            };
            this.saveMileageData(data);
        }
    }

    saveMileageData = (data) => {
        let url = `/UnActionedDocument/Add`;
        let constants = {
            init: 'SAVE_MILEAGE_DATA_INIT',
            success: 'SAVE_MILEAGE_DATA_SUCCESS',
            error: 'SAVE_MILEAGE_DATA_ERROR',
        };
        let identifier = 'SAVE_MILEAGE_DATA';
        let key = 'savedMileageData';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('mileage saved successfully.', data);
                this.setState({
                    isSaved: true,
                });
                showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
                setTimeout(() => {
                    this.props.navigation.navigate('Home');
                }, 2000);
            }, (err) => {
                console.log('error while saving mileage', err);
            });
    }
    handleDelete = (index) => {
        this.setState({
            link: '',
            imageSource: '',
        });
    }

    render() {
        const { strings } = this.props;
        return (
            <ContainerWithLoading style={theme.container} >
                <Header translucent={false} style={{ backgroundColor: '#bb29bb', borderBottomWidth: 0 }} androidStatusBarColor="#bb29bb">
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.mileageButton}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#bb29bb', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={mileageImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight onPress={() => this.uploadImage()}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', margin: 20 }]}>
                                <View style={{ flex: 1, marginBottom: 15 }}>
                                    <CustomSemiBoldText style={{ fontSize: 20, color: 'black' }}>{`${strings.goToCamera}`}</CustomSemiBoldText>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={cameraIcon} style={{ width: 100, height: 101 }} />
                                    {/* <Icon name='ios-camera' /> */}
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {
                            this.state.imageSource == '' &&
                            <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                                <View style={{ justifyContent: 'flex-start', paddingRight: 5 }}>
                                    <Icon name='exclamation' style={{ color: '#f6a800' }} type="FontAwesome" />
                                </View>
                                <View style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#f6a800', flexWrap: 'wrap' }}>
                                    <CustomText style={{ fontSize: 13 }}>
                                        {`${strings.mileageHelperText}`}
                                    </CustomText>
                                </View>
                            </View>
                        }
                    {
                        this.state.imageSource !== '' ?
                        <View style={{ flex: 1, marginLeft: 20, flexDirection: 'row' }}>
                            <ImageWithLoading isLoading={this.props.isLoading || this.state.isLoading} source={{ uri: this.state.imageSource }} style={{ width: 100, height: 100 }} />
                            <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                                <CustomText style={{ flexWrap: 'wrap' }}>{this.state.fileName}</CustomText>
                            </View>
                            <View style={{ margin: 10 }}>
                                {
                                    this.state.isSaved ?
                                    <Icon style={{ color: 'green' }} name='ios-checkmark-circle' type="Ionicons" />
                                    :<Text></Text>
                                }
                                {/* <Icon onPress={() => this.handleDelete()} name='circle-with-cross' type="Entypo" /> */}
                            </View>
                        </View>
                        :
                        <Text></Text>
                    }
                </Content>
                {/* <View style={{ backgroundColor: '#ededed' }}>
                    <Button style={[theme.buttonNormal, { backgroundColor: this.state.link == ''? '#ddd': '#bb29bb' }]} onPress={() => this.state.link == ''? {}: this.getCurrentLocation()} full>
                        <Text style={theme.butttonFixTxt}>{`${strings.saveButton}`}</Text>
                    </Button>
                </View> */}
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    // console.log('user details', userDetails);
    let isLoading = commonReducer.isFetching || false;
    let { appLanguage, languageDetails } = commonReducer || 'en';

    return {
        decodedToken,
        userDetails,
        isLoading,
        appLanguage,
        languageDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
        uploadDoc: (formData, doc) => dispatch(uploadDoc(formData, doc)),
    };
}

const styles = StyleSheet.create({
    profileImgContainer: {
      marginLeft: 8,
      height: 120,
      width: 120,
      borderRadius: 40,
      borderWidth: 1,
    },
    profileImg: {
      height: 73,
      width: 80,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(UpdateMileageHomeScreen)));
