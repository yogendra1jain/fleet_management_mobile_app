import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight } from 'react-native';
import serviceImg from '../../assets/images/active-icons/service-ticket-active.png';
// import Input from 'react-native-elements';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import _sortBy from 'lodash/sortBy';
import _reverse from 'lodash/reverse';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import { postData } from '../../actions/commonAction';
import moment from 'moment';

import theme from '../../theme';
import { Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import CustomText from '../stateless/CustomText';
import { mapDateToDay } from '../../utils';
const ContainerWithLoading = withLoadingScreen(Container);

class ServiceTicketListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
        };
        this.status = this.props.navigation.getParam('status', 0);
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {
        this.fetchServiceTickets();
    }
    fetchServiceTickets = () => {
        let data = {};
            data = {
                status: this.status,
                id: _get(this.props, 'userDetails.clockedInto.id', ''),
            };
            let url = `/Ticket/GetByStatusAndAssetId`;
            let constants = {
                init: 'GET_TICKET_DATA_INIT',
                success: 'GET_TICKET_DATA_SUCCESS',
                error: 'GET_TICKET_DATA_ERROR',
            };
            let identifier = 'GET_TICKET_DATA';
            let key = 'getTicketData';
            this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('tickets get successfully.', data);
            }, (err) => {
                console.log('error while getting service tickets', err);
            });
    }
    getTicketData = (ticket) => {
        let data = {};
        data = {
            id: _get(ticket, 'id', ''),
        };
        let url = `/Ticket/Get`;
        let constants = {
            init: 'GET_TICKET_DATA_BY_ID_INIT',
            success: 'GET_TICKET_DATA_BY_ID_SUCCESS',
            error: 'GET_TICKET_DATA_BY_ID_ERROR',
        };
        let identifier = 'GET_TICKET_DATA_BY_ID';
        let key = 'getTicketDataById';
        this.props.postData(url, data, constants, identifier, key)
        .then((data) => {
            console.log('ticket data by id get successfully.', data);
            this.props.navigation.navigate('ReviewTicketScreen');
        }, (err) => {
            console.log('error while getting service ticket by id', err);
        });
    }
    handleOption = (item) => {
        this.setState({
            selectedOption: item.name,
        });
    }
    selectTicket = (ticket) => {
        this.setState({
            selectedTicket: ticket.id,
        });
        this.getTicketData(ticket);
    }

    renderTicketView = (sortedTicketData) => {
        let ticketsView = [];
        !_isEmpty(sortedTicketData) && sortedTicketData.map((ticket, index) => {
            ticketsView.push(
                <TouchableHighlight onPress={() => this.selectTicket(ticket)} key={index}>
                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: this.state.selectedTicket == ticket.id ? '#ff585d': 'transparent', justifyContent: 'space-between', padding: 15, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                            <CustomText>{_get(ticket, 'asset.label', '')}</CustomText>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                            <CustomText>{_get(ticket, 'description', '')}</CustomText>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        });
        return ticketsView;
    }

    render() {
        const { selectedOption } = this.state;
        const { getTicketData } = this.props;
        let sortedTicketData = _sortBy(getTicketData, 'modifiedOn.seconds');
        sortedTicketData = _reverse(sortedTicketData);
        let groupedTicketList = _groupBy(sortedTicketData, 'creation.actionTime.seconds');
        const DateView = _map(groupedTicketList, (value, key) => (
            <View key={key} style={{ paddingTop: 5 }}>
                <CustomText>{mapDateToDay(key)}</CustomText>
                {this.renderTicketView(value)}
            </View>
        ));
        
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header translucent={false} style={{ backgroundColor: '#ff585d' }} androidStatusBarColor='#ff585d'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >Service Ticket</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { backgroundColor: '#ff585d', paddingBottom: 30 }]}>
                            <TouchableHighlight
                                style={[]}
                            >
                                <Image source={serviceImg} style={styles.profileImg} />
                            </TouchableHighlight>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {DateView}
                            </View>
                        </View>
                        {/* <TouchableHighlight onPress={() => {}}>
                            <View style={[theme.centerAlign, { flex: 1, flexDirection: 'row', margin: 20 }]}>
                                <Icon name='ios-calendar' />
                                <CustomText style={{ marginLeft: 10 }}>Upcoming Appointments</CustomText>
                            </View>
                        </TouchableHighlight> */}
                    </View>
                </Content>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    // let { getTicketData } = commonReducer || [];
    // console.log('user details in ticket', userDetails);
    let isLoading = commonReducer.isFetching || false;
    // console.log('ticket data in red', getTicketData);
    let getTicketData = [];
    !_isEmpty(_get(commonReducer, 'getTicketData', [])) && _get(commonReducer, 'getTicketData', []).map((row) => {
        _set(row, 'creation.actionTime.seconds', moment.unix(_get(row, 'creation.actionTime.seconds', 0)).format('MM-DD-YYYY'));
        getTicketData.push(row);
    });
    return {
        decodedToken,
        userDetails,
        isLoading,
        getTicketData,
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
      height: 56,
      width: 90,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(ServiceTicketListScreen));
