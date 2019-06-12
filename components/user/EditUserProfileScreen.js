import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import t from 'tcomb-form-native';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import { updatePassword, clearError, setLoadingFalse } from '../../actions/auth';
import { postData } from '../../actions/commonAction';
import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withLocalization from '../hocs/withLocalization';
import { showToast } from '../../utils';

const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

class EditUserProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
    this.userData = props.navigation.getParam('userData', {});
    this.states = props.navigation.getParam('states', []);
    if (_isArray(this.states) && this.states.length > 0) {
      const StateObj = {};
      this.states.map((state, index) => {
        StateObj[`${state.value}`] = `${state.label}`;
      });
      const StateData = t.enums(StateObj);
      if (!_isEmpty(StateData)) {
        this.Profile = t.struct({
          license: t.String,
          issueState: StateData,
          dateOfExpiry: t.Date,
          contactNumber: t.String,
        });
      } else {
        this.Profile = t.struct({
          license: t.String,
          issueState: t.String,
          dateOfExpiry: t.Date,
          contactNumber: t.String,
        });
      }
    }
    this.stylesheet = _cloneDeep(stylesheet);
  }

    static navigationOptions = {
      header: null,
    };

    componentDidMount() {

    }
    componentWillUnmount() {
    }

    onChange = (value) => {
      this.setState({ value });
    }

    onPress = () => {
      const value = this.refs.form.getValue();
      const data = _get(this.userData, 'clientUser', {});
      if (value) {
        console.log('values in submit', value, 'user data', this.userData);
        _set(data, 'operatorFields.issuingState', _get(value, 'issueState', ''));
        _set(data, 'operatorFields.licenseNumber', _get(value, 'license', ''));
        _set(data, 'mobilePhone', _get(value, 'contactNumber', ''));
        const url = `/ClientUser/Update`;
        const constants = {
          init: 'UPDATE_USER_INIT',
          success: 'UPDATE_USER_SUCCESS',
          error: 'UPDATE_USER_ERROR',
        };
        const identifier = 'UPDATE_USER';
        const key = 'updatedUser';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
              this.props.navigation.goBack();
              this.props.navigation.navigate('Home');
              showToast('success', `User Updated Successfully.`, 2000);
            }, (err) => {
              console.log('error while updating password', err);
            });
      } else {
        this.refs.form.getComponent('license').refs.input.focus();
      }
    }

    render() {
      const { error, strings } = this.props || {};
      const options = {
        // template: creditCard,
        fields: {
          license: {
            keyboardType: 'default',
            autoFocus: true,
            label: `License Number *`,
            error: `Required`,
            onSubmitEditing: () => this.refs.form.getComponent('issueState').refs.input.focus(),
          },
          issueState: {
            keyboardType: 'default',
            label: `Issuing State *`,
            error: `Required`,
            // onSubmitEditing: () => this.refs.form.getComponent('confirmPassword').refs.input.focus()
          },
          dateOfExpiry: {
            label: 'Date Of Expiry *',
            mode: 'date',
            error: 'Required',
          },
          contactNumber: {
            keyboardType: 'numeric',
            label: `Mobile Number`,
            maxLength: 10,
            error: `Required`,
            onSubmitEditing: () => this.onPress(),
          },
        },

      };


      return (
        <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
          <Header translucent={false} style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor="#00A9E0" iosBarStyle="light-content">
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }}>{`Update Profile`}</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content>
            <Text>{error}</Text>
            <View style={[theme.marL15, theme.marR15, theme.mart15]} >
              <Form
                ref="form"
                options={options}
                type={this.Profile}
                value={this.state.value}
                onChange={this.onChange}
                style={[theme.formStyle]}
              />
            </View>
          </Content>
          <View style={{ backgroundColor: '#ffffff' }}>
            <Button style={theme.buttonNormal} onPress={() => this.onPress()} full>
              <Text style={theme.butttonFixTxt}>{`SAVE`}</Text>
            </Button>
          </View>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { auth, commonReducer } = state;
  const { userStatus } = auth || [];
  const { decodedToken } = auth || {};

  const { isLoading } = commonReducer || false;
  return {
    userStatus,
    auth,
    isLoading,
    decodedToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
    clearError: () => dispatch(clearError()),
    setLoadingFalse: () => dispatch(setLoadingFalse()),
    updatePassword: data => dispatch(updatePassword(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization(EditUserProfileScreen));
