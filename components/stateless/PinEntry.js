import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
// import CodeInput from 'react-native-confirmation-code-input';
import CodeInput from 'react-native-code-input';

function PinEntry(props) {
    return (
        <View>
            <CodeInput
            keyboardType="numeric"
            codeLength={6}
            secureTextEntry
            inputPosition='center'
            borderType={'underline'}
            // className='border-circle'
            activeColor='rgba(49, 180, 4, 1)'
            inactiveColor='rgba(49, 180, 4, 1.3)'
            autoFocus={true}
            codeInputStyle={{ fontWeight: '800' }}
            onFulfill={props.onFill}
            />
            {props.error && <Text style={styles.errorText}>Wrong Pin! Please enter again</Text>}
        </View>
    );
}

export default PinEntry;

const styles = StyleSheet.create({
    errorText: {
        marginTop: 100,
    },
});
