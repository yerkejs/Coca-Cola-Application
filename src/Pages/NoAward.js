import React from 'react'
import {
  View, Text,StyleSheet,
  Image, ScrollView, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {LeaderBoard} from '../components/Charts'

const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

export default class NoAward extends React.Component {

  render () {
    let {point} = this.props
    let total = 30 + point - (point % 30)


    return (
      <SafeAreaView style={{flex: 1, backgroundColor: BLACK_COLOR}}>
        <View style={styles.container}>
          <View style={styles.header}>
              <Icon name="md-arrow-round-back" style={styles.backIcon} onPress={()=>this.props.navigation.goBack()}/>
              <Image
                style={styles.logo}
                source={require("../Images/logo.png")}
              />
          </View>
          <Text style={styles.title}>Достижения</Text>
          <Text style={styles.p}>Вас ждут огненные призы</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{paddingTop: 10}}
          >
              <View style={styles.musicWrapper}>
                  <Image
                    source={require("../Images/music.png")}
                    style={styles.musicImg}
                  />
                  <Text style={styles.musicText}>
                      Вам нужно набрать {total} монет, чтобы открыть топ-{total} песен
                  </Text>
              </View>
              <Text style={styles.smallerTitle}>Лидерборд</Text>
              <View style={{height: 200}}>
                <LeaderBoard
                  point={point}
                />
              </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK_COLOR,
    padding: 25, paddingTop: 8.5
  },
  backIcon: {
    fontSize: 30,
    height: 30,
    color: "#FFF"
  },
  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    fontFamily: "Ubuntu-Bold",
    marginTop: 20
  },
  smallerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1,
    fontFamily: "Ubuntu-Bold",
    marginTop: 20
  },
  p: {
    fontSize: 16,
    fontFamily: "Ubuntu-Medium",
    color: "#FFF",
    opacity: 0.8
  },
  musicWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15, marginBottom: 20
  },
  musicImg: {
    width: '60%',
    resizeMode: 'contain',
    height: 200
  },
  musicText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Ubuntu-Medium",
    color: "#FFF",
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    height: 40,
    width: 60,
    resizeMode: 'contain'
  }
});
