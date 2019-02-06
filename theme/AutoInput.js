import React from 'react';
import { View, Text, TouchableOpacity, InteractionManager } from 'react-native';
import t from 'tcomb-form-native';
import Autocomplete from 'react-native-autocomplete-input';

const Component = t.form.Component;

class AutoInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: [],
            propForQuery: '',
            query: '',
        };
        this.localsOnChange = null;
        this.getTemplate = this.getTemplate.bind(this);

        InteractionManager.runAfterInteractions(() => {
            const locals = super.getLocals();
            const { config: { elements, propForQuery } } = locals;
            const query = this.props.value;
            this.setState({ elements, propForQuery, query });
            locals.onChange(query);
        });
    }

    getLocals() {
        return super.getLocals();
    }

    getTemplate() {
        return function(locals) {
            const { query } = this.state;
            const elements = this.findElement(query);
            const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

            return (
                <View style={styles.container}>
                    <Text style={locals.stylesheet.controlLabel.normal}>{locals.label}</Text>
                    <Autocomplete
                        autoCorrect={false}
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 5,
                            height: 36,
                            fontSize: 17,
                            padding: 7,
                        }}
                        inputContainerStyle={styles.inputContainerStyle}
                        data={
                            elements.length === 1 && comp(query, elements[0].name)
                                ? []
                                : elements
                        }
                        defaultValue={query}
                        onChangeText={(text) => {
                            this.setState({ query: text });
                            locals.onChange(text);
                        }}
                        placeholder={locals.label}
                        renderItem={({ name }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ query: name });
                                    locals.onChange(name);
                                }}
                            >
                                <Text style={styles.itemText}>{name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            );
        }.bind(this);
    }

    findElement(query) {
        if (query === '' || !query) {
            return [];
        }

        const { elements } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return elements.filter(element => element.name.search(regex) >= 0);
    }
}

const styles = {
    container: {
        flex: 1,
        // backgroundColor: '#F5FCFF',
    },
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontSize: 17,
        height: 36,
        padding: 12,
        borderRadius: 5,
    },
    inputContainerStyle: {
        borderRadius: 4,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 18,
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
};

AutoInput.transformer = {
    format: (value) => {
        return value;
    },
    parse: (value) => {
        return value;
    },
};

export default AutoInput;
