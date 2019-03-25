import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, TextInput, Platform } from 'react-native';
import mileageImg from '../../assets/images/mileage.png';
// import Input from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import { showAlert, showToast } from '../../utils/index';
import strings from '../../utils/localization';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { uploadDoc } from '../../actions/signup';
import { postData } from '../../actions/commonAction';
import ImageResizer from 'react-native-image-resizer';


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
        ImageResizer.createResizedImage(uri, 200, 600, 'JPEG', 80).then((response) => {
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
        let data = {
            id: _get(this.props, 'userDetails.checkedInto.id', ''),
        };
        let identifier = 'UPLOAD_DOCUMENTS';
        let key = 'uploadedDocuments';
        this.props.postData(url, formData, constants, identifier, key)
            .then((data) => {
                console.log('documents uploaded successfully.', data);
                this.setState({
                    link: data.url,
                });
                showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
            }, (err) => {
                console.log('error while uploading documents', err);
            });
    }
    setMileage = (value) => {
        this.setState({
            mileage: value,
        });
    }
    onSave = () => {
        if (this.state.link =='') {
            showAlert('Warning', 'Please select document to proceed.');
        } else {
            let data = {};
            // let assetUsage = {
            //     usage: parseFloat(this.state.mileage),
            //     uom: _get(this.props, 'userDetails.checkedInto.usage.uom', ''),
            // }
            data = {
                assetId: _get(this.props, 'userDetails.checkedInto.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                documentType: 5,
                status: 1,
                link: this.state.link,
            }
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
                showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
                this.props.navigation.navigate('UploadDocsHomeScreen');
            }, (err) => {
                console.log('error while saving mileage', err);
            });
    }
    render() {
        const { strings } = this.props;
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >{`${strings.mileageButton}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { marginTop: 25 }]}>
                            <TouchableHighlight
                                style={[styles.profileImgContainer, { borderColor: 'green', borderWidth: 1 }]}
                            >
                                <Image source={mileageImg} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>{`${strings.mileageButton}`}</Text>
                            </View>
                        </View>
                        {/* <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                    <Text>{`${strings.mileageLabel}`}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                    <TextInput
                                        style={{ height: 35, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                        onChangeText={value => this.setMileage(value)}
                                        value={_get(this, 'state.mileage', '').toString()}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            </View>
                        </View> */}
                        <TouchableHighlight onPress={() => this.uploadImage()}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', backgroundColor: '#ddd', margin: 20 }]}>
                                <View style={{ flex: 1 }}>
                                    <Text>{`${strings.odometerHelperText}`}</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name='ios-camera' />
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 1, marginLeft: 20, flexDirection: 'row' }}>
                        {
                            this.state.imageSource && this.state.imageSource != '' &&
                            <Image source={{ uri: this.state.imageSource }} style={{ width: 100, height: 100 }} />
                        }
                        <View style={{ margin: 10 }}>
                            <Text style={{ flexWrap: 'wrap' }}>{this.state.fileName}</Text>
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.onSave()} full>
                        <Text style={theme.butttonFixTxt}>{`${strings.saveButton}`}</Text>
                    </Button>
                </View>
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
        languageDetails
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
      height: 120,
      width: 120,
      borderRadius: 40,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(UpdateMileageHomeScreen)));
