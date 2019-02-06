import React from 'react';
import theme from '../../theme';
import {
    Modal,
    View,
    Platform,
    DatePickerIOS,
    DatePickerAndroid,
} from 'react-native';
import { Text } from 'native-base';
import variable from '../../node_modules/native-base/src/theme/variables/platform';
import { Button } from 'native-base';

export class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }
    getInitialState = () => {
        return {
            modalVisible: false,
            defaultDate: new Date(),
            chosenDate: undefined,
        };
    }
    clearDate = () => {
        this.setDate(undefined);
        this.setState(this.getInitialState());
    }

    componentDidMount = () => {
        this.setState({
            defaultDate: this.props.defaultDate ? this.props.defaultDate : new Date(),
        });
    };

    setDate(date) {
        this.setState({ chosenDate: new Date(date) });
        if (this.props.onDateChange) {
            this.props.onDateChange(date);
        }
    }

    showDatePicker() {
        if (Platform.OS === 'android') {
            this.openAndroidDatePicker();
        } else {
            this.setState({ modalVisible: true });
        }
    }

    async openAndroidDatePicker() {
        try {
            const newDate = await DatePickerAndroid.open({
                date: this.state.chosenDate
                    ? this.state.chosenDate
                    : this.state.defaultDate,
                minDate: this.props.minimumDate,
                maxDate: this.props.maximumDate,
                mode: this.props.androidMode,
            });
            const { action, year, month, day } = newDate;
            if (action === 'dateSetAction') {
                let selectedDate = new Date(year, month, day);
                this.setState({ chosenDate: selectedDate });
                this.props.onDateChange(selectedDate);
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }

    render() {
        const variables = this.context.theme
            ? this.context.theme['@@shoutem.theme/themeStyle'].variables
            : variable;
        return (
            <View>
                <View>
                    <Text
                        onPress={this.showDatePicker.bind(this)}
                        style={[
                            { padding: 10, color: variables.datePickerTextColor },
                            this.state.chosenDate ? this.props.textStyle : this.props.placeHolderTextStyle,
                        ]}
                    >
                        {this.state.chosenDate
                            ?
                            (this.state.chosenDate.getMonth() + 1) +
                            '/' + this.state.chosenDate.getDate() +
                            '/'
                            +this.state.chosenDate.getFullYear()
                            : this.props.placeHolderText
                                ? this.props.placeHolderText
                                : 'Select Date'}
                    </Text>
                    <View>
                        <Modal
                            animationType={this.props.animationType}
                            transparent= {false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { }}
                        >
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <Text
                                    style={[
                                        { color: variables.datePickerTextColor, paddingBottom: 100, fontSize: 18, fontWeight: 'bold' },
                                        this.state.chosenDate ? this.props.textStyle : this.props.placeHolderTextStyle,
                                    ]}
                                >
                                    {this.state.chosenDate
                                        ?
                                        (this.state.chosenDate.getMonth() + 1) +
                                        '/' + this.state.chosenDate.getDate() +
                                        '/'
                                        +this.state.chosenDate.getFullYear()
                                        : this.props.placeHolderText
                                            ? this.props.placeHolderText
                                            : 'Select Date From Calender '}
                                </Text>
                                </View>
                                <View style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#aeaeae', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
                                <Button style={[{ }, theme.buttonNormal]} onPress={() => this.clearDate()} full>
                                    <Text style={theme.butttonFixTxt}>CLEAR</Text>
                                </Button>
                                <Button style={[{ }, theme.buttonNormal]} onPress={() => this.setState({ modalVisible: false, iosDatePickerClosed: true })} full>
                                    <Text style={theme.butttonFixTxt}>DONE</Text>
                                </Button>
                                </View>
                            <DatePickerIOS
                                date={
                                    this.state.chosenDate
                                        ? this.state.chosenDate
                                        : this.state.defaultDate
                                }
                                onDateChange={this.setDate.bind(this)}
                                minimumDate={this.props.minimumDate}
                                maximumDate={this.props.maximumDate}
                                mode="date"
                                locale={this.props.locale}
                                timeZoneOffsetInMinutes={this.props.timeZoneOffsetInMinutes}
                            />
                        </Modal>
                    </View>
                </View>
            </View>
        );
    }
}
