import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Keyboard } from 'react-native';
// import expenseImg from '../../assets/images/expense.png';
import documentsImg from '../../assets/images/active-icons/document-active.png';

import _get from 'lodash/get';
import _map from 'lodash/map';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import { showToast } from '../../utils/index';
import t from 'tcomb-form-native';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import withLocalization from '../hocs/withLocalization';
import { uploadDoc } from '../../actions/signup';
import { postData } from '../../actions/commonAction';
import Geolocation from 'react-native-geolocation-service';
import numeral from 'numeral';

import CustomText from '../stateless/CustomText';


const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

const ValidExpense = t.refinement(t.String, (n) => {
  if (n) {
    return n.length > 0;
  }
});

class ExpenseReportInputScreen extends React.Component {
  constructor(props) {
    super(props);
    this.sameExpense = t.refinement(t.String, (s) => {
      return s == this.state.value.expense;
    });
    this.state = {
      expense: '',
      uploadedLinks: this.props.navigation.getParam('links', []),
      value: {
      },
      previousExpense: '',
      previousConfExpense: '',
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
    setMileage = (value) => {
      this.setState({
        expense: value,
      });
    }
    getCurrentLocation = (value) => {
      this.setState({
        isLoading: true,
      });
      Geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              isLoading: false,
            });
            let data = {};
            const expense = value.expense.replace(/,/g, '');
            data = {
              assetId: _get(this.props, 'userDetails.clockedInto.id', ''),
              userId: _get(this.props, 'userDetails.user.id', ''),
              documentType: 6,
              amount: Number(expense),
              links: this.state.uploadedLinks,
              coordinate: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              },
            };
            this.saveMileageData(data);
          },
          error => this.setState({ error: error.message }),
          { enableHighAccuracy: true },
      );
    }
    onSave = () => {
      Keyboard.dismiss();
      const value = this.refs.form.getValue();
      if (!value) {
        this.refs.form.getComponent('expense').refs.input.focus();
      } else {
        this.getCurrentLocation(value);
      }
    }
    onChange = (value) => {
      const tempStateValue = {};
      _map(value, (val, key) => {
        const decimalNumber = val.split('.');
        decimalNumber[0] = numeral((decimalNumber[0])).format('0,0');
        if (decimalNumber[1]) {
          if (decimalNumber[1].length == 1) {
            decimalNumber[1] = numeral((val)).format('0.0');
          } else {
            decimalNumber[1] = numeral((val)).format('0.00');
          }
          decimalNumber[1] = decimalNumber[1].split('.')[1];
        }
        const finalNum = decimalNumber.join('.');
        _set(tempStateValue, `${key}`, finalNum);
      });
      this.setState({
        value: tempStateValue,
      }, () => {
        if (value.confirmExpense != null && value.confirmExpense != '') {
          this.validate = this.refs.form.getValue();
        }
      });
      // this.setState({ value });
    }
    onChangeNative = (event) => {
    }
    handleExpenseChange = (event) => {
      const previousExpense = this.state.previousExpense;
      const value = _get(this.state, 'value', {});
      let currentVal = _get(value, 'expense', '');
      currentVal = currentVal.split('.');
      console.log('current val', currentVal, 'prev val', previousExpense, 'email', value.expense);
      let tempVal = _cloneDeep(currentVal[0]);
      tempVal = tempVal.replace(/,/g, '');
      if (tempVal.toString().length % 3 == 0 && previousExpense.length < currentVal[0].length) {
        currentVal[0] += ',';
      }

      if (currentVal[1] && currentVal[1].length > 2) {
        value.expense = previousExpense;
        this.setState({
          previousExpense: previousExpense,
          value,
        });
      } else {
        const newVal = currentVal[0] + (currentVal[1] || currentVal[1] == '' ? `.${currentVal[1]}`: '');
        value.expense = newVal;
        this.setState({
          previousExpense: newVal,
          value,
        });
      }
    }

    saveMileageData = (data) => {
      const url = `/Assets/UploadMandatoryDocument`;
      const constants = {
        init: 'SAVE_MILEAGE_DATA_INIT',
        success: 'SAVE_MILEAGE_DATA_SUCCESS',
        error: 'SAVE_MILEAGE_DATA_ERROR',
      };
      const identifier = 'SAVE_MILEAGE_DATA';
      const key = 'savedMileageData';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            showToast('success', `${this.props.strings.saveSuccessMsg}`, 3000);
            this.props.navigation.navigate('Home');
          }, (err) => {
            console.log('error while saving mileage', err);
          });
    }
    render() {
      const { strings } = this.props;
      const options = {
        fields: {
          expense: {
            keyboardType: 'numeric',
            autoFocus: false,
            returnKeyType: 'done',
            secureTextEntry: false,
            label: `${strings.expenseLabel}`,
            error: `${strings.expenseErrorText}`,
            onSubmitEditing: () => this.refs.form.getComponent('confirmExpense').refs.input.focus(),
          },
          confirmExpense: {
            keyboardType: 'numeric',
            autoFocus: false,
            secureTextEntry: false,
            returnKeyType: 'done',
            label: `${strings.confirmExpenseLabel}`,
            error: `${strings.confExpenseErrorText}`,
            onSubmitEditing: () => this.onSave(),
          },
        },

      };
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

              <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                <View style={{ justifyContent: 'flex-start', paddingRight: 5 }}>
                  <Icon name='exclamation' style={{ color: '#f6a800' }} type="FontAwesome" />
                </View>
                <View style={{ flex: 1, padding: 10, borderWidth: 1, borderColor: '#f6a800', flexWrap: 'wrap' }}>
                  <CustomText style={{ fontSize: 13 }}>
                    {`${strings.expenseAmountHelperText}`}
                  </CustomText>
                </View>
              </View>
              <View style={{ flex: 1, paddingTop: 15 }}>
                <View style={[theme.marL15, theme.marR15, theme.mart15]} >
                  <Form
                    ref="form"
                    options={options}
                    type={this.ExpenseStruct}
                    value={this.state.value}
                    onChange={this.onChange}
                    style={[theme.formStyle]}
                  />
                </View>
              </View>
            </View>
          </Content>
          <View style={{ backgroundColor: '#ededed' }}>
            <Button style={[theme.buttonNormal, { backgroundColor: '#059312' }]} onPress={() => this.onSave()} full>
              <Text style={theme.butttonFixTxt}>{`${strings.saveButton}`}</Text>
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
  const isLoading = commonReducer.isFetching || false;
  const { appLanguage, languageDetails } = commonReducer || 'en';

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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(ExpenseReportInputScreen)));
