import React from 'react'; // eslint-disable-line no-unused-vars
import { View, Text } from 'react-native';
import { Picker } from 'native-base';

function select(locals) {
  if (locals.hidden) {
    return null;
  }

  let stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let selectStyle = Object.assign(
    {},
    stylesheet.select.normal,
    stylesheet.pickerContainer.normal
  );
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    selectStyle = stylesheet.select.error;
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

  let options = locals.options.map(({ value, text }) => {
      if (text === '-') {
          text = 'Select option';
      }
      return (<Picker.Item key={value} value={value} label={text} />);
  });

  return (
    <View style={formGroupStyle}>
       {label}
         <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Picker
                accessibilityLabel={locals.label}
                ref="input"
                style={{ height: 35 }}
                placeHolderTextStyle={{ fontSize: 13 }}
                selectedValue={locals.value}
                onValueChange={locals.onChange}
                help={locals.help}
                enabled={!locals.disabled}
                mode={locals.mode}
                prompt={locals.prompt}
                itemStyle={locals.itemStyle}
            >
                {options}
            </Picker>
        </View>
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

export default select;
