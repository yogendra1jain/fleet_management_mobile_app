import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';

function checkbox(locals) {
    if (locals.hidden) {
        return null;
    }
    let stylesheet = locals.stylesheet;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    let errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
        controlLabelStyle = stylesheet.controlLabel.error;
        helpBlockStyle = stylesheet.helpBlock.error;
    }

    let label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    let help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    let error =
        locals.hasError && locals.error ? (
            <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
                {locals.error}
            </Text>
        ) : null;

    return (
        <View>
            {label}
            <RadioGroup
                onSelect={(index, value) => locals.onPress(index, value)}
            >
                <RadioButton value={'Subcutaneous'} >
                    <Text>{locals.options[1].value}</Text>
                </RadioButton>

                <RadioButton value={'Tropical'}>
                    <Text>{locals.options[2].value}</Text>
                </RadioButton>


            </RadioGroup>

            {help}
            {error}
        </View>
    );
}

module.exports = checkbox;
