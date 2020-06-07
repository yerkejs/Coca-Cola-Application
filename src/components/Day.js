import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';



export default ({ onPress }) => (
  <View
    style={{
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      backgroundColor: 'blue',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: '#BDC2C9',
    }}
  >
    <View style={{ flex: 1 }}>
    </View>

    <View style={{ flex: 1 }}>

    </View>

  </View>
);
