import React from 'react'

import {
  View, StyleSheet, Image
} from 'react-native';
import NewMorph from './NewMorph'

const BLACK_COLOR = "rgb(49,51,67)"

export default class Progress extends React.Component {
  render () {

    let width = this.props.width
    let h1 = width * 8
    let h2 = this.props.percent * 8 * width


    return (
      <NewMorph size={width + 10} radius={8} color2={"#373a4c"} color1={"#2b2c3a"}>
        <View style={{
          width: width + 10,
          height: h1,
          borderRadius: 14.5,
          backgroundColor: "#383a47",
          ...styles.progress
        }}>
          <Image style={{
            width: width,
            height: h2,
            minHeight: 2,
            borderRadius: 12,
            backgroundColor: "red"
          }}
          source={require("../Images/progress.png")}
          />
        </View>
      </NewMorph>
    )
  }
}
const styles = StyleSheet.create({
  progress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "flex-end",
    justifyContent: 'flex-end',
    borderWidth: 5,
    borderColor: '#3c3e52'
  }
})
