import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';
import theme from '../../theme';
import { ShowTitle } from './ShowTitle';
import { getUSADateTime, getRenamedStatus } from '../../utils';

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
                            title={_get(props, 'task.taskTitle', '')}
                            maxChar={20}
                        />
                    </View>
                    <View style={{ paddingLeft: 25 }}>
                        <Text style={{ fontSize: 14, color: 'black' }} >{`${_get(props, 'task.taskDesc', '')}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity onPress={() => props.onPress()}>
                <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }} >
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', paddingBottom: 5, paddingTop: 5 }} >
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}><Text style={[theme.textgray, { justifyContent: 'flex-start' }]} >{`Order Date`}</Text></View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}><Text style={[theme.textblack, { justifyContent: 'flex-end' }]}>{getUSADateTime(_get(props, 'order.orderDate', ''))}</Text></View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 5 }} >
                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}><Text style={[theme.textgray, { justifyContent: 'flex-start' }]} >{`Status`}</Text></View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}><Text style={[theme.textblack, { justifyContent: 'flex-end' }]}>{`${getRenamedStatus(_get(props, 'order.status', ''))}`}</Text></View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity> */}
        </View>
    );
}

export default TaskView;


{/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 8, paddingTop: 8, marginLeft: 15 }} >
                <TouchableOpacity style={[{ flex: 1, flexDirection: 'row' }]} onPress={() => props.onPress()}>
                    <View style={{ backgroundColor: '#ddd', borderRadius: 25, width: 40, height: 40 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', paddingLeft: 8, paddingTop: 10 }} >{`# ${_get(props, 'index', '')}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[theme.alignRight, theme.directionRow]}>
                <TouchableOpacity style={[{ flex: 1, flexDirection: 'column' }]} onPress={() => props.onPress()}>
                    <View style={{ paddingLeft: 25 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }} >{`${_get(props, 'task.taskTitle', '')}`}</Text>
                    </View>
                    <View style={{ paddingLeft: 25 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }} >{`${_get(props, 'task.taskDesc', '')}`}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}