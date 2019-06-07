import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import _get from 'lodash/get';
import { Text, Card } from 'react-native-elements';
import { Button } from 'native-base';
import theme from '../../theme';
import CustomText from '../stateless/CustomText';
import CustomSemiBoldText from '../stateless/CustomSemiBoldText';

function ServiceTicketSummeryView(props) {
  const { index, ticket, strings, hideButton=true } = props;
  // console.log('asset data', asset);
  return (
    <View style={{ flex: 1 }} key={index}>
      <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }}
        onPress={() => props.handleTicketClick()} >
        <Card >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
              <CustomText style={{ fontWeight: 'normal', color: 'black' }}>{`Ticket Id`}</CustomText>
              <CustomSemiBoldText style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}> {_get(ticket, 'id', '')}</CustomSemiBoldText>
            </View>
          </View>
          <React.Fragment>
            <View style={{ flex: 1, flexDirection: 'row', borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 10, marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Asset Id:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(ticket, 'asset.label', '')}</CustomText>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={{ fontWeight: 'normal' }}>{`Description:`}</CustomText>
              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', paddingLeft: 10 }}>
                <CustomText style={{ fontWeight: 'bold', color: '#312783', fontSize: 14 }}> {_get(ticket, 'description', 0)}</CustomText>
              </View>
            </View>
          </React.Fragment>
        </Card>
      </TouchableOpacity>
    </View >
  );
}

export default ServiceTicketSummeryView;
