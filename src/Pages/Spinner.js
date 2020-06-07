import React from 'react'

import {
  View, Image, StyleSheet,
  ActivityIndicator, Animated
} from 'react-native';

export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.shakeAnimation = new Animated.Value(0)
  }

  componentDidMount () {
      Animated.loop(
          Animated.sequence([
            Animated.timing(
              this.shakeAnimation,
              {
                toValue: 1,
                duration: 250
              }
            ),
            Animated.timing(
              this.shakeAnimation,
              {
                toValue: -1,
                duration: 500
              }
            ),
            Animated.timing(
              this.shakeAnimation,
              {
                toValue: 0,
                duration: 250
              }
            )
          ])
      ).start()
  }
  render () {
    return (
      <View style={styles.spinnerView}>

            <Animated.Image source={require("../Images/spinner.png")}
              style={{
                ...styles.spinner,
                transform: [{
                  rotate: this.shakeAnimation.interpolate({
                    inputRange: [-1, 1],
                    outputRange: ['-0.5rad', '0.5rad']
                  })
                }]
              }}
            />
      </View>
    )
  }
}

const styles = StyleSheet.create ({
   spinnerView: {
     width: '100%',
     height: '100%',
     position: 'absolute',
     zIndex: 3,
     top: 0, left: 0,
     marginTop: 0,
     backgroundColor: 'rgba(255,0,0,0.8)',
     display: 'flex', alignItems:'center',
     justifyContent: 'center'
   },
   spinner: {
     position: 'absolute',
     width: 80,
     resizeMode: 'contain',
     tintColor: '#FFF'
   }
})
