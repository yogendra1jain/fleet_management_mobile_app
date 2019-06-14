import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';
import theme from '../../theme';
import { ShowTitle } from './ShowTitle';
import moment from 'moment';

function TaskView(props) {
  return (
    <View key={props.index} style={[theme.bgWhite, { flex: 1, flexDirection: 'row', marginBottom: 15, paddingBottom: 6 }]}>
      <View style={{ backgroundColor: '#ddd', borderRadius: 25, width: 40, height: 40, marginLeft: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', paddingLeft: 8, paddingTop: 10 }} >{`# ${_get(props, 'index', '')+1}`}</Text>
      </View>
      <View style={[theme.alignRight, theme.directionRow]}>
        <TouchableOpacity style={[{ flex: 1, flexDirection: 'column' }]} onPress={() => props.onPress()}>
          <View style={{ paddingLeft: 25 }}>
            <ShowTitle
              title={`Task: ${_get(props, 'task.id', '')}`}
              maxChar={20}
            />
          </View>
          <View style={{ paddingLeft: 25 }}>
            <Text style={{ fontSize: 14, color: 'gray' }} >{`Ticket Id: `}<Text style={{ fontSize: 14, color: 'black' }} >{`${_get(props, 'task.ticket.label', 'NA')}`}</Text></Text>
          </View>
          <View style={{ paddingLeft: 25 }}>
            <Text style={{ fontSize: 14, color: 'gray' }} >{`Asset Id: `}<Text style={{ fontSize: 14, color: 'black' }} >{`${_get(props, 'task.asset.label', '')}`}</Text></Text>
          </View>
          <View style={{ paddingLeft: 25 }}>
            <Text style={{ fontSize: 14, color: 'gray' }} >{`Due Date: `}<Text style={{ fontSize: 14, color: 'black' }} >{`${moment.unix(_get(props, 'task.dueDate.seconds', 0)).format('MM-DD-YYYY')}`}</Text></Text>
          </View>
          <View style={{ paddingLeft: 25 }}>
            <Text style={{ fontSize: 14, color: 'gray' }} >{`Mechanic: `}<Text style={{ fontSize: 14, color: 'black' }} >{`${_get(props, 'task.destination.destination.label', '')}`}</Text></Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TaskView;
