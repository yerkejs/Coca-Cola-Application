import React from 'react'
import {
  View, Text, StyleSheet,
  Image, TouchableOpacity,
  Dimensions
} from 'react-native'
import PaperOnboarding from 'react-native-paper-onboarding';

const screenWidth = Math.round(Dimensions.get('window').width);
const BLACK_COLOR = "rgb(42,43,57)"
const RED_COLOR = "rgb(229,30,42)"

var currentScreen = 0

class Template extends React.Component {
  render () {
    let {image, title, des, mode} = this.props
    let colors = [BLACK_COLOR, RED_COLOR]

    return (
      <View style={{
        ...styles.container,
        backgroundColor: colors[mode]
      }}>
        <Image
          blurRadius={0}
          source={image}
          style={styles.image}
          resizeMode={'contain'}
        />
        <View style={styles.textContainer}>
          <Text
            style={{
              ...styles.textTitle,
              color: colors[1 - mode]
            }}
          >
            {title}
          </Text>
          <Text style={styles.lilText}>
            {des}
          </Text>
        </View>
      </View>
    )
  }
}


class Screen extends React.Component {
  componentDidMount () {
    currentScreen = 0
  }
  render () {
    return (
      <Template
        image={require('../Images/screen1.png')}
        mode={0}
        title="Собирайте бутылки"
        des="Для каждой бутылки вы получите балл, поэтому ищите Coca-Cola."
      />
    )
  }
}
class Screen2 extends React.Component {
  componentDidMount () {
    currentScreen = 1
  }
  render () {
    return (
      <Template
        image={require('../Images/screen2.png')}
        mode={1}
        title="Получайте баллы"
        des="Сфотографируйте QR-код и за каждую бутылку получите баллы"
      />
    )
  }
}
class Screen3 extends React.Component {
  componentDidMount () {
    currentScreen = 2
  }
  render () {
    return (
      <Template
        image={require('../Images/screen3.png')}
        mode={0}
        title="Выигрывайте призы"
        des="Получанные баллы можно обменять на призы"
        startBtn={true}
      />
    )
  }
}

export default class Onboarding extends React.Component {
  render () {
    return (
      <View style={styles.wrapper}>
        <PaperOnboarding
          screens={[Screen, Screen2, Screen3]}
        />
        {
          currentScreen === 0 ?
            <TouchableOpacity style={styles.startBtn}
              onPress={()=>{
                this.props.presentApp()
              }}
            >
              <Text style={styles.startBtnText}>Приступить</Text>
            </TouchableOpacity>
          : null
        }
      </View>
    )
  }
}



const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 200,
    paddingLeft: 30,
    paddingRight: 30
  },
  textContainer: {
    width: '100%',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 25,
    textAlign:'center'
  },
  textTitle: {
    fontSize: 30,
    fontFamily: 'Ubuntu',
    fontWeight: 'bold',
    color: 'rgb(255, 255, 255)',
    marginBottom: 20,
    color: RED_COLOR,
    textAlign: 'center'
  },
  lilText: {
    fontSize: 15,
    fontFamily: 'Ubuntu',
    color: "#FFF",
    opacity: 0.8,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  startBtn: {
    backgroundColor: RED_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 24,
    borderRadius: 12,
    position: 'absolute',
    marginLeft: 30,
    marginRight: 30,
    width: screenWidth - 60,
    bottom: 65
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
})
