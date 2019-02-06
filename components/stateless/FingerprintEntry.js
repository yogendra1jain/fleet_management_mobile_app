import React from 'react';
import { View, Text } from 'react-native';
import theme from '../../theme';
import { Button } from 'native-base';

function FingerprintEntry(props) {
    return (
        <View>
            <Text>Fingerprint Entry</Text>
            {props.error && props.waitTime == 0 && <Text>Incorrect scan! Please scan again.</Text>}
            {props.waitTime > 0 && <Text>Locked Out Because of too many Incorrect Scans. Wait for {props.waitTime} secs</Text>}
            {
                props.isScanFingerPrint &&
                <Button style={theme.buttonNormal} onPress={() => props.onPress()} full>
                    <Text style={theme.butttonFixTxt}>SCAN NOW</Text>
                </Button>
            }
        </View>

    );
}

export default FingerprintEntry;
