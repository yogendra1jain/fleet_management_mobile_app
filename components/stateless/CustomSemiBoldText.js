import React from 'react';
import { Text } from 'react-native';

const CustomSemiBoldText = (props) => {
    return (
        <Text style={[props.style, { fontFamily: 'Montserrat-SemiBold' }]} >{props.children}</Text>
    );
};

export default CustomSemiBoldText;
