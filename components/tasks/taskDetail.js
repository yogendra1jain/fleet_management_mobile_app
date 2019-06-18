import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image, Linking, TouchableHighlight, TouchableOpacity } from 'react-native';
import _get from 'lodash/get';
import { Overlay } from 'react-native-elements';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { showToast } from '../../utils/index';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
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
import videoIcon from '../../assets/images/videoIcon.png';

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
      isVisible: false,
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
      const url = `/Task/Get`;
      const constants = {
        init: 'GET_TASK_DATA_BY_ID_INIT',
        success: 'GET_TASK_DATA_BY_ID_SUCCESS',
        error: 'GET_TASK_DATA_BY_ID_ERROR',
      };
      const identifier = 'GET_TASK_DATA_BY_ID';
      const key = 'getTaskDataById';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('task get successfully.');
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
      const url = `/Ticket/AddComment`;
      const constants = {
        init: 'ADD_COMMENT_TICKET_DATA_INIT',
        success: 'ADD_COMMENT_TICKET_DATA_SUCCESS',
        error: 'ADD_COMMENT_TICKET_DATA_ERROR',
      };
      const identifier = 'ADD_COMMENT_TICKET_DATA';
      const key = 'addCommentTicketData';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('ticket comment added successfully.');
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
    onAddComment = () => {
      this.setState({
        isVisible: true,
      });
    }
    confirmTask = (text) => {
      Alert.alert(
          `Confirmation`,
          `Are you sure you want to ${text} this Task?`,
          [
            { text: 'No', onPress: () => {} },
            { text: 'Yes', onPress: () => this.completeTask(text) },
          ],
          { cancelable: false }
      );
    }
    onSubmitComment = () => {
      const { comment } = this.state;
      let data = {};
      data = {
        id: _get(this.state, 'task.id', ''),
        userId: _get(this.props, 'userDetails.user.id', ''),
        comment: comment,
      };
      const url = `/Task/AddComment`;
      const constants = {
        init: 'ADD_TASK_COMMENT_INIT',
        success: 'ADD_TASK_COMMENT_SUCCESS',
        error: 'ADD_TASK_COMMENT_ERROR',
      };
      const identifier = 'ADD_TASK_COMMENT';
      const key = 'taskComment';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('task comment added successfully.');
            showToast('success', `Comment Added Successfully.`, 3000);
            this.fetchTaskDetails();
            this.hideCommentDialog();
          }, (err) => {
            console.log('error while completing task', err);
          });
    }
    hideCommentDialog = () => {
      this.setState({
        isVisible: false,
        comment: '',
      });
    }
    completeTask = (text) => {
      let data = {};
      data = {
        taskId: _get(this.state, 'task.id', ''),
        userId: _get(this.props, 'userDetails.user.id', ''),
        comment: 'Done',
      };
      const url = `/Task/${text}`;
      const constants = {
        init: 'COMPLETE_TASK_DATA_INIT',
        success: 'COMPLETE_TASK_DATA_SUCCESS',
        error: 'COMPLETE_TASK_DATA_ERROR',
      };
      const identifier = 'COMPLETE_TASK_DATA';
      const key = 'completeTaskData';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('task completed successfully.');
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
      const url = `/Task/Cancel`;
      const constants = {
        init: 'CANCEL_TASK_DATA_INIT',
        success: 'CANCEL_TASK_DATA_SUCCESS',
        error: 'CANCEL_TASK_DATA_ERROR',
      };
      const identifier = 'CANCEL_TASK_DATA';
      const key = 'canceledTaskData';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('task canceled successfully.');
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

    getLocalPath = (url) => {
      const filename = url.split('/').pop();
      // feel free to change main path according to your requirements
      return `${RNFS.DocumentDirectoryPath}/${filename}`;
    }

    handleImageNavigation = (item) => {
      const localFile = this.getLocalPath(item.link);

      const options = {
        fromUrl: item.link,
        toFile: localFile,
      };
      RNFS.downloadFile(options).promise
          .then(() => FileViewer.open(localFile))
          .then(() => {
            // success
            console.log('opening file');
          })
          .catch((error) => {
            // error
            console.log('error in opening file', error);
          });
      // if (item.link.toUpperCase().indexOf('PDF') !==-1) {
      //   this.props.navigation.navigate('PdfViewScreen', { uri: item.link, fromScreen: 'TaskDetailScreen' });
      // } else if (item.link.toUpperCase().indexOf('JPEG') !==-1) {
      //   this.props.navigation.navigate('ImageViewScreen', { uri: item.link, fromScreen: 'TaskDetailScreen' });
      // }
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
    handleCommentText = (comment) => {
      this.setState({
        comment,
      });
    }

    render() {
      // const { selectedOption, notes, task } = this.state;
      const { strings, getTaskDataById, decodedToken } = this.props;
      // const getTaskDataById = task;
      // console.log('task data', getTaskDataById);

      const images = [];
      const commentsView = [];
      const status = _get(getTaskDataById, 'status.value', 0);
      !_isEmpty(_get(getTaskDataById, 'comments', [])) && _get(getTaskDataById, 'comments', []).map((comment, index) => {
        commentsView.push(
            this.renderComment(comment, index)
        );
      });
      !_isEmpty(_get(getTaskDataById, 'attachments', [])) && _get(getTaskDataById, 'attachments', []).map((attachment, index) => {
        // console.log('attetcjmant', attachment);
        images.push(
            <View key={index} style={{ flex: 1, marginLeft: 20, marginBottom: 10, flexDirection: 'row' }}>
              {
                <TouchableOpacity onPress={() => this.handleImageNavigation(attachment)} activeOpacity={0.5} style={{ flex: 1 }}>
                  <Image source={attachment.link.toUpperCase().indexOf('.JPEG') != -1? { uri: attachment.link }: attachment.link.toUpperCase().indexOf('.MP4') != -1? videoIcon: pdfIcon } style={{ width: 100, height: 100 }} />
                </TouchableOpacity>
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
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.reviewLabel}`} {status != 0 && <Icon style={{ marginLeft: 15, marginTop: 15 }} name={status == 1? 'md-checkmark-circle-outline': status == 2 ? 'circle-with-cross': ''} type={status==1? 'Ionicons': 'Entypo'} size={24} />} </Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
              <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10 }}>
                <CustomSemiBoldText>{`${strings.assetId} ${_get(getTaskDataById, 'asset.assetId', '')}`}</CustomSemiBoldText>
              </View>
              <View style={{ justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>
                <CustomSemiBoldText>{`${strings.taskIdLabel}: ${_get(getTaskDataById, 'id', '')}`}</CustomSemiBoldText>
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
          {
            status == 0 &&
            <View style={{ flexDirection: 'row', backgroundColor: '#ededed' }}>
              <Button style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: '#47d7ac' }]} onPress={() => this.onAddComment()} full>
                <CustomBoldText style={theme.butttonFixTxt}>{strings.addCommentText}</CustomBoldText>
              </Button>
              <Button style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: '#47d7ac' }]} onPress={() => this.confirmTask(_get(decodedToken, 'FleetUser.role', 0) == 1? strings.completeText: strings.cancelText)} full>
                <CustomBoldText style={theme.butttonFixTxt}>{`${_get(decodedToken, 'FleetUser.role', 0) == 1? strings.completeText: strings.cancelText}`}</CustomBoldText>
              </Button>
            </View>
          }
          {
            this.state.isVisible && (
              <Overlay isVisible={this.state.isVisible}
                onBackdropPress={() => this.hideCommentDialog()}>
                <React.Fragment>
                  <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 10, marginTop: 30 }}>
                    <Text>{strings.Comentario}</Text>
                    <TextInput
                      style={{ height: 135, borderColor: 'gray', borderWidth: 1, paddingLeft: 10, marginTop: 20 }}
                      onChangeText={value => this.handleCommentText(value)}
                      multiline={true}
                      editable={true}
                      placeholder={'Enter your Comment here'}
                      // maxLength={120}
                      value={_get(this, 'state.comment', '').toString()}
                      underlineColorAndroid={'transparent'}
                      keyboardType={'default'}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF' }}>
                    <Button style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: '#47d7ac' }]} onPress={() => this.onSubmitComment()} full>
                      <CustomBoldText style={theme.butttonFixTxt}>{strings.add}</CustomBoldText>
                    </Button>
                    <Button style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: '#47d7ac' }]} onPress={() => this.hideCommentDialog()} full>
                      <CustomBoldText style={theme.butttonFixTxt}>{strings.cancelText}</CustomBoldText>
                    </Button>
                  </View>
                </React.Fragment>
              </Overlay>
            )}
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
  const { getTaskDataById } = commonReducer || {};

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
