import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image, Linking, TouchableHighlight } from 'react-native';
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

class TaskDetailScreen extends React.Component {
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
            task: this.props.navigation.getParam('task', {}),
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {
        this.fetchTaskDetails();
    }
    fetchTaskDetails = () => {
        let data = {};
            data = {
                id: _get(this.state, 'task.id', ''),
            };
            let url = `/Task/Get`;
            let constants = {
                init: 'GET_TASK_DATA_BY_ID_INIT',
                success: 'GET_TASK_DATA_BY_ID_SUCCESS',
                error: 'GET_TASK_DATA_BY_ID_ERROR',
            };
            let identifier = 'GET_TASK_DATA_BY_ID';
            let key = 'getTaskDataById';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('task get successfully.', data);
            }, (err) => {
                console.log('error while getting task', err);
            });
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
                id: _get(this.props, 'getTaskDataById.id', ''),
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
    openMap = (destination) => {
        let query = 'mansarovar plaza jaipur';
        if (destination !='') {
            query = destination;
        }
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
    completeTask = () => {
        let data = {};
            data = {
                taskId: _get(this.state, 'task.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                comment: 'Done',
            };
            let url = `/Task/Complete`;
            let constants = {
                init: 'COMPLETE_TASK_DATA_INIT',
                success: 'COMPLETE_TASK_DATA_SUCCESS',
                error: 'COMPLETE_TASK_DATA_ERROR',
            };
            let identifier = 'COMPLETE_TASK_DATA';
            let key = 'completeTaskData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('task completed successfully.', data);
                this.setState({
                    isSaved: true,
                });
                showToast('success', `Task Completed Successfully.`, 3000);
                // setTimeout(() => {
                this.props.navigation.navigate('Home');
                // }, 2000);
            }, (err) => {
                console.log('error while completing task', err);
            });
    }

    handleCancel = () => {
        let data = {};
            data = {
                taskId: _get(this.state, 'task.id', ''),
                userId: _get(this.props, 'userDetails.user.id', ''),
                comment: 'Not Required',
            };
            let url = `/Task/Cancel`;
            let constants = {
                init: 'CANCEL_TASK_DATA_INIT',
                success: 'CANCEL_TASK_DATA_SUCCESS',
                error: 'CANCEL_TASK_DATA_ERROR',
            };
            let identifier = 'CANCEL_TASK_DATA';
            let key = 'canceledTaskData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('task canceled successfully.', data);
                this.setState({
                    isSaved: true,
                });
                showToast('success', `Task Cancelled Successfully.`, 3000);
                // setTimeout(() => {
                this.props.navigation.navigate('Home');
                // }, 2000);
            }, (err) => {
                console.log('error while cancelling task', err);
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
        const { selectedOption, notes, task } = this.state;
        const { strings, getTaskDataById } = this.props;
        // const getTaskDataById = task;
        console.log('task data', getTaskDataById);

        let images = [];
        let commentsView = [];
        let status = _get(getTaskDataById, 'status.value', 0);
        !_isEmpty(_get(getTaskDataById, 'comments', [])) && _get(getTaskDataById, 'comments', []).map((comment, index) => {
            commentsView.push(
                this.renderComment(comment, index)
            );
        });
        !_isEmpty(_get(getTaskDataById, 'attachments', [])) && _get(getTaskDataById, 'attachments', []).map((attachment, index) => {
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
                <Header style={{ backgroundColor: '#47d7ac', borderBottomWidth: 0 }} androidStatusBarColor='#47d7ac'>
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
                        <CustomSemiBoldText>{`${strings.assetId}: ${_get(getTaskDataById, 'asset.assetId', '')}`}</CustomSemiBoldText>
                    </View>
                </View>
                <View style={{ flex: 1, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                        <CustomSemiBoldText>{`${strings.commentsTitle}`}</CustomSemiBoldText>
                    </View>
                    {commentsView.length > 0 ?
                    commentsView: !this.state.isSaved ? <View style={{ justifyContent: 'center', alignItems: 'center' }}><CustomText >{`${strings.noCommentsTitle}`}</CustomText></View>: <Text></Text>}
                    {
                        this.state.addNewComment &&
                        this.renderComment(undefined, 0, true)
                    }
                    </View>
                    <View style={{ flex: 1, paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                        <TouchableHighlight onPress={() => this.openMap(_get(getTaskDataById, 'destination.name', ''))}>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                            <CustomSemiBoldText >{`${strings.destinationText}: ${_get(getTaskDataById, 'destination.name', 'NA')}`}</CustomSemiBoldText>
                        </View>
                        </TouchableHighlight>
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
                                    value={_get(getTaskDataById, 'description', '').toString()}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'default'}
                                />
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                                <CustomText>{`${_get(getTaskDataById, 'description.length', '')}/120`}</CustomText>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            {
                                images
                            }
                        </View>
                    </View>
                </Content>
                <View style={{ backgroundColor: '#ededed' }}>
                    {/* <Button disabled={_get(getTaskDataById, 'status.value', 0) != 0} style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: _get(getTaskDataById, 'status.value', 0) != 0 ? '#ededed': '#ff585d' }]} onPress={() => this.onCancel()} full>
                        <CustomBoldText style={theme.butttonFixTxt}>{`${strings.cancelText}`}</CustomBoldText>
                    </Button> */}
                    <Button style={[theme.buttonNormal, { backgroundColor: '#47d7ac' }]} onPress={() => this.completeTask()} full>
                        <CustomBoldText style={theme.butttonFixTxt}>{`${strings.completeText}`}</CustomBoldText>
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
    let { getTaskDataById } = commonReducer || {};

    return {
        decodedToken,
        userDetails,
        isLoading,
        getTaskDataById,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
    };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(TaskDetailScreen)));
