import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import _get from 'lodash/get';
import { Text, Card } from 'react-native-elements';
import { Button } from 'native-base';
import theme from '../../theme';

function AssetView(props) {
    const { index, asset, selectedIndex, strings } = props;
    return (
        <View style={{ flex: 1 }} key={index}>
        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
                    onPress={() => props.handleAssetClick(index, asset)} >
            <Card >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'normal', color: 'black' }}>{`${strings.assetId}:`}</Text>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}> {_get(asset, 'assetId', '')}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 60, height: 40 }}>
                            <ImageBackground resizeMethod="resize" style={{ width: 60, height: 40 }} source={{ uri: _get(asset, 'image', '') }} />
                        </View>
                        
                    </View>
                </View>
                {
                    selectedIndex === index &&
                    <React.Fragment>
                        <View style={{ flex: 1, flexDirection: 'row', borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 10, marginTop: 10 }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`${strings.make}:`}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'assetFields.make', '')}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`${strings.fuelType}:`}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'assetFields.fuelType', '')}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`${strings.model}:`}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end' }}>
                                <Text style={{ fontWeight: 'bold', color: '#312783', textAlign: 'right', fontSize: 14 }}> {_get(asset, 'assetFields.model', '')}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`${strings.engineDisplacement}:`}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'assetFields.engineDisplacement', '')}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal' }}>{`${strings.checkedInUserText}`}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', textAlign: 'right', color: '#312783', fontSize: 14 }}> {_get(asset, 'checkInInfo.operatorId') ? `${_get(props, 'userDetails.user.firstName', '')} ${_get(props, 'userDetails.user.lastName', '')}`: 'NA' }</Text>
                            </View>
                        </View>
                        {
                            _get(asset, 'checkInInfo.operatorId', 'NA') !== _get(props, 'decodedToken.FleetUser.id', '') ?
                            <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Button onPress={() => props.handleCheckIn(index, asset, true)} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                        <Text style={theme.buttonSmallTxt}>{`${strings.checkIn}`}</Text>
                                    </Button>
                                </View>
                            </View>:
                            <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Button onPress={() => props.handleCheckOut(index, asset, false)} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                                        <Text style={theme.buttonSmallTxt}>{`${strings.checkOut}`}</Text>
                                    </Button>
                                </View>
                            </View>
                        }
                    </React.Fragment>
                }
            </Card>
        </TouchableOpacity>
    </View >
    );
}

export default AssetView;
