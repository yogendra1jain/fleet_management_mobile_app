import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import _get from 'lodash/get';
import { Text, Card } from 'react-native-elements';
import { Button } from 'native-base';
import theme from '../../theme';
import CustomText from '../stateless/CustomText';
import CustomSemiBoldText from '../stateless/CustomSemiBoldText';

function AssetListView(props) {
  const { index, asset, strings, hideButton=true } = props;
  // console.log('asset data', asset);
  return (
    <View style={{ flex: 1 }} key={index}>
      <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
        onPress={() => props.handleAssetClick()} >
        <Card >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
              <CustomText style={{ fontWeight: 'normal', color: 'black' }}>{`${strings.assetId}`}</CustomText>
              <CustomSemiBoldText style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}> {_get(asset, 'assetId', '')}</CustomSemiBoldText>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 60, height: 40 }}>
                <ImageBackground resizeMethod="resize" style={{ width: 60, height: 40 }} source={{ uri: _get(asset, 'image', '') }} />
              </View>
            </View>
          </View>
          <React.Fragment>
            <View style={{ flex: 1, flexDirection: 'row', borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 10, marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`usage:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'usage', 0)}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Usage Since LastService:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'usageSinceLastService', 0)}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Location:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'flex-end' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', textAlign: 'right', fontSize: 14 }}> {_get(asset, 'location.label', '')}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Monthly GasExpense:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(asset, 'monthlyGasExpense', 0)}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`${strings.clockedInUserText}`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', textAlign: 'right', color: '#312783', fontSize: 14 }}> {_get(asset, 'clockedInUser.label', '') }</CustomText>
              </View>
            </View>
            {
              !hideButton &&
              <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                  <Button onPress={() => props.firstButtonClick(index, asset)} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                    <Text style={theme.buttonSmallTxt}>{props.firstButtonText}</Text>
                  </Button>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                  <Button onPress={() => props.secondButtonClick(index, asset)} style={[theme.buttonAlignBottom, { marginLeft: 0 }]} full>
                    <Text style={theme.buttonSmallTxt}>{props.secondButtonText}</Text>
                  </Button>
                </View>
              </View>
            }
          </React.Fragment>
        </Card>
      </TouchableOpacity>
    </View >
  );
}

export default AssetListView;
