import React from 'react';
import { View, Image, StyleSheet, TouchableHighlight, TextInput } from 'react-native';
import withErrorBoundary from '../hocs/withErrorBoundary';
import tasksImg from '../../assets/images/active-icons/tasks-active.png';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import { postData } from '../../actions/commonAction';
import CustomBoldText from '../stateless/CustomBoldText';
import { showToast } from '../../utils';
import withLocalization from '../../components/hocs/withLocalization';

const ContainerWithLoading = withLoadingScreen(Container);

const checkList = [
  {
    id: 1,
    description: 'this is for trucks',
    checks: [
      'compresor',
      'steering',
      'break',
    ],
    groups: [
      {
        name: 'light',
        checks: [
          'headlight',
          'taillight',
        ],
      },
    ],
  },
];


class CheckListGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyTaskList: checkList,
      checked: false,
      comments: '',
      selectedGroupIndex: 0,
      prevStateData: props.navigation.getParam('stateData', {}),
    };
  }
    static navigationOptions = {
      header: null,
    };
    componentDidMount() {
    //   this.fetchDailyTaskList();
    }
    
    handleRootCheckbox = (item, name, forGroup, group, value) => {
      let val = null;
      if (!forGroup) {
        const selectedItems = _get(this, 'state.selectedItems', []);
        const existingIndex = _findIndex(selectedItems, { 'name': item });
        if (existingIndex != -1) {
          if (name=='passed') {
            val = !(_get(selectedItems, `[${existingIndex}].passed`, false));
          } else {
            val = value;
          }
          _set(selectedItems, `[${existingIndex}].${name}`, val);
        } else {
          selectedItems.push({
            name: item,
            [name]: value,
          });
        }
        this.setState({
          selectedItems,
        });
        // console.log('selected items', selectedItems);
      } else {
        const selectedGroupItems = _get(this, 'state.selectedGroupItems', []);
        const existingIndex = _findIndex(selectedGroupItems, { 'name': group.name });
        if (existingIndex != -1) {
          const checksOfGroup = _get(selectedGroupItems, `[${existingIndex}].checks`, []);
          const existingIndexItem = _findIndex(checksOfGroup, { 'name': item });
          if (existingIndexItem != -1) {
            if (name=='passed') {
              val = !(_get(checksOfGroup, `[${existingIndexItem}].passed`, false));
            } else {
              val = value;
            }
            _set(checksOfGroup, `[${existingIndexItem}].${name}`, val);
          } else {
            checksOfGroup.push({
              name: item,
              [name]: value,
            });
          }
          _set(selectedGroupItems, `[${existingIndex}].checks`, checksOfGroup);
        } else {
          selectedGroupItems.push({
            name: group.name,
            checks: [
              {
                name: item,
                [name]: value,
              },
            ],
          });
        }
        // console.log('selected group items', selectedGroupItems);
        this.setState({
          selectedGroupItems,
        });
      }
    }
    handleGroupCheckbox = (group, name, value) => {
    //   console.log('original group', group);
      const selectedGroupItems = _get(this, 'state.selectedGroupItems', []);
      const existingIndex = _findIndex(selectedGroupItems, { 'name': group.name });
      if (existingIndex != -1) {
        const checksOfGroup = [];
        !_isEmpty(_get(group, 'checks', [])) && _get(group, 'checks', []).map((grpItem, index) => {
          checksOfGroup.push({
            name: grpItem,
            passed: false,
          });
        });
        _set(selectedGroupItems, `[${existingIndex}].checks`, checksOfGroup);
        _set(selectedGroupItems, `[${existingIndex}].passed`, false);
      } else {
        const checksOfGroup = [];
        !_isEmpty(_get(group, 'checks', [])) && _get(group, 'checks', []).map((grpItem, index) => {
          checksOfGroup.push({
            name: grpItem,
            passed: true,
          });
        });
        selectedGroupItems.push({
          name: group.name,
          checks: checksOfGroup,
          passed: true,
        });
      }
      this.setState({
        selectedGroupItems,
      });
    }
    handleRootComment = (item, value, index) => {
      const selectedItems = _get(this, 'state.selectedItems', []);
      const existingIndex = _findIndex(selectedItems, { 'name': item });
      if (existingIndex != -1) {
        _set(selectedItems, `[${existingIndex}].comment`, value);
      } else {
        selectedItems.push({
          name: item,
          passed: false,
          comment: value,
        });
      }
      this.setState({
        selectedItems,
      });
    }
    onSave = () => {
      const finalData = {};
      _set(finalData, 'checks', _get(this.state, 'prevStateData.selectedItems', []));
      _set(finalData, 'groupChecks', _get(this.state, 'selectedGroupItems', []));
      _set(finalData, 'id', _get(this, 'props.getDailyTasksData.id', ''));
      _set(finalData, 'userId', _get(this, 'props.userDetails.user.id', ''));
      _set(finalData, 'assetId', _get(this, 'props.userDetails.clockedInto.id', ''));
      _set(finalData, 'createdOn.seconds', parseInt(new Date().getTime()/1000));
      const url = `/SafetyCheckList/Save`;
      const constants = {
        init: 'SAVE_DAILY_TASKS_DATA_INIT',
        success: 'SAVE_DAILY_TASKS_DATA_SUCCESS',
        error: 'SAVE_DAILY_TASKS_DATA_ERROR',
      };
      const identifier = 'SAVE_DAILY_TASKS_DATA';
      const key = 'dailyTasksDataSaved';
      this.props.postData(url, finalData, constants, identifier, key)
          .then((data) => {
            showToast('success', `${this.props.strings.checkListSavedSuccessfully}`, 3000, 'bottom');
            this.props.navigation.navigate('Home');
          }, (err) => {
            console.log('error while saving daily tasks', err);
          });
    }
    getRootView = (item, index, forGroup, group) => {
      let item1 = {};
      if (!forGroup) {
        item1 = _find(_get(this, 'state.selectedItems', []), { 'name': item });
      } else {
        const grpItemIndex = _findIndex(_get(this, `state.selectedGroupItems`, []), { 'name': _get(group, 'name', '') });
        item1 = _find(_get(this, `state.selectedGroupItems[${grpItemIndex}].checks`, []), { 'name': item });
      }
      return (
        <View key={index} style={{ flex: 1, flexDirection: 'column', padding: 10, borderColor: 'black', borderWidth: 1, marginBottom: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center' }}>{`${item}`}</Text>
            <CheckBox
              iconRight={true}
              right={true}
              containerStyle={{ backgroundColor: '#ededed' }}
              checked={_get(item1, 'passed', false)}
              onPress={() => this.handleRootCheckbox(item, 'passed', forGroup, group, true)}
            />
          </View>
          {
            !_get(item1, 'passed', false) &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 5 }}>
                      <TextInput
                        style={{ height: 50, width: forGroup?200: 300, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={value => this.handleRootCheckbox(item, 'comment', forGroup, group, value)}
                        multiline={true}
                        placeholder={'Comments'}
                        maxLength={120}
                        value={_get(item1, 'comment', '').toString()}
                        underlineColorAndroid={'transparent'}
                        keyboardType={'default'}
                      />
                      {/* <TextToSpeech
                            handleTextToSpeech={e => this.handleComments(_get(e, 'value[0]', ''), index)}
                        /> */}
                    </View>
          }
        </View>
      );
    }
    showHideGroupData = (index) => {
      this.setState((state) => {
        return { selectedGroupIndex: state.selectedGroupIndex == index? -1: index };
      });
    }
    renderGroupView = (group, index) => {
      const groupItemView = [];
      !_isEmpty(_get(group, 'checks', [])) && _get(group, 'checks', []).map((item, index) => {
        groupItemView.push(this.getRootView(item, index, true, group));
      });
      const grpItem = _find(_get(this, `state.selectedGroupItems`, []), { 'name': _get(group, 'name', '') });
      return (
        <View key={index} style={{ flex: 1, flexDirection: 'column', padding: 10, borderColor: 'black', borderWidth: 1, marginBottom: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text onPress={() => this.showHideGroupData(index)} style={{ textAlign: 'center' }}>{`${_get(group, 'name')}`}<Icon name={this.state.selectedGroupIndex == index ? 'chevron-small-up': 'chevron-small-down'} type="Entypo" style={{ fontSize: 20 }} /></Text>
            <CheckBox
              iconRight={true}
              right={true}
              containerStyle={{ backgroundColor: '#ededed' }}
              checked={_get(grpItem, 'passed', false)}
              onPress={() => this.handleGroupCheckbox(group, index)}
            />
          </View>
          {
            this.state.selectedGroupIndex == index &&
              <View style={{ flex: 1, padding: 10 }}>
                {groupItemView}
              </View>
          }
        </View>
      );
    }
    render() {
      const { getDailyTasksData, strings } = this.props;
      const groupView = [];
      !_isEmpty(_get(getDailyTasksData, 'groups', [])) && _get(getDailyTasksData, 'groups', []).map((group, index) => {
        groupView.push(this.renderGroupView(group, index));
      });

      return (
        <ContainerWithLoading style={theme.container} isLoading={this.props.isFetching}>
          <Header style={{ backgroundColor: '#47d7ac', borderBottomWidth: 0 }} androidStatusBarColor="#47d7ac">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{strings.dailyTasks}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={[theme.centerAlign, { backgroundColor: '#47d7ac', paddingBottom: 30 }]}>
                <TouchableHighlight
                  style={[]}
                >
                  <Image source={tasksImg} style={styles.profileImg} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={{ flex: 1, margin: 15 }}>
              {groupView}
              {/* {rootItemView} */}
            </View>
          </Content>
          {
            !_isEmpty(_get(getDailyTasksData, 'checks', [])) &&
              <View style={{ backgroundColor: '#ededed' }}>
                <Button style={[theme.buttonNormal, { backgroundColor: '#47d7ac' }]} onPress={() => this.onSave()} full>
                  <CustomBoldText style={theme.butttonFixTxt}>{strings.confirmText}</CustomBoldText>
                </Button>
              </View>
          }
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { commonReducer, auth } = state || {};
  const { decodedToken } = auth || {};
  const { userDetails } = commonReducer || {};
  const getDailyTasksData = _get(commonReducer, 'getDailyTasksData[0]', {});
  //   console.log('decoded token', decodedToken, 'user details', userDetails);
  const { isFetching } = commonReducer || false;

  return {
    decodedToken,
    userDetails,
    getDailyTasksData,
    isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
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
    height: 90,
    width: 63,
  },
});

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(CheckListGroup)));

