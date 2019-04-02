import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Platform, TextInput } from 'react-native';
import gasfillImg from '../../assets/images/ios/gas-fillups.png';
// import Input from 'react-native-elements';
import _isEmpty from 'lodash/isEmpty';
import ImagePicker from 'react-native-image-picker';

import _get from 'lodash/get';
import _set from 'lodash/set';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { showToast } from '../../utils';
import strings from '../../utils/localization';

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

class GasFilUpHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: '',
            fileName: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {
        // this.getCurrentLocation();
    }
    handleDocumentItem = (item) => {
        console.log('item', item);
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
    getCurrentLocation = () => {
        this.setState({
            isLoading: true,
        });
        navigator.geolocation.getCurrentPosition(
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
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
    }
    onSave = () => {
        if (this.state.link =='') {
            showAlert('Warning', 'Please select file to proceed.');
        } else {
            let amount = {};
            _set(amount, 'amount', parseFloat(this.state.amount));
            _set(amount, 'currency', '$');

            let volume = {
                volume: parseFloat(this.state.volume),
                uom: 1,
                amount: amount,
            }
           
            let data = {
                assetId: _get(this.props, 'userDetails.checkedInto.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                documentType: 6,
                status: 1,
                link: this.state.link,
                coordinate: {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                },
            }
            this.savegasFillUpData(data);
        }
    }

    savegasFillUpData = (data) => {
        let url = `/UnActionedDocument/Add`;
        let constants = {
            init: 'SAVE_GASFILLUP_DATA_INIT',
            success: 'SAVE_GASFILLUP_DATA_SUCCESS',
            error: 'SAVE_GASFILLUP_DATA_ERROR',
        };
        let identifier = 'SAVE_GASFILLUP_DATA';
        let key = 'savedgasFillUpData';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('gasfill saved successfully.', data);
                showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
                this.props.navigation.navigate('Home');
            }, (err) => {
                console.log('error while saving gas fillup', err);
            });
    }
    setValue = (name, value) => {
        this.setState({
            [name]: value,
        });
    }

    render() {
        const { strings } = this.props;
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading || this.state.isLoading}>
                <Header style={{backgroundColor: '#00A9E0'}} androidStatusBarColor='#00A9E0' >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >{`${strings.gasFillUpTitle}`}</Title>
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
                                style={[]}
                            >
                                <Image source={gasfillImg} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>{`${strings.gasFillUpTitle}`}</Text>
                            </View>
                        </View>
                        {/* <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                    <Text>{`${strings.volumeLabel}`}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                    <TextInput
                                        style={{ height: 35, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                        onChangeText={value => this.setValue('volume', value)}
                                        value={_get(this, 'state.volume', '').toString()}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            </View>
                        </View> */}
                        {/* <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                    <Text>{`${strings.amountLabel}`}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                    <TextInput
                                        style={{ height: 35, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                        onChangeText={value => this.setValue('amount', value)}
                                        value={_get(this, 'state.amount', '').toString()}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={'numeric'}
                                    />
                                </View>
                            </View>
                        </View> */}
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <TouchableHighlight onPress={() => this.uploadImage()}>
                                <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', backgroundColor: '#ddd', margin: 20 }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text>{`${strings.goToCamera}`}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name='ios-camera' />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                        
                        <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                            <View style={{ justifyContent: 'flex-start' }}>
                                <Icon name='exclamation' type="FontAwesome" />
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#ddd', borderWidth: 1, flexWrap: 'wrap' }}>
                                <Text>
                                    {`${strings.gasHelperText}`}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 20, flexDirection: 'row' }}>
                            {
                                this.state.imageSource !== '' &&
                                <Image source={{ uri: this.state.imageSource  }} style={{ width: 100, height: 100 }} />
                            }
                            <View style={{ margin: 10 }}>
                                <Text style={{ flexWrap: 'wrap' }}>{this.state.fileName}</Text>
                            </View>
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ffffff' }}>
                    <Button style={theme.buttonNormal} onPress={() => this.getCurrentLocation()} full>
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
    let { isLoading } = commonReducer || false;
    let { appLanguage, languageDetails } = commonReducer || 'en';

    return {
        decodedToken,
        userDetails,
        appLanguage,
        languageDetails,
        isLoading
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
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(GasFilUpHomeScreen)));
