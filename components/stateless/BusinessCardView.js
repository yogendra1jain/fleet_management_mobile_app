import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import _get from 'lodash/get';
import { Text, Card } from 'react-native-elements';
import { Button } from 'native-base';
import theme from '../../theme';
import CustomText from './CustomText';
import CustomSemiBoldText from './CustomSemiBoldText';

function BusinessCardView(props) {
  const { index, cardData, strings, selectedIndex, hideButton=true } = props;
  // console.log('asset data', asset);
  return (
    <View style={{ flex: 1 }} key={index}>
      <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
        onPress={() => props.handleCardClick()} >
        <Card containerStyle={{ backgroundColor: cardData.id == selectedIndex? '#00A9E0': '#FFFFFF' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
              <CustomText style={{ fontWeight: 'normal', color: 'black' }}>{`Name`}</CustomText>
              <CustomSemiBoldText style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}> {_get(cardData, 'name', '')}</CustomSemiBoldText>
            </View>
          </View>
          <React.Fragment>
            <View style={{ flex: 1, flexDirection: 'row', borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 10, marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Phone:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(cardData, 'phone', 0)}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Address:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {`${_get(cardData, 'address.city', '')}, ${_get(cardData, 'address.state', '')}, ${_get(cardData, 'address.country', '')}`}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Services:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', textAlign: 'right', fontSize: 14 }}> {`${_get(cardData, 'services[0]', '')}, ${_get(cardData, 'services[1]', '')}, ${_get(cardData, 'services[2]', '')} ...`}</CustomText>
              </View>
            </View>
          </React.Fragment>
        </Card>
      </TouchableOpacity>
    </View >
  );
}

export default BusinessCardView;
