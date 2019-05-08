import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, TouchableHighlight, Image } from 'react-native';
import _get from 'lodash/get';
// import Input from 'react-native-elements';
import { showToast, chooseImage } from '../../utils/index';
import cameraIcon from '../../assets/images/cameraIcon.png';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import { postData } from '../../actions/commonAction';

import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import CustomText from '../stateless/CustomText';
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, ListItem, Left, Right, Icon, Radio } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import Geolocation from 'react-native-geolocation-service';
import CustomBoldText from '../stateless/CustomBoldText';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import pdfIcon from '../../assets/images/pdficon.png';

const ContainerWithLoading = withLoadingScreen(Container);
const ImageWithLoading = withLoadingScreen(Image);


const list = [
    {
      name: 'Engine Related',
      avatar_url: '',
      subtitle: '',
    },
    {
      name: 'Hydraulics Issues',
      avatar_url: '',
      subtitle: '',
    },
    {
        name: 'Other......',
        avatar_url: '',
        subtitle: '',
      },
  ];

class OtherTicketScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            notes: '',
            imageSource: '',
            links: [],
            uploadedLinks: [],
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
    handleComments = (value, index) => {
        let links = _cloneDeep(this.state.links);
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
                { text: 'Select Image', onPress: () => this.uploadImage(title) },
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
        let links = _cloneDeep(this.state.links);
        let imageData = {
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
        formData.append('file', { uri, type: mimeType, fileName });
        if (uri && !_isEmpty(uri)) {
            // console.log('data to be upload', formData);
            this.uploadData(formData, uri);
        }
    }
    uploadImage = () => {
        // showAlert('This is for upload image', '');
        chooseImage('service pic')
        .then((data) => {
            const { uri, name, mimeType } = data || {};
            let links = _cloneDeep(this.state.links);
            let imageData = {
                imageSource: uri,
                fileName: name,
                isLoading: true,
            };
            links.push(imageData);
            this.setState({
                imageSource: uri,
                fileName: name,
                uploadingFile: true,
                links,
            });
            const formData = new FormData();
            formData.append('file', { uri, type: mimeType, name });
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
                let links = _cloneDeep(this.state.links);
                let imgIndex = _findIndex(links, { imageSource: uri });
                if (imgIndex != -1) {
                    links[imgIndex].isLoading = false;
                    links[imgIndex].linkUrl = data.url;
                }
                let uploadedLinks = _cloneDeep(this.state.uploadedLinks) || [];
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
    onSave = () => {
        let title= 'Submission Confirmition';
        let message = 'Your Information is being submitted. Please select "Confirm" otherwise select "Go Back"...';
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
            Alert.alert(
                `${title}`,
                `${message}`,
                [
                    { text: 'Go Back', onPress: () => {} },
                    { text: 'Confirm', onPress: () => this.handleSave() },
                ],
                { cancelable: false }
            );
        }
    }
    handleSave = () => {
        let attachments = [];
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
            let url = `/Ticket/Add`;
            let constants = {
                init: 'SAVE_TICKET_DATA_INIT',
                success: 'SAVE_TICKET_DATA_SUCCESS',
                error: 'SAVE_TICKET_DATA_ERROR',
            };
            let identifier = 'SAVE_TICKET_DATA';
            let key = 'savedTicketData';
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
    handleOption = (item) => {
        this.setState({
            selectedOption: item.name,
        });
    }
    handleDelete = (index) => {
        let { links } = this.state || [];
        links.splice(index, 1);
        this.setState({
            links,
        });
    }

    render() {
        const { selectedOption, notes } = this.state;
        const { strings } = this.props;
        let images = [];
        !_isEmpty(_get(this.state, 'links', [])) && _get(this.state, 'links', []).map((link, index) => {
            console.log('link in loop', link, 'uploaded links', this.state.uploadedLinks);
            images.push(
                <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
                    {
                        <ImageWithLoading isLoading={link.isLoading} source={!link.isPdf ? { uri: link.imageSource }: pdfIcon} style={{ width: 100, height: 100 }} />
                    }
                    <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            {/* <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <Text>Comments: </Text>
                            </View> */}
                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
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
                                    maxLength={120}
                                    value={_get(this, 'state.notes', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <CustomText>{`${notes.length}/120`}</CustomText>
                            </View>
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
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ededed' }}>
                    <Button style={[theme.buttonNormal, {backgroundColor: '#ff585d'}]} onPress={() => this.onSave()} full>
                        <CustomBoldText style={theme.butttonFixTxt}>{`${strings.confirmText}`}</CustomBoldText>
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
    // console.log('user details in ticket', userDetails);
    let isLoading = commonReducer.isFetching || false;

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
