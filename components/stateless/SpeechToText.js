import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import Voice from 'react-native-voice';
import { Icon } from 'native-base';

export default class TextToSpeech extends React.Component {
    constructor(props) {
        super();
        this.state = {
            listening: false,
        };
        Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
        Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
        Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    }
    onStartButtonPressed = () => {
        Voice.start('en-US');
        this.setState({
            listening: true,
        });
    }
    onStopButtonPressed = () => {
        this.setState({
            listening: false,
        });
        Voice.stop();
    }
    onSpeechStartHandler = (e) => {
        console.log('e in speech start', e);
    }
    onSpeechEndHandler = (e) => {
        console.log('e in speech end', e);
    }
    onSpeechResultsHandler = (e) => {
        console.log('e in speech result', e);
        this.setState({
            listening: false,
        });
        if (this.props.handleTextToSpeech) {
            this.props.handleTextToSpeech(e);
        }
    }
    render() {
        const { listening } = this.state;
        return (
            
                <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    {
                        !listening ? <Icon onPress={() => this.onStartButtonPressed()} name="mic" type="Entypo" size={24} />
                        : <Icon onPress={() => this.onStopButtonPressed()} name="mic-off" type="Feather" size={24} />
                    }
                    <Text>{listening?'listening...': ''}</Text>
                </View>
        );
    }
}
