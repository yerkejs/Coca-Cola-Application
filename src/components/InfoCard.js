import React from 'react';

import {
  View,
  StyleSheet,
  ImageBackground, Text, TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'contain',
    flexDirection: 'row',
    resizeMode: 'contain',
    fontFamily: "Ubuntu-Bold"
  },
  leftPane: {
    flex: 1,
    padding: 16,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  rightPane: {
    flex: 2,
    padding: 16,
    paddingRight: 20,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '900',
    fontFamily: "Ubuntu-Bold"
  },
  des: {
    fontSize: 20,
    color: '#fff',
    marginTop: -5,
    fontFamily: "Ubuntu-Bold"
  },
  point: {
    fontSize: 70,
    color: '#fff',
    fontWeight: '900',
    fontFamily: "Ubuntu-Bold"
  },
  line: {
    height: 2,
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 10
  }
});
////onPress

export default class InfoCard extends React.Component {
  componentDidMount () {

  }
  render () {
    let {onPress, opened, week, data} = this.props
    let dayCount = Object.keys(this.props.data).length
    var dayText = dayCount == 1 ? "1 день" : dayCount > 5 ? dayCount + " дня" : dayCount + " дней"
    return (
      <TouchableOpacity style={{...styles.container, padding: opened ? 10 : 0}} onPress={onPress}>
          <ImageBackground
            style={styles.container}
            resizeMode="contain"
            source={require('../Images/cocacola.png')}>
              <View style={styles.leftPane}>
                <Text style={styles.point}>{this.props.coins}</Text>
              </View>
              <View style={styles.rightPane}>
                 <Text style={styles.title}>{week}</Text>
                 <Text style={styles.des}>{dayText}</Text>
                 <View style={styles.line} />
              </View>
          </ImageBackground>
      </TouchableOpacity>
    )
  }
}
