import React from 'react';
import { Text } from 'react-native';

const CustomBoldText = (props) => {
    return (
        <Text style={[props.style, { fontFamily: 'Montserrat-Bold' }]} >{props.children}</Text>
    );
};

export default CustomBoldText;
