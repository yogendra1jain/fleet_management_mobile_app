
import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
 
import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';

import Pdf from 'react-native-pdf';


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
        return (
            <Container style={theme.container} isLoading={this.props.isLoading}>
                <Header style={{backgroundColor: '#00A9E0'}} androidStatusBarColor='#00A9E0'>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <View
                    style={[styles.container, { backgroundColor: '#ededed' }]}
                >
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
             </View>
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