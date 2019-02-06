import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, Platform } from 'react-native';
import gasfillImg from '../../assets/images/gasfill.png';
// import Input from 'react-native-elements';
import _isEmpty from 'lodash/isEmpty';
import ImagePicker from 'react-native-image-picker';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
const ContainerWithLoading = withLoadingScreen(Container);


const options = {
    title: 'Select Photo',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

class GasFilUpHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {

    }
    handleDocumentItem = (item) => {
        console.log('item', item);
    }
    uploadImage = () => {
        // showAlert('This is for upload image', '');
        this.chooseImage('mileage Pic');
    }

    chooseImage = (title) => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                response.title = title;
                response.owner = 'operator';
                if (Platform.OS == 'ios') {
                    //    fileName = 'Image'+ new Date().toString() + '.jpg';
                    let strs = response.uri.split('/');
                    response.fileName = strs[strs.length - 1];
                    response.type = 'image/jpeg';
                }
                this.setFile(response);
            }
        });
    }
    setFile = (res) => {
        const { uri, type: mimeType, fileName } = res || {};
        this.setState({
            imageSource: uri,
            fileName: fileName,
            uploadingFile: true,
        });
        const formData = new FormData();
        formData.append('file', { uri, type: mimeType, name: fileName });
        if (uri && !_isEmpty(uri)) {
            console.log('data to be upload', formData);
            // this.props.uploadDoc(formData, res);
        }
    }

    render() {
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >Gas Fil Up</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    style={{ backgroundColor: '#ededed' }}
                >
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={[theme.centerAlign, { marginTop: 25 }]}>
                            <TouchableHighlight
                                style={[styles.profileImgContainer, { borderColor: 'green', borderWidth: 1 }]}
                            >
                                <Image source={gasfillImg} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>Gas Fil Up</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <TouchableHighlight onPress={() => this.uploadImage()}>
                                <View style={[theme.centerAlign, { flex: 1, flexDirection: 'column', backgroundColor: '#ddd', margin: 20 }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text>Go To Camera</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name='ios-camera' />
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={[{ flex: 1, flexDirection: 'row', margin: 20 }]}>
                            <View style={{ justifyContent: 'flex-start' }}>
                                <Icon name='exclamation' type="FontAwesome" />
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#ddd', borderWidth: 1, flexWrap: 'wrap' }}>
                                <Text>
                                    {`Take a picture of the fuel Pump Display after completing fill up. The display Should show gallons and sales amount. Make sure that there is no sun glare or reflaction off the display when taking the photo.`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Content>
            </ContainerWithLoading>
        );
    }
}

function mapStateToProps(state) {
    let { decodedToken } = state.auth || {};
    let { userDetails } = state.user || {};

    return {
        decodedToken,
        userDetails,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const styles = StyleSheet.create({
    profileImgContainer: {
      marginLeft: 8,
      height: 120,
      width: 120,
      borderRadius: 40,
      borderWidth: 1,
    },
    profileImg: {
      height: 120,
      width: 120,
      borderRadius: 40,
    },
  });

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(GasFilUpHomeScreen));
