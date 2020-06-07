import React from 'react'
import {
  View, Text,StyleSheet,
  Image, FlatList, ActivityIndicator,
  TouchableOpacity, StatusBar,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AlertView from '../components/Alert'
import SoundPlayer from 'react-native-sound-player'
import NeuMorh from '../components/NewMorph'
import Confetti from 'react-native-confetti';
import Slider from "react-native-slider";


const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"





export default class Music extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      music: [],
      alert: false,
      song: null,
      pause: false,
      item: null,
      currentDuration: 0,
      url: ""
    }
    this._onFinishedPlayingSubscription = null
    this._onFinishedLoadingSubscription = null
    this._onFinishedLoadingFileSubscription = null
    this._onFinishedLoadingURLSubscription = null
  }
  alertTapped = (type) => {
    if (type === "ERROR") {
      this.setState({ alert : false })
    }
  }
  showAlert = (e) => {
    this.setState({
      alert: {
        "title": "Упс...",
        "des": e,
        "img": require("../Images/error.png"),
        "type": "ERROR",
        "tapped": this.alertTapped
      }
    })
  }

  componentDidMount () {
    if (this.props.music[0] === undefined) {
      fetch('https://api.deezer.com/chart/0/tracks?limit=30&output=json',{
        method: 'GET'
      }).then((response) => response.json())
      .then((json) => {
        this.setState({loading: false, music: json.data })
        this.props.setMusic(json.data)
      }).catch((error) => {
         console.error(error);
      });
    } else {
      this.setState({ music: this.props.music, loading: false })
    }
    this.handleAudio()
  }
  handleAudio = () => {
    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      clearInterval(this._durationSlider)
      this.setState({ pause: true })
      this.pause(this.state.url)
    })
    this._onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
    })
    this._onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
    })
    this._onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {

    })
  }
  componentWillUnmount() {
    this._onFinishedPlayingSubscription.remove()
    this._onFinishedLoadingSubscription.remove()
    this._onFinishedLoadingURLSubscription.remove()
    this._onFinishedLoadingFileSubscription.remove()
    this.pause(this.state.song)
  }
  startDurationTimer () {
      // 30sec ---- 1
      this._durationSlider = setInterval(() => {
          this.setState({ currentDuration: this.state.currentDuration + 0.0334 })
      }, 1000);
  }




  play = (url) => {
    this.startDurationTimer()
    try {
        SoundPlayer.playUrl(url)
        this.setState({pause: false, song: url})
    } catch (e) {

      this.showAlert(e.message)
    }
  }

  pause = (url) => {
    try {
        SoundPlayer.pause(url)
        this.setState({ pause: true })
        clearInterval(this._durationSlider)
    } catch (e) {

      this.showAlert(e.message)
    }
  }
  resume = (url) => {
    try {
        SoundPlayer.resume(url)
        this.setState({pause: false})
    } catch (e) {

      this.showAlert(e.message)
    }
  }

  playSound = (url, item) => {
    this.setState({url})
    if (this.state.pause && this.state.song === url) {
      this.resume(url)
    } else if (!this.state.pause && this.state.song === url) {
      this.pause(url)
    } else {
      this.play(url)
    }
    this.setState({item})
  }
  itemSeparator = () => {
    return (
      <View/>
    );
  };
  renderItem = (item) => {
    return (
      <View style={item.index != 0 ? styles.music : styles.musicFirst}>
        <NewMorph
          size={50}
          color1={"#323444"} color2={"#22222e"}
          radius={6}
        >
          <Image
            source={{uri: item.item.artist["picture_medium"]}}
            style={styles.musicImg}
          />
        </NewMorph>
        <View style={styles.info}>
            <Text style={styles.title}>{item.item.title}</Text>
            <Text style={styles.name}>{item.item.artist.name}</Text>
        </View>
        <NewMorph
          size={35}
          color1={"#252632"} color2={"#2f3040"}
          radius={6}>
          <TouchableOpacity style={styles.icon} onPress={()=>{
            this.playSound(item.item.preview, item.item)
          }}>
              <Icon name={
                this.state.song === item.item.preview && !this.state.pause ? "ios-pause" : "ios-play"
              } style={styles.playIcon}/>
          </TouchableOpacity>
        </NewMorph>
      </View>
    )
  }
  renderHeader = () => {
    return (
      <View style={styles.header}>
          <Image
            source={require('../Images/headphone.png')}
            style={styles.headphone}
          />
          <Text style={styles.headerText}>
            Top-30 песен{"\n"}
            Вместе с Deezer
          </Text>
          <Icon name="ios-arrow-back" style={styles.backIcon} onPress={()=>this.props.navigation.goBack()}/>
      </View>
    )
  }



  render () {

    return (
      <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: RED_COLOR}}>
          {
            this.state.alert === false ? null :
            <AlertView
              title={this.state.alert.title}
              des={this.state.alert.des}
              type={this.state.alert.type}
              img={this.state.alert.img}
              onAlertTap={this.state.alert.tapped}
            />
          }
          <StatusBar hidden />
          <ActivityIndicator
             animating = {this.state.loading}
             color = '#DE3535'
             size = "large"
          />
          {
            !this.state.loading ?
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.table}
              data={this.state.music}
              ListHeaderComponent={this.renderHeader}
              ItemSeparatorComponent={this.itemSeparator}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            /> : null
          }
          { this.state.item != null ?
              <View style={styles.current}>
                <TouchableOpacity onPress={()=>{
                  if (this.state.pause) {
                    this.resume(this.state.url)
                  } else {
                    this.pause(this.state.url)
                  }
                }} style={{...styles.icon, borderColor: '#FFF', borderWidth: 2}}>
                    <Icon name={this.state.pause ? "ios-play" :  "ios-pause"} style={{...styles.playIcon, color: '#FFF'}}/>
                </TouchableOpacity>

                <View style={{...styles.info, marginLeft: 16}}>
                    <Text style={{...styles.title, color: "#FFF"}}>
                        {this.state.item.title}
                    </Text>
                    <Text style={{...styles.name, color: "#FFF"}}>
                        {this.state.item.artist.name}
                    </Text>
                    <Slider
                      value={this.state.currentDuration }
                      trackStyle={{
                        backgroundColor: "#FFF"
                      }}
                      onValueChange={currentDuration => {
                        if (this.state.pause) {
                          this.play(this.state.url)
                          this.setState({pause: false})
                        }
                        this.setState({ currentDuration })
                        SoundPlayer.seek( currentDuration * 30 )
                      }}
                    />
                </View>
            </View> : null
          }
      </View>
    )
  }
}


export class SurpriseBox extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      alert: false
    }
    this.shakeAnimation = new Animated.Value(0);
  }
  shake = () => {
    Animated.sequence([
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(this.shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start(() => {
      this._confettiView.startConfetti();
      this.showAlert("Топ-30 песен теперь ваши")
    });
  }

  showAlert = (e) => {
    this.setState({
      alert: {
        "title": "Ура...",
        "des": e,
        "img": require("../Images/success.png"),
        "type": "SUCCESS",
        "tapped": this.alertTapped
      }
    })
  }
  alertTapped = (type) => {
    if (type === "SUCCESS") {
      this.setState({ alert : false })
      this.props.goBack()
    }
  }


  render () {
    return (
      <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BLACK_COLOR}}>
          <Confetti
            ref={(node) => this._confettiView = node}
            duration={300}
            confettiCount={100}
            colors={["#FF0000","yellow", "white", "#FF0000"]}
            size={5}
          />
          {
            this.state.alert === false ? null :
            <AlertView
              title={this.state.alert.title}
              des={this.state.alert.des}
              type={this.state.alert.type}
              img={this.state.alert.img}
              onAlertTap={this.state.alert.tapped}
            />
          }

          <Animated.Image source={require('../Images/cola.png')}
            style={{...styles.bottle,
              transform: [{
                rotate: this.shakeAnimation.interpolate({
                  inputRange: [-0.3, 0.3],
                  outputRange: ['-0.04rad', '0.04rad']
                })
              }],
              opacity: 1
            }}
          />
          <View style={styles.overlay}/>
          <TouchableOpacity onPress={this.shake} style={styles.boxBtn}>
              <Text style={styles.boxText}>Открыть приз</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingBottom: 25,
    paddingTop: 0,
    marginTop: -35,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  music: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16, paddingBottom: 16,
    zIndex: 2, backgroundColor:BLACK_COLOR,
    paddingLeft: 25, paddingRight: 25
  },
  musicFirst: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 32, paddingBottom: 16,
    paddingLeft: 25, paddingRight: 25,
    zIndex: 2, borderTopLeftRadius: 32,
    backgroundColor: BLACK_COLOR
  },
  musicImg: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    backgroundColor: 'red',
    borderRadius: 27.5,
    borderWidth: 5,
    borderColor: "#272836"
  },
  icon: {
    width: 35,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: "#272836",
    borderRadius: 22.5,
    marginLeft: 'auto'
  },
  playIcon: {
    height: 15,
    fontSize: 15,
    marginLeft: 2,
    color:RED_COLOR
  },
  info: {
    flex: 1,
    marginRight: 15,
    marginLeft: 20
  },
  title: {
    fontFamily: "Ubuntu-Bold",
    marginBottom: 4,
    fontSize: 16,
    color: "#FFF"
  },
  name: {
    fontFamily: "Ubuntu-Medium",
    color: "#FFF",
    opacity: 0.6
  },
  current: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: "#DE3535",
    width: '100%',
    padding: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  headphone: {
    height: 150,
    width: '60%',
    resizeMode: 'contain'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: RED_COLOR,
  },
  headerText: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 20,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
    color: "#FFF",
    paddingBottom: 20
  },
  backIcon: {
    position: 'absolute',
    left: 25,
    top: 30,
    fontSize: 20,
    color: "#FFF",
    padding: 8,
    borderWidth: 0.5,
    borderColor: "#ff8f8f",
    borderRadius: 8
  },
  boxBtn: {
    backgroundColor: RED_COLOR,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 8,
    marginTop: 25
  },
  boxText: {
    color: '#FFF',
    fontFamily: "Ubuntu-Bold",
    fontSize: 16
  },
  bottle: {
    height: '60%',
    resizeMode: 'contain',
    opacity: 0.1,
    tintColor: RED_COLOR
  }
})
