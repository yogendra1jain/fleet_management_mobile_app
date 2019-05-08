import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image } from 'react-native';
import _get from 'lodash/get';
// import Input from 'react-native-elements';
import { showToast } from '../../utils/index';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import { postData } from '../../actions/commonAction';

import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import CustomText from '../stateless/CustomText';
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomBoldText from '../stateless/CustomBoldText';
import pdfIcon from '../../assets/images/pdficon.png';

const ContainerWithLoading = withLoadingScreen(Container);

class ReviewTicketScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            notes: '',
            imageSource: '',
            links: [],
            uploadedLinks: [],
            addNewComment: false,
            newComment: '',
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
    handleNotes = (value) => {
        this.setState({
            notes: value,
        });
    }
    handleComment = (value) => {
        this.setState({
            newComment: value,
        });
    }
    handleDeleteComment = () => {
        this.setState({
            addNewComment: false,
        });
    }
    addComment = () => {
        this.setState({
            addNewComment: true,
        });
    }
    handleSaveComment = () => {
        console.log('came in save comment');
        let data = {};
            data = {
                id: _get(this.props, 'getTicketDataById.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                comment: this.state.newComment,
            };
            let url = `/Ticket/AddComment`;
            let constants = {
                init: 'ADD_COMMENT_TICKET_DATA_INIT',
                success: 'ADD_COMMENT_TICKET_DATA_SUCCESS',
                error: 'ADD_COMMENT_TICKET_DATA_ERROR',
            };
            let identifier = 'ADD_COMMENT_TICKET_DATA';
            let key = 'addCommentTicketData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('ticket comment added successfully.', data);
                this.setState({
                    isSaved: true,
                });
                showToast('success', `Ticket Comment Added Successfully.`, 3000);
            }, (err) => {
                console.log('error while cancelling Ticket', err);
            });
    }
    onCancel = () => {
        Alert.alert(
            `Confirmation`,
            `Are you sure you want to Cancel this ticket?`,
            [
                { text: 'No', onPress: () => {} },
                { text: 'Yes', onPress: () => this.handleCancel() },
            ],
            { cancelable: false }
        );
    }

    handleCancel = () => {
        let data = {};
            data = {
                id: _get(this.props, 'getTicketDataById.id', ''),
            };
            let url = `/Ticket/Cancel`;
            let constants = {
                init: 'CANCEL_TICKET_DATA_INIT',
                success: 'CANCEL_TICKET_DATA_SUCCESS',
                error: 'CANCEL_TICKET_DATA_ERROR',
            };
            let identifier = 'CANCEL_TICKET_DATA';
            let key = 'canceledTicketData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('ticket canceled successfully.', data);
                this.setState({
                    isSaved: true,
                });
                showToast('success', `Ticket Cancelled Successfully.`, 3000);
                // setTimeout(() => {
                this.props.navigation.navigate('ServiceTicketHome');
                // }, 2000);
            }, (err) => {
                console.log('error while cancelling Ticket', err);
            });
    }

    renderComment = (comment, index, newComment) => {
        if (newComment) {
           return (
           <View key={index} style={{ flex: 1, marginLeft: 15, marginBottom: 10, flexDirection: 'row' }}>
                {
                    this.state.isSaved &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: 100 }}>
                        <CustomText>{_get(this.props, 'userDetails.user.firstName', '')+ ' '+ _get(this.props, 'userDetails.user.lastName', '')}</CustomText>
                    </View>
                }
                <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                            <TextInput
                                style={{ height: 50, width: 250, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                onChangeText={value => this.handleComment(value)}
                                multiline={true}
                                placeholder={'New Comment'}
                                maxLength={120}
                                editable={!this.state.isSaved}
                                autoFocus={true}
                                value={_get(this.state, 'newComment', '').toString()}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'default'}
                            />
                        </View>
                    </View>
                </View>
                {
                    !this.state.isSaved &&
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>
                        <Icon onPress={() => this.handleSaveComment()} name='content-save' type="MaterialCommunityIcons" />
                        <Icon onPress={() => this.handleDeleteComment()} name='delete' type="MaterialCommunityIcons" />
                    </View>
                }
            </View>);
        } else {
            return (
                <View key={index} style={{ flex: 1, marginLeft: 15, marginBottom: 10, flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', width: 100 }}>
                        <CustomText>{_get(comment, 'user.label', '')}</CustomText>
                    </View>
                    <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                <TextInput
                                    style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                    onChangeText={value => this.handleComments(value, index)}
                                    multiline={true}
                                    placeholder={'Comments'}
                                    maxLength={120}
                                    editable={false}
                                    value={_get(comment, 'comment', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

    render() {
        const { selectedOption, notes } = this.state;
        const { strings, getTicketDataById } = this.props;

        let images = [];
        let commentsView = [];
        let status = _get(getTicketDataById, 'status.value', 0);
        !_isEmpty(_get(getTicketDataById, 'comments', [])) && _get(getTicketDataById, 'comments', []).map((comment, index) => {
            commentsView.push(
                this.renderComment(comment, index)
            );
        });
        !_isEmpty(_get(getTicketDataById, 'attachments', [])) && _get(getTicketDataById, 'attachments', []).map((attachment, index) => {
            console.log('attetcjmant', attachment);
            images.push(
                <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
                    {
                        <Image source={attachment.link.indexOf('.JPEG') != -1? { uri: attachment.link }: pdfIcon } style={{ width: 100, height: 100 }} />
                    }
                    <View style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                <TextInput
                                    style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                    onChangeText={value => this.handleComments(value, index)}
                                    multiline={true}
                                    placeholder={'Comments'}
                                    maxLength={120}
                                    editable={false}
                                    value={_get(attachment, 'comment', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                        </View>
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
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.reviewLabel}`} {status != 0 && <Icon style={{ marginLeft: 15, marginTop: 15 }} name={status == 2? 'md-checkmark-circle-outline': status == 1 ? 'circle-with-cross': ''} type={status==1? 'Entypo': 'Ionicons'} size={24} />} </Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                <View style={{ flex: 1, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                        <CustomSemiBoldText>{`${strings.assetId}: ${_get(getTicketDataById, 'asset.label', '')}`}</CustomSemiBoldText>
                    </View>
                </View>
                <View style={{ flex: 1, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                        <CustomSemiBoldText>{`${strings.commentsTitle}`}</CustomSemiBoldText>
                    </View>
                    {commentsView.length > 0 ?
                    commentsView: <View style={{ justifyContent: 'center', alignItems: 'center' }}><CustomText >{`${strings.noCommentsTitle}`}</CustomText></View>}
                    {
                        this.state.addNewComment &&
                        this.renderComment(undefined, 0, true)
                    }
                    </View>
                    <View style={{ flex: 1, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <CustomSemiBoldText>{`${strings.notesLabel}`}</CustomSemiBoldText>
                            </View>
                            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                                <TextInput
                                    style={{ height: 135, borderColor: 'gray', borderWidth: 1, paddingLeft: 10 }}
                                    onChangeText={value => this.handleNotes(value)}
                                    multiline={true}
                                    editable={false}
                                    maxLength={120}
                                    value={_get(getTicketDataById, 'description', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <CustomText>{`${_get(getTicketDataById, 'description.length', '')}/120`}</CustomText>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            {
                                images
                            }
                        </View>
                    </View>
                </Content>
                <View style={{ flexDirection: 'row', backgroundColor: '#ededed' }}>
                    <Button disabled={_get(getTicketDataById, 'status.value', 0) != 0} style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: _get(getTicketDataById, 'status.value', 0) != 0 ? '#ededed': '#ff585d' }]} onPress={() => this.onCancel()} full>
                        <CustomBoldText style={theme.butttonFixTxt}>{`${strings.cancelText}`}</CustomBoldText>
                    </Button>
                    <Button disabled={this.state.addNewComment} style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: this.state.addNewComment ? '#ededed': '#ff585d' }]} onPress={() => this.addComment()} full>
                        <CustomBoldText style={theme.butttonFixTxt}>{`${strings.addCommentText}`}</CustomBoldText>
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
    console.log('user details in ticket', userDetails);
    let isLoading = commonReducer.isFetching || false;
    let { getTicketDataById } = commonReducer || {};

    return {
        decodedToken,
        userDetails,
        isLoading,
        getTicketDataById,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ReviewTicketScreen)));
