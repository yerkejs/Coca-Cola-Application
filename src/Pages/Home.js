import React from 'react';

import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image, Text, Animated, SafeAreaView
} from 'react-native';
import {auth} from '../backend'
import Row from './Row';
import Empty from './Empty'
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Months from '../components/Months.js'



const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const tabs = ["Недели", "Месяцы"]

class Menu extends React.Component {
  render() {
    return (
      <TouchableOpacity style={{
        display: 'flex',flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'space-between',
        height: 10
      }}>
          <View style={{
            height: 3, width: 30,
            backgroundColor: '#DE3535'
          }}/>
          <View style={{
            height: 3, width: 15,
            backgroundColor: '#DE3535'
          }}/>
      </TouchableOpacity>
    )
  }
}


class Header extends React.Component {
  render () {
     return (
       <View
         style={styles.headerView}>
         <Image
           source={require("../Images/header.png")}
           style={styles.headerImg}
         />
         <View style={styles.top}>
           <Text
              style={{
                ...styles.title, zIndex: 2
              }}>
              Главная</Text>
            <View
              style={styles.cash}>
                <Image
                  style={styles.cashBottle}
                  source={require("../Images/spinner.png")}
                />
                <Text
                  style={styles.coins}>
                    {this.props.point}
                </Text>
            </View>
         </View>
       </View>
     )
  }
}
class Element extends React.Component {
  constructor (props) {
    super(props);
    this.bottleAnimation = new Animated.Value(0)
  }

  render () {
    var active = this.props.currentItem === this.props.title
    var index = tabs.indexOf(this.props.title)
    return (
      <TouchableOpacity
        style={styles.filterDefault}
        onPress={(e)=>{
          this.props.setItem(this.props.title)
          if (index !== tabs.indexOf(this.props.title)) {
            if (index === 0) {
               this.bottleAnimation = new Animated.Value(-50)
            } else {
               this.bottleAnimation = new Animated.Value(50)
            }
          } else {
            if (index === 0) {
               this.bottleAnimation = new Animated.Value(-50)
            } else {
               this.bottleAnimation = new Animated.Value(50)
            }
          }
          Animated.timing(this.bottleAnimation, {
            toValue: 0,
            duration: 200,
          }).start();
        }}
      >
          <Text style={{
            color: active ? "#FFF" : 'rgb(121,122,133)',
            fontSize: active ? 18 : 15,
            fontWeight: active ? "700" : "500"
          }}>{this.props.title}</Text>
          {active ?
            <Animated.Image
              style={{
                ...styles.bottleMini,
                marginTop: -15,
                transform: [
                  {rotateZ: '90deg'},
                  {translateY: this.bottleAnimation}
                ]
              }}
              source={require('../Images/spinner.png')}
            />
          : null}
      </TouchableOpacity>
    )
  }
}

const NewMorph = ({children, size, borderRadius, style}) => {
  return (
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
          <View style={[
            styles.inner,
            {width: size || 40, height: size || 40, borderRadius: borderRadius || 40 / 2},
            style
          ]}>
            {children}
          </View>
      </View>
    </View>
  )
}


export default class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data : false,
      openCamera: false,
      point: 0,
      object: {},
      codes: [],
      music: [],
      data1: [],
      currentItem: "Недели"
    }
  }
  componentDidMount() {
    if (this.props.route.params.data.data == undefined) {
      this.setState({ data : false })
    } else {
      this.setState({
        data: this.props.route.params.data.data,
        point: this.props.route.params.data.point,
        codes: this.props.route.params.data.codes
      })

      this.configureData(this.props.route.params.data.data)
      this.toMonths(this.props.route.params.data.data)
    }
  }
  setMusic = (music) => {
    this.setState({music})
  }

  getWeekNumber = (timestamp) => {
    var date = new Date(timestamp)
    return date.getWeekNumber()
  }
  getDay = (timestamp) => {
    var date = new Date(timestamp)
    var day = date.getDay();
    return day
  }

  configureData = (data) => {
    var output = {}
    Date.prototype.getWeekNumber = function(){
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    };
    data.map(( obj, index ) => {
      let week = this.getWeekNumber(obj.day)
      if (output["НЕДЕЛЯ " + week] === undefined) {
        output["НЕДЕЛЯ " + week] = {
          "days": {
            [this.getDay(obj.day)]: 1
          },
          "start": week,
          "coins": 1
        }
      } else {
        if (output["НЕДЕЛЯ " + week].days[this.getDay(obj.day)] == undefined) {
          output["НЕДЕЛЯ " + week].days[this.getDay(obj.day)] = 1
        } else {
          output["НЕДЕЛЯ " + week].days[this.getDay(obj.day)] += 1
        }
        output["НЕДЕЛЯ " + week].coins += 1
      }
    })
    console.log(output)
    this.setState({ object: output })
  }


  // Filters
  toMonths = (data) => {
    var output = {}
    const months = [
      "Январь", "Февраль", "Март", "Апрель", 'Май', "Июнь",
      "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
    ]
    var output2 = {}
    data.map((obj, index) => {
      let month = this.getMonth(obj.day)
      let m = months[month]
      if (output[m] === undefined) {
        output[m] = 1
      } else {
        output[m] += 1
      }
    })
    months.map((month, index) => {
      if (output[month] === undefined) {
        output2[month] = 0
      } else {
        output2[month] = output[month]
      }
    })

    var sortedObj = []
    Object.keys(output2).sort(function(a,b){return output2[b]-output2[a]}).map((key, i) => {
      sortedObj.push({
        month: key,
        coins: output2[key]
      })
    })

    this.setState({ data1: sortedObj })
  }


  logOut = async () => {
    try {
      const response = await auth.signOut()
      this.props.route.params.signOut()
    } catch (e) {
      console.log(e)
      this.showAlert(e.message)
    }
  }
  showAlert = (e) => {
    alert(e)
  }
  updateData = (data, codes) => {
    this.setState({ data, point: this.state.point + 1, codes })
    this.configureData(data)
    console.log('current', this.state.point)
    var newPoint = this.state.point ? this.state.point + 1 : 1
    this.props.route.params.updateData(data, newPoint, codes)
    this.toMonths(data)
  }
  goHome = () => {
    this.setState({ openCamera: false })
  }
  getMonth = (timestamp) => {
    var date = new Date(timestamp)
    var month = date.getMonth();
    return month
  }
  setItem = (currentItem) => {
    this.setState({ currentItem })
  }

  render () {
    return (
      <View style={styles.wrapper}>
        <SafeAreaView style={styles.container}>
          <View style={styles.nav}>
              {
                this.state.openCamera ?
                <Icon name="md-arrow-round-back" style={styles.backIcon} onPress={()=>this.setState({openCamera: false})}/> : null
              }

              <Image style={styles.logo} source={require('../Images/logo.png')}/>

              <TouchableOpacity onPress={this.logOut}>
                  <Image
                    source={require("../Images/exit.png")}
                    style={{width: 20, height: 20, tintColor: '#FFF'}}
                  />
              </TouchableOpacity>
          </View>
          <Header
            point={this.state.point}
          />
          {
            this.state.data === false || this.state.data[0] == undefined || this.state.openCamera ?
            <Empty uid={this.props.route.params.uid}
              updateData={this.updateData}
              goHome={this.goHome}
              data={this.state.data}
              openCamera={true}
              codes={this.state.codes}
            />
            :
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.controllers}>
                    {tabs.map((name, i) =>
                      <Element
                        title={name}
                        currentItem={this.state.currentItem}
                        setItem={this.setItem}
                      />
                    )}
                </View>
                {
                  tabs.indexOf(this.state.currentItem) !== 0 ?
                  <Months
                    data={this.state.data1}
                  />
                  :
                  Object.keys(this.state.object).map((weekName, i) =>
                      <Row week={weekName}
                        key={i + "" + this.state.object[weekName].coins}
                        data={this.state.object[weekName].days}
                        coins={this.state.object[weekName].coins}
                      />
                  )
                }
            </ScrollView>
          }
          {this.state.data === false || this.state.data[0] == undefined || this.state.openCamera ? null :
            <ActionButton
              buttonColor={RED_COLOR}
              icon={<Icon name="md-menu" style={styles.actionButtonIcon} />}
              style={styles.floating}>
                <ActionButton.Item  buttonColor='rgb(255,33,50)' title="Camera" onPress={()=>this.setState({ openCamera: true })}>
                    <Icon name="md-camera" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='rgb(255,33,50)' title="Stats" onPress={() => {
                  this.props.navigation.navigate('Stats')
                }}>
                    <Icon name="ios-stats" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='rgb(255,33,50)' title="Awards" onPress={() => {
                  this.props.navigation.navigate('Awards', {
                    music: this.state.music,
                    setMusic: this.setMusic
                  })
                }}>
                    <Icon name="md-medal" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
          }
        </SafeAreaView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: "100%",
    backgroundColor: BLACK_COLOR
  },
  container: {
    flex: 1,
    backgroundColor: RED_COLOR
  },
  scrollView: {
    backgroundColor: BLACK_COLOR,
    flex: 1,
    padding: 10,
    paddingTop: STATUSBAR_HEIGHT
  },
  nav: {
    height: Platform.OS == "ios" ? 30 : 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: RED_COLOR,
    paddingTop: Platform.OS == "ios" ? 0 : 20,
  },
  headerImg: {
    height: 75,
    position: 'absolute',
    zIndex: 1,
    resizeMode: 'stretch',
    left: 0
  },
  headerView: {
    width: '100%',
    height: 80,
    backgroundColor: BLACK_COLOR
  },
  logo: {
    width: 60,
    resizeMode: 'contain',
  },
  floating: {
    width: 60,
    height: 60,
    backgroundColor: BLACK_COLOR
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
    textAlign: 'center'
  },
  backIcon: {
    fontSize: 30,
    height: 30,
    color: "#FFF"
  },
  top: {
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 10
  },
  coins: {
    color: "#FFF",
    fontFamily: "Ubuntu-Bold",
    fontSize: 20
  },
  title: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 30,
    color: "#FFF"
  },
  controllers: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginLeft: 10,
    marginBottom: 15,
    marginTop: 15
  },
  filterDefault: {
    paddingRight: 25,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  bottleMini: {
    width: 30, height: 60,
    marginTop: -10,
    tintColor:'#FFF',
    marginLeft: 10
  },
  cashBottle: {
    width: 25,
    height: 30,
    tintColor: "#FFF"
  },
  cash: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: "flex-end"
  }
});
