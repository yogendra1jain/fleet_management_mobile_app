import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Container, Header, Button, Left, Right, Icon, Content, Body, Title } from 'native-base';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import { Overlay } from 'react-native-elements';

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import theme from '../../theme';
import CustomBoldText from '../stateless/CustomBoldText';

const dueDates = [
  {
    dateString: '2019-06-20',
    title: 'Task 1 Pending',
  },
  {
    dateString: '2019-06-23',
    title: 'Task 2 Pending',
  },
  {
    dateString: '2019-07-15',
    title: 'Task 3 Pending',
  },
];
class MyCalanderView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  handleDayPress = (date, dateTask) => {
    console.log('clicked date', date);
    this.setState({
      isVisible: true,
      dateTask,
    });
  }

  hideDialog = () => {
    this.setState({
      isVisible: false,
    });
  }
  goToTask = () => {
    console.log('task id', this.state.dateTask);
    this.hideDialog();
  }
  render() {
    return (
      <Container style={theme.container} isLoading={this.props.isLoading}>
        <Header style={{ backgroundColor: '#00A9E0', borderBottomWidth: 0 }} androidStatusBarColor='#00A9E0'>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.goBack()}>
              <Icon name='arrow-back' style={{ color: '#fff' }} />
            </Button>
          </Left>
          <Body style={[theme.centerAlign, { flex: 4 }]}>
            <Title style={{ color: '#fff', fontFamily: 'Montserrat-Bold' }} >{`My Calander`} </Title>
          </Body>
          <Right style={{ flex: 1 }}>
          </Right>
        </Header>
        <Content style={[theme.container]}>
          <Calendar
            style={{ margin: 10 }}
            dayComponent={({ date, state }) => {
              return (
                <DateView
                  date={date}
                  state={state}
                  dueDates={dueDates}
                  handleDayPress={this.handleDayPress}
                />
              );
            }}
          />
          {
            this.state.isVisible && (
              <Overlay isVisible={this.state.isVisible}
                onBackdropPress={() => this.hideDialog()}>
                <React.Fragment>
                  <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 10, marginTop: 30 }}>
                    <Text>{`${_get(this, 'state.dateTask.title', 'NA')}`}</Text>
                  </View>
                  <View style={{ backgroundColor: '#FFFFFF' }}>
                    <Button style={[theme.buttonNormal, { backgroundColor: '#47d7ac' }]} onPress={() => this.goToTask()} full>
                      <CustomBoldText style={theme.butttonFixTxt}>{`Go To Task`}</CustomBoldText>
                    </Button>
                  </View>
                </React.Fragment>
              </Overlay>
            )}
        </Content>
      </Container>
    );
  }
}

function DateView(props) {
  const { date, state, dueDates } = props;
  const dateTask = _find(dueDates, { 'dateString': date.dateString });
  const isSelected = !_isEmpty(dateTask);
  return (
    <TouchableHighlight style={{ flex: 1 }} onPress={() => isSelected? props.handleDayPress(date, dateTask): {}}>
      <View style={{ flex: 1, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: isSelected ? '#00A9E0': '#FFFFFF' }}>
        <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>
          {date.day}
        </Text>
        {
          !_isEmpty(dateTask) &&
          <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>
            {dateTask.title}
          </Text>
        }
      </View>
    </TouchableHighlight>
  );
}

export default MyCalanderView;
