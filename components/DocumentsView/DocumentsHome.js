import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import documentsImg from '../../assets/images/documentsImg.png';
// import Input from 'react-native-elements';
import { ListItem, Card } from 'react-native-elements';
import _get from 'lodash/get';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { postData } from '../../actions/commonAction';

const ContainerWithLoading = withLoadingScreen(Container);

const list = [
    {
      name: 'Title Docs',
      icon: 'file-pdf-o',
      type: 'font-awesome',
      subtitle: '',
    },
    {
      name: 'Registration Docs',
      icon: 'file-pdf-o',
      type: 'font-awesome',
      subtitle: '',
    },
    {
        name: 'Insurance Card',
        icon: 'file-pdf-o',
        type: 'font-awesome',
        subtitle: '',
    },
    {
        name: 'Upload Invoice/ Document',
        icon: 'camera',
        type: 'font-awesome',
        subtitle: '',
      },
  ];

const getDocumentType = (type) => {
    let typeValue = '';
    switch (type) {
        case 0:
            typeValue = "INVALID DOCUMENT TYPE";
            break;
        case 1:
            typeValue = "TITLE DOCUMENT";
            break;
        case 2:
            typeValue = "INSURANCE DOCUMENT";
            break;
        case 3:
            typeValue = "REGISTRATION DOCUMENT";
            break;
        case 4:
            typeValue = "INSPECTION CERTIFICATE";
            break;
        default:
            typeValue = "INVALID DOCUMENT TYPE";
            break;
    }
    return typeValue;
}

class DocumentsHomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: '',
        };
    }
    static navigationOptions = {
        header: null,
    };

    componentWillUnmount() {
    }
    componentDidMount() {
        this.loadAssetDocuments();
    }
    loadAssetDocuments = () => {
        let url = `/Assets/GetMandatoryDocuments`;
        let constants = {
            init: 'ASSET_DOCUMENTS_INIT',
            success: 'ASSET_DOCUMENTS_SUCCESS',
            error: 'ASSET_DOCUMENTS_ERROR',
        };
        let data = {
            id: _get(this.props, 'userDetails.checkedInto.id', ''),
        };
        let identifier = 'ASSET_DOCUMENTS';
        let key = 'assetDocuments';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('asset documents fetched successfully.', data);
            }, (err) => {
                console.log('error while fetching asset documents', err);
            });
    }
    handleDocumentItem = (item, index) => {
        this.setState({
            selectedIndex: index,
        });
    }

    render() {
        const { assetDocuments } = this.props;
        const { selectedIndex } = this.state;
        return (
            <ContainerWithLoading style={theme.container} isLoading={this.props.isLoading}>
                <Header >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#fff' }} />
                        </Button>
                    </Left>
                    <Body style={[theme.centerAlign, { flex: 4 }]}>
                        <Title style={{ color: '#fff' }} >Documents</Title>
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
                                <Image source={documentsImg} style={styles.profileImg} />
                            </TouchableHighlight>
                            <View style={[theme.centerAlign, { paddingTop: 10 }]}>
                                <Text>Documents</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingTop: 15 }}>
                            <View style={{ flex: 1 }}>
                            {
                                assetDocuments && assetDocuments.map((l, i) => (
                                <React.Fragment key={i}>
                                <ListItem
                                    key={i}
                                    // rightIcon={{ name: 'camera', type: 'font-awesome' }}
                                    title={getDocumentType(l.documentType)}
                                    subtitle={l.subtitle}
                                    onPress={()=>this.handleDocumentItem(l, i)}
                                />
                                {
                                    selectedIndex === i &&
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                                            onPress={() => {}} >
                                            <Card wrapperStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} containerStyle={{ flex: 1, marginRight: 8 }}>
                                                <Image source={{uri: l.link}} style={{ width: 110, height: 109 }} />
                                            </Card>
                                        </TouchableOpacity>
                                    </View>
                                }
                                </React.Fragment>
                                ))
                            }
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
    let { commonReducer } = state || {};
    let { userDetails } = commonReducer || {};
    let { assetDocuments } = commonReducer || [];

    return {
        decodedToken,
        userDetails,
        assetDocuments,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        postData: (url, data, constants, identifier, key) => dispatch(postData(url, data, constants, identifier, key)),
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(DocumentsHomeScreen));
