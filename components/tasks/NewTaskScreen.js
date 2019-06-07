import React from 'react';
import { connect } from 'react-redux';
import { View, TextInput, Alert, Image } from 'react-native';
import _get from 'lodash/get';
import { CheckBox } from 'react-native-elements';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import { postData } from '../../actions/commonAction';

import CustomText from '../stateless/CustomText';
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, ListItem, Left, Right, Icon, Radio } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomBoldText from '../stateless/CustomBoldText';
import pdfIcon from '../../assets/images/pdficon.png';
import videoIcon from '../../assets/images/videoIcon.png';
// import Voice from 'react-native-voice';
import TextToSpeech from '../stateless/SpeechToText';
import AssetView from '../stateless/AssetView';

import t from 'tcomb-form-native';

const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);
const ImageWithLoading = withLoadingScreen(Image);

const TypeData = t.enums({
  0: 'Standarad',
  1: 'Custom',
}, 'Select option');

class NewTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      notes: '',
      imageSource: '',
      links: [],
      uploadedLinks: [],
      isSpeeking: false,
      majorService: false,
      value: {},
    };
    this.stylesheet = _cloneDeep(stylesheet);
    this.stylesheet.textbox.normal.color = 'black';
    this.stylesheet.controlLabel.normal.color = 'black';
    this.stylesheet.textboxView.normal.borderBottomColor = 'black';
    this.stylesheet.textbox.error.color = 'red';
    this.stylesheet.controlLabel.error.color = 'red';
    this.stylesheet.textboxView.error.borderBottomColor = 'red';
    this.TaskModal = t.struct({
      comment: t.String,
      dueDate: t.Date,
      description: t.String,
      type: TypeData,
    });
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
    onSave = () => {
      const value = this.refs.form.getValue();
      if (value) {
        console.log('value in save', value);
        this.props.navigation.navigate('TaskAttachmentScreen', { stateData: value });
        // this.handleApprove(value);
      } else {
        this.refs.form.getComponent('description').refs.input.focus();
      }
    }
    handleOption = (item) => {
      this.setState({
        selectedOption: item.name,
      });
    }
    handleTextToSpeech = (e, name) => {
      this.setState({
        [name]: _get(e, 'value[0]', ''),
      });
    }

    renderContent = (strings) => {
      const { userDetails, decodedToken } = this.props;
      const assetListView = [];
      // const role = _get(decodedToken, 'FleetUser.role', 0);
      assetListView.push(
          <AssetView
            key={0}
            index={0}
            selectedIndex={0}
            asset={_get(userDetails, 'clockedInto', {})}
            strings={strings}
            handleAssetClick={this.handleAssetClick}
            handleCheckIn={this.getCurrentLocation}
            decodedToken={this.props.decodedToken}
            userDetails={this.props.userDetails}
            handleCheckOut={this.handleCheckOut}
            hideButton={true}
          />
      );
      return assetListView;
    }
    handleCheckbox = () => {
      this.setState({
        majorService: !this.state.majorService,
      });
    }
    onChange = (value) => {
      this.setState({ value });
    }
    render() {
    //   const { notes } = this.state;
      const { strings } = this.props;
      const options = {
        fields: {
          comment: {
            label: `Comment`,
            stylesheet: this.stylesheet,
            config: {
              strings: strings,
            },
            // onSubmitEditing: () => this.refs.form.getComponent('password').refs.input.focus(),
          },
          dueDate: {
            returnKeyType: 'done',
            label: `Due Date`,
            stylesheet: this.stylesheet,
            config: {
              strings: strings,
            },
          },
          description: {
            returnKeyType: 'done',
            label: `Description`,
            multiline: true,
            numberOfLines: 4,
            stylesheet: this.stylesheet,
            config: {
              strings: strings,
            },
          },
          type: {
            returnKeyType: 'done',
            label: `Type`,
            stylesheet: this.stylesheet,
            config: {
              strings: strings,
            },
          },
        },
      };
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
            {this.renderContent(strings)}
            <View style={{ flex: 1, paddingTop: 15 }}>
              <View style={[theme.mart15, theme.marL25, theme.marR25]}>
                <Form
                  ref="form"
                  options={options}
                  type={this.TaskModal}
                  value={this.state.value}
                  onChange={this.onChange}
                  style={theme.formStyle}
                />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>{`Major Service`}</Text>
                <CheckBox
                  iconRight={true}
                  right={true}
                  containerStyle={{ backgroundColor: '#ededed' }}
                  checked={_get(this, 'state.majorService', false)}
                  onPress={() => this.handleCheckbox()}
                />
              </View>
            </View>
          </Content>
          <View style={{ backgroundColor: '#ededed' }}>
            <Button style={[theme.buttonNormal, { backgroundColor: '#ff585d' }]} onPress={() => this.onSave()} full>
              <CustomBoldText style={theme.butttonFixTxt}>{`Next`}</CustomBoldText>
            </Button>
          </View>
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(NewTaskScreen)));
