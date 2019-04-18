import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Platform, Keyboard } from 'react-native';
// import expenseImg from '../../assets/images/expense.png';
import documentsImg from '../../assets/images/active-icons/document-active.png';
import ImagePicker from 'react-native-image-picker';
import cameraIcon from '../../assets/images/cameraIcon.png';

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import { showAlert, showToast } from '../../utils/index';
import t from 'tcomb-form-native';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { uploadDoc } from '../../actions/signup';
import { postData } from '../../actions/commonAction';
import ImageResizer from 'react-native-image-resizer';
import CustomText from '../stateless/CustomText';


const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

const options = {
    title: 'Select Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


const ValidExpense = t.refinement(t.Number, (n) => {
    if (n) {
        return n > 0;
    }
});

class ExpenseReportHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.sameExpense = t.refinement(t.String, (s) => {
            return s == this.state.value.expense;
        });
        this.state = {
            expense: '',
            links: [],
            value: {},
        };
        this.ExpenseStruct = t.struct({
            expense: ValidExpense,
            confirmExpense: this.sameExpense,
        });
        this.validate = null;
        this.stylesheet = _cloneDeep(stylesheet);
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
                console.log('documents uploaded successfully.');
                let links = _cloneDeep(this.state.links);
                let uploadedLinks = _cloneDeep(this.state.uploadedLinks) || [];
                let imageData = {
                    imageSource: this.state.imageSource,
                    fileName: this.state.fileName,
                };
                links.push(imageData);
                uploadedLinks.push(data.url);

                this.setState({
                    links,
                    uploadedLinks,
                });
                // showToast('success', `${this.props.strings.uploadSuccessMsg}`, 3000);
            }, (err) => {
                console.log('error while uploading documents', err);
            });
    }
    handleDelete = (index) => {
        let { links } = this.state || [];
        links.splice(index, 1);
        this.setState({
            links,
        });
    }
    handleNextPage = () => {
        this.props.navigation.navigate('ExpenseReportInput', { links: this.state.uploadedLinks });
    }


    render() {
        const { strings } = this.props;
        let images = [];
        !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link, index) => {
            images.push(
                <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
                    {
                        link.imageSource && link.imageSource != '' &&
                        <Image source={{ uri: link.imageSource }} style={{ width: 100, height: 100 }} />
                    }
                    <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                        <Text style={{ flexWrap: 'wrap' }}>{link.fileName}</Text>
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
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading || this.state.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#059312', borderBottomWidth: 0 }} androidStatusBarColor='#059312'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.expenseReportTitle}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#059312', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={documentsImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight onPress={() => this.uploadImage()}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', margin: 20 }]}>
                                <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', margin: 20 }]}>
                                    <View style={{ flex: 1, marginBottom: 15 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{`${strings.goToCamera}`}</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={cameraIcon} style={{ width: 100, height: 101 }} />
                                        {/* <Icon name='ios-camera' /> */}
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    {
                        _get(this.state, 'links.length', 0) == 0 &&
                        <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                            <View style={{ justifyContent: 'flex-start', paddingRight: 5 }}>
                                <Icon name='exclamation' style={{ color: '#f6a800' }} type="FontAwesome" />
                            </View>
                            <View style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#f6a800', flexWrap: 'wrap' }}>
                                <CustomText style={{ fontSize: 13 }}>
                                    {`${strings.expenseHelperText}`}
                                </CustomText>
                            </View>
                        </View>
                    }
                    {
                        images
                    }
                </Content>
                <View style={{ backgroundColor: '#ededed' }}>
                    <Button style={[theme.buttonNormal, { backgroundColor: _get(this.state, 'links.length', 0) == 0 ? '#ddd': '#059312' }]} onPress={() => 
                        _get(this.state, 'links.length', 0) == 0 ? {}:
                         this.handleNextPage()} full>
                        <Text style={theme.butttonFixTxt}>{`${strings.nextText}`}</Text>
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
        width: 80,
        height: 67,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ExpenseReportHomeScreen)));
