import React from 'react';
import _get from 'lodash/get';
import { Text } from 'react-native-elements';

export const ShowTitle = (props) => {
  let titleLength = _get(props, 'title.length', 0);
  let titleText = props.title;
  if (titleLength > props.maxChar) {
    titleText = `${_get(props, 'title', '').substring(0, props.maxChar)}...`;
  }

  return (
    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }} >{`${titleText}`}</Text>
  );
};
