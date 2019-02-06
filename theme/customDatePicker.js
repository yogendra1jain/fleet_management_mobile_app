import React from 'react'; // eslint-disable-line no-unused-vars
import { View, Text, TouchableHighlight, Button } from 'react-native';
// import { DatePicker } from 'native-base';
import { DatePicker } from '../components/stateless/DatePicker';
// import { FontAwesome } from '@expo/vector-icons';
import { getUSADate } from '../utils';
class CustomDatePicker extends React.Component {
    constructor(props) {
        super(props);
    }

    open = () => {
        this.refs.datePicker.showDatePicker();
    }

    render() {
        const { locals } = this.props;
        const stylesheet = locals.stylesheet;
        let formGroupStyle = stylesheet.formGroup.normal;
        let controlLabelStyle = stylesheet.controlLabel.normal;
        let helpBlockStyle = stylesheet.helpBlock.normal;
        const errorBlockStyle = stylesheet.errorBlock;
        if (locals.hasError) {
            formGroupStyle = stylesheet.formGroup.error;
            controlLabelStyle = stylesheet.controlLabel.error;
            helpBlockStyle = stylesheet.helpBlock.error;
        }

        const label = locals.label ? (
            <Text style={controlLabelStyle}>{locals.label}</Text>
        ) : null;
        const help = locals.help ? (
            <Text style={helpBlockStyle}>{locals.help}</Text>
        ) : null;
        const error =
            locals.hasError && locals.error ? (
                <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                    {locals.error}
                </Text>
            ) : null;

        return (
            <View style={formGroupStyle}>
                {label}
                <TouchableHighlight onPress={this.open}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', position: 'relative' }}>
                        {/* <FontAwesome name="calendar" size={18} color="blue" style={{ position: 'absolute', bottom: 5, right: 5 }} /> */}
                        {/* <Button onPress={this.open} title='Open' /> */}
                        {/* <Text onPress={this.open}> helllo world </Text> */}
                        {/* <TouchableHighlight onPress={this.open}> Hello </TouchableHighlight> */}
                        <DatePicker
                            ref='datePicker'
                            defaultDate={locals.value || new Date()}
                            minimumDate={locals.minimumDate}
                            maximumDate={locals.maximumDate}
                            locale={'en'}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={'fade'}
                            androidMode={'default'}
                            placeHolderText={locals.value ? getUSADate(locals.value) : 'Select Date'}
                            textStyle={{ color: '#000' }}
                            placeHolderTextStyle={{ color: '#bbbbbb', fontSize: 14 }}
                            onDateChange={locals.onChange}
                            style={{ height: 35 }}
                        />
                    </View>
                </TouchableHighlight>
                {help}
                {error}
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
                />
            </View>
        );
    }
}

function datepicker(locals) {
    if (locals.hidden) {
        return null;
    }

    return (
        <CustomDatePicker locals={locals} />
    );
}

export default datepicker;
