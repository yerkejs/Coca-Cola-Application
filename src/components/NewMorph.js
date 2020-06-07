import React, {
  Component,
} from 'react';
import {
  View, StyleSheet
} from 'react-native';

export default NewMorph = ({children, size, color1, color2, radius}) => {
  return (
    <View style={{
      ...shadowStyles.topShadow,
      shadowColor: color2 || "#c31a24",
      shadowOffset: {
        width: -radius || -6,
        height: -radius || -6
      },
      shadowRadius: radius || 6
    }}>
      <View style={{
        ...shadowStyles.bottomShadow,
        shadowColor: color1 || "#ff2330",
        shadowOffset: {
          width: -radius || 6,
          height: -radius || 6
        },
        shadowRadius: radius || 6
      }}>
          <View style={[
            shadowStyles.inner,
            {width: size || 40, borderRadius: size / 20 || 40 / 2}
          ]}>
            {children}
          </View>
      </View>
    </View>
  )
}

const shadowStyles = StyleSheet.create({
  topShadow: {
    shadowOffset: {
      width: -6,
      height: -6
    },
    shadowOpacity: 1,
    shadowRadius: 6
  },
  bottomShadow: {
    shadowOffset: {
      width: 6,
      height: 6
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowColor: "#ff2330"
  }
})
