import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import _get from 'lodash/get';
import { CheckBox, SearchBar } from 'react-native-elements';
import withLocalization from '../hocs/withLocalization';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import { postData } from '../../actions/commonAction';

import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomBoldText from '../stateless/CustomBoldText';
// import Voice from 'react-native-voice';
import BusinessCardView from '../stateless/BusinessCardView';

import t from 'tcomb-form-native';
import CustomSemiBoldText from '../stateless/CustomSemiBoldText';
import { showToast } from '../../utils';

const Form = t.form.Form;
const stylesheet = t.form.Form.stylesheet;

const ContainerWithLoading = withLoadingScreen(Container);

class TicketApproveScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      showServiceProviders: false,
      selectedIndex: '',
      search: '',
      loadingServiceP: false,
      mode: props.navigation.getParam('mode', ''),
    };
    this.stylesheet = _cloneDeep(stylesheet);
    this.stylesheet.textbox.normal.color = 'black';
    this.stylesheet.controlLabel.normal.color = 'black';
    this.stylesheet.textboxView.normal.borderBottomColor = 'black';
    this.stylesheet.textbox.error.color = 'red';
    this.stylesheet.controlLabel.error.color = 'red';
    this.stylesheet.textboxView.error.borderBottomColor = 'red';
    if (props.navigation.getParam('mode', '')=='Approve') {
      this.ConfirmTicket = t.struct({
        comment: t.String,
        dueDate: t.Date,
      });
    } else {
      this.ConfirmTicket = t.struct({
        comment: t.String,
      });
    }
  }
    static navigationOptions = {
      header: null,
    };
    componentDidMount() {
      this.loadServiceProviders();
    }
    updateSearch = (search) => {
      this.setState({ search });
      if (search.length > 2) {
        this.loadServiceProviders(search);
      }
    };
    loadServiceProviders = (search) => {
      let data = {};
      data = {
        userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
        clientId: _get(this.props, 'decodedToken.Client.id', ''),
        text: search,
        limit: 100,
        offset: 0,
      };
      const url = `/BusinessCard/Search`;
      const constants = {
        init: 'GET_BUSINESS_CARDS_INIT',
        success: 'GET_BUSINESS_CARDS_SUCCESS',
        error: 'GET_BUSINESS_CARDS_ERROR',
      };
      this.setState({
        loadingServiceP: true,
      });
      const identifier = 'GET_BUSINESS_CARDS';
      const key = 'businessCards';
      this.props.postData(url, data, constants, identifier, key)
          .then((data) => {
            console.log('business cards fetched successfully.');
            this.setState({
              loadingServiceP: false,
            });
          }, (err) => {
            console.log('error while cancelling Ticket', err);
            this.setState({
              loadingServiceP: false,
            });
          });
    }
    onSave = () => {

    }
    onChange = (value) => {
      this.setState({ value });
    }
    handleCheckbox = () => {
      this.setState({
        showServiceProviders: !this.state.showServiceProviders,
      });
    }
    handleCardClick = (card) => {
      this.setState({
        selectedIndex: card.id,
      });
    }
    renderCards = (strings) => {
      const { businessCards } = this.props;
      const { selectedIndex } = this.state;
      const cardListView = [];
      // console.log('assets', managerAssets);
      !_isEmpty(_get(businessCards, 'cards', [])) && _get(businessCards, 'cards', []).map((cardData, index) => {
        cardListView.push(
            <BusinessCardView
              key={index}
              index={index}
              selectedIndex={selectedIndex}
              cardData={cardData}
              strings={strings}
              handleCardClick={() => this.handleCardClick(cardData, false)}
              decodedToken={this.props.decodedToken}
              userDetails={this.props.userDetails}
            />
        );
      }
      );
      return cardListView;
    }
    onConfirm = () => {
      const value = this.refs.form.getValue();
      if (value) {
        // console.log('value in save', value, this.state.selectedIndex);
        this.handleApprove(value);
      } else {
        this.refs.form.getComponent('comment').refs.input.focus();
      }
    }
    handleApprove = (value) => {
      const { mode } = this.state;
      const url = `/Ticket/${mode}`;
      const constants = {
        init: 'APPROVE_TICKET_INIT',
        success: 'APPROVE_TICKET_SUCCESS',
        error: 'APPROVE_TICKET_ERROR',
      };
      const identifier = 'APPROVE_TICKET';
      const key = 'approveTicket';
      const data = {
        ticketId: _get(this.props.getTicketDataById, 'id', ''),
        comment: value.comment,
        userId: _get(this.props, 'decodedToken.FleetUser.id', ''),
      };
      if (mode == 'Approve') {
        data.taskDueDate = {
          seconds: parseInt(
              _get(value, 'dueDate', new Date()).getTime() / 1000,
              10
          ),
        };
      }
      if (this.state.showServiceProviders && this.state.selectedIndex) {
        data.destination = {
          type: 0,
          destinationId: this.state.selectedIndex,
        };
      }
      this.props
          .dispatch(postData(url, data, constants, identifier, key))
          .then(
              (data) => {
                showToast('success', `Ticket ${mode}ed Sccessfully.`, 3000, 'bottom');
                this.props.navigation.navigate('ServiceTicketHome');
              },
              (err) => {
                console.log('error while fetching tickets list', err);
              }
          );
    };

    render() {
      const { strings } = this.props;
      const { mode, loadingServiceP, search } = this.state;
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
            // placeholder: 'Enter Password',
            returnKeyType: 'done',
            label: `Due Date`,
            stylesheet: this.stylesheet,
            config: {
              strings: strings,
            },
            // onSubmitEditing: () => this.onPress(),
          },
        },

      };
      return (
        <ContainerWithLoading style={theme.container} isLoading={!loadingServiceP && this.props.isLoading}>
          <Header style={{ backgroundColor: '#ff585d', borderBottomWidth: 0 }} androidStatusBarColor='#ff585d'>
            <Left style={{ flex: 1 }}>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff' }} />
              </Button>
            </Left>
            <Body style={[theme.centerAlign, { flex: 4 }]}>
              <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`${strings.confirmText}`}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
          </Header>
          <Content
            style={{ backgroundColor: '#ededed' }}
          >
            <View style={{ flex: 1, paddingTop: 15 }}>
              <View style={[theme.mart15, theme.marL25, theme.marR25]}>
                <Form
                  ref="form"
                  options={options}
                  type={this.ConfirmTicket}
                  value={this.state.value}
                  onChange={this.onChange}
                  style={theme.formStyle}
                />
              </View>
              {
                mode == 'Approve' &&
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CustomSemiBoldText style={{ textAlign: 'center', paddingLeft: 25 }}>{strings.wantToSendToServiceProvider}</CustomSemiBoldText>
                    <CheckBox
                      iconRight={true}
                      right={true}
                      containerStyle={{ backgroundColor: '#ededed' }}
                      checked={_get(this, 'state.showServiceProviders', false)}
                      onPress={() => this.handleCheckbox()}
                    />
                  </View>
              }
              {
                _get(this, 'state.showServiceProviders', false) &&
                  <View>
                    <SearchBar
                      placeholder="Search Here..."
                      lightTheme
                      onChangeText={this.updateSearch}
                      value={search}
                      showLoading={loadingServiceP}
                    />
                    {this.renderCards(strings)}
                  </View>
              }
            </View>
          </Content>
          <View style={{ flexDirection: 'row', backgroundColor: '#ededed' }}>
            <Button style={[theme.buttonNormal, theme.spaceAdd1, { backgroundColor: '#ff585d' }]} onPress={() => this.onConfirm()} full>
              <CustomBoldText style={theme.butttonFixTxt}>{`${mode}`}</CustomBoldText>
            </Button>
            <Button disabled={this.state.addNewComment} style={[theme.buttonNormal, theme.spaceAdd2, { backgroundColor: this.state.addNewComment ? '#ededed': '#ff585d' }]} onPress={() => this.props.navigation.goBack()} full>
              <CustomBoldText style={theme.butttonFixTxt}>{`${strings.cancelText}`}</CustomBoldText>
            </Button>
          </View>
        </ContainerWithLoading>
      );
    }
}

function mapStateToProps(state) {
  const { decodedToken } = state.auth || {};
  const { commonReducer } = state || {};
  const { userDetails, businessCards, getTicketDataById } = commonReducer || {};
  // console.log('user details in ticket', userDetails);
  const isLoading = commonReducer.isFetching || false;

  return {
    decodedToken,
    userDetails,
    isLoading,
    businessCards,
    getTicketDataById,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postData: (url, formData, constants, identifier, key) => dispatch(postData(url, formData, constants, identifier, key)),
  };
}

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(TicketApproveScreen)));
