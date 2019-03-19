
import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
 
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';

import PDFView from 'react-native-view-pdf';

export default class PdfViewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.uri = this.props.navigation.getParam('uri', '');
    }
    static navigationOptions = {
        header: null,
    };
    render() {
        const source = {uri: this.uri,cache:true};
        console.log('uri used', this.uri);
        return (
            <Container style={theme.container} isLoading={this.props.isLoading}>
                {/* <Header >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header> */}
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                <PDFView
                    fadeInDuration={250.0}
                    style={{ flex: 1 }}
                    resource={this.uri}
                    resourceType={'url'}
                    onLoad={(data) => console.log(`PDF rendered from url, `, (data))}
                    onError={(error) => console.log('Cannot render PDF', error)}
                    />
             </Content>
            </Container>
        )
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});