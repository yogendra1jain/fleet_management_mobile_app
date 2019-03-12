import React from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet, TouchableHighlight, TouchableOpacity, RefreshControl } from 'react-native';
import documentsImg from '../../assets/images/documentsImg.png';
// import Input from 'react-native-elements';
import { ListItem, Card } from 'react-native-elements';
import _get from 'lodash/get';

import theme from '../../theme';
import { Text, Container, Content, Header, Button, Title, Body, Left, Right, Icon } from 'native-base';
import withLoadingScreen from '../withLoadingScreen';
import withErrorBoundary from '../hocs/withErrorBoundary';
import { postData } from '../../actions/commonAction';
import { showToast } from '../../utils';
import withLocalization from '../hocs/withLocalization';

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

const getDocumentType = (type, strings) => {
    let typeValue = '';
    switch (type) {
        case 0:
            typeValue = `${strings.invalidDocType}`;
            break;
        case 1:
            typeValue = `${strings.titleDoc}`;
            break;
        case 2:
            typeValue = `${strings.insuranceDoc}`;
            break;
        case 3:
            typeValue = `${strings.registrationDoc}`;
            break;
        case 4:
            typeValue = `${strings.inspectionDoc}`;
            break;
        default:
            typeValue = `${strings.invalidDocType}`;
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
            init: 'GET_ASSET_DOCUMENTS_INIT',
            success: 'GET_ASSET_DOCUMENTS_SUCCESS',
            error: 'GET_ASSET_DOCUMENTS_ERROR',
        };
        let data = {
            id: _get(this.props, 'userDetails.checkedInto.id', ''),
        };
        let identifier = 'GET_ASSET_DOCUMENTS';
        let key = 'assetDocuments';
        this.props.postData(url, data, constants, identifier, key)
            .then((data) => {
                console.log('asset documents fetched successfully.', data);
                showToast('success', `${this.props.strings.docFetchSuccessMsg}.`, 3000);
            }, (err) => {
                console.log('error while fetching asset documents', err);
            });
    }
    handleDocumentItem = (item, index) => {
        this.setState({
            selectedIndex: index,
        });
    }
    _onRefresh = () => {
        this.loadAssetDocuments();
    }

    render() {
        const { assetDocuments, strings } = this.props;
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
                        <Title style={{ color: '#fff' }} >{`${strings.documentButton}`}</Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onRefresh}
                        />
                    }
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
                                <Text>{`${strings.documentButton}`}</Text>
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
                                    title={getDocumentType(l.documentType, strings)}
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
    let { appLanguage } = commonReducer || 'en';
    let { assetDocuments } = commonReducer || [];

    return {
        decodedToken,
        userDetails,
        assetDocuments,
        appLanguage,
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

export default withErrorBoundary()(connect(mapStateToProps, mapDispatchToProps)(withLocalization(DocumentsHomeScreen)));
