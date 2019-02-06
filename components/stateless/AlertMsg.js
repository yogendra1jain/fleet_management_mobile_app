import React from 'react';
import { View } from 'react-native';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import theme from '../../theme';
function AlertMsg(props) {
    if (props.warning) {
        return (
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <View style={[{ paddingRight: 5, paddingTop: 3 }]}>
                    <Entypo name="warning"
                        size={19} color="#e85d00" />
                </View>
                <View style={{ flex: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={[theme.textgray, { justifyContent: 'flex-start', fontWeight: 'bold', fontSize: 10, flexWrap: 'wrap', paddingTop: 2 }]} >{`${props.message}`}</Text>
                </View>
            </View>
        );
    } else if (props.info) {
        return (
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <View style={[{ paddingRight: 5, paddingTop: 3 }]}>
                    <Feather name="info"
                        size={19} color={'#05549d'} />
                </View>
                <View style={{ flex: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={[theme.textgray, { justifyContent: 'flex-start', fontWeight: 'bold', fontSize: 10, flexWrap: 'wrap', paddingTop: 2 }]} >{`${props.message}`}</Text>
                </View>
            </View>
        );
    } else if (props.error) {
        return (
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <View style={[{ paddingRight: 5, paddingTop: 3 }]}>
                    <MaterialIcons name="error"
                        size={19} color={'#ed3237'} />
                </View>
                <View style={{ flex: 1, flexWrap: 'wrap' }}>
                    <Text style={[theme.textgray, { justifyContent: 'flex-start', fontWeight: 'bold', fontSize: 10, color: '#ed3237', flexWrap: 'wrap', paddingTop: 2 }]} >{`${props.message}`}</Text>
                </View>
            </View>
        );
    } else {
        return (
            <Text></Text>
        );
    }
}

export default AlertMsg;

