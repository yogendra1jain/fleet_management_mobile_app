import React from 'react';
// import CodeInput from 'react-native-confirmation-code-input';
import CodeInput from 'react-native-code-input';

function NativePinEntry(props) {
    return (
        <CodeInput
            keyboardType="numeric"
            codeLength={6}
            inputPosition='center'
            borderType={'underline'}
            // className='border-circle'
            activeColor='rgba(49, 180, 4, 1)'
            inactiveColor='rgba(49, 180, 4, 1.3)'
            compareWithCode={props.compareWith}
            autoFocus={true}
            codeInputStyle={{ fontWeight: '800' }}
            onFulfill={props.consumePinEntry}
        />
    );
}

export default NativePinEntry;
