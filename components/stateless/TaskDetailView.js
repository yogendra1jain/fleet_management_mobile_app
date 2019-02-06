import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';
import theme from '../../theme';
import { getCurrencySymbols } from '../../utils';

function OrderDetailView(props) {
    let { product } = props.orderPart;
    let { vendorProduct, price } = product;
    console.log('vendor product in order detail', vendorProduct);

    return (
        <View key={props.index} style={[theme.bgWhite, { marginBottom: 15, paddingBottom: 6 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 8, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 15, marginRight: 15 }} >
                <TouchableOpacity style={[{ flex: 1 }]} onPress={() => props.onPress()}>
                    <View >
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }} >{_get(vendorProduct, 'product.name', '')}</Text>
                    </View>
                </TouchableOpacity>
                <View style={[theme.alignRight, theme.directionRow, { width: 50 }]}>

                </View>
            </View>
            <TouchableOpacity onPress={() => props.onPress()}>
                <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }} >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5 }} >
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}><Text style={[theme.textgray, { justifyContent: 'flex-start' }]} >{`Total Price`}</Text></View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}><Text style={[theme.textblack, { justifyContent: 'flex-end' }]}>{`${getCurrencySymbols(_get(price, 'totalPrice.currency'))} ${_get(price, 'totalPrice.amount')}`}</Text></View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 5 }} >
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}><Text style={[theme.textgray, { justifyContent: 'flex-start' }]} >{`Location`}</Text></View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}><Text style={[theme.textblack, { justifyContent: 'flex-end' }]}>{`${(_get(vendorProduct, 'locationName', ''))}`}</Text></View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onPress()}>
                <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }} >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5 }} >
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{ uri: `${_get(vendorProduct, 'product.images[0]', '')}` }}
                             />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default OrderDetailView;
