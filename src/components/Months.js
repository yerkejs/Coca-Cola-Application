import React from 'react'

import {
  ScrollView,
  StyleSheet,
  View,TouchableOpacity,
  Image, Dimensions,Text,
  Share
} from 'react-native';
import Carousel  from 'react-native-snap-carousel';
import Progress from './Progress'
import Icon from 'react-native-vector-icons/Ionicons';
import NewMorph from './NewMorph'


const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"


let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

var sum = -1


class Months extends React.Component {

  share = async (month, coins) => {
    try {
      const result = await Share.share({
        message: "Я собираю баллы в приложений Coca-Cola." + " За месяц " + month +  " у меня их " + coins,
        title:"Смотри на мою статистику, зацени",
        url:"https://springpromo.coca-cola.kz/kz/index.html"
      });
    } catch (error) {
      alert(error.message);
    }
  }

  _renderItem = (data) => {

    let {month, coins} = data.item
    return (
      <View style={styles.wrapper}>
        <NewMorph
          size={deviceWidth - 140}
          color1={"#2f3140"}
          color2={"#252532"}
          radius={15}
        >
          <View style={styles.item}>
              <View style={styles.header}>
                <Text style={styles.title}>{month}</Text>
                <Text style={styles.des}>Очков: {coins}</Text>
                <Text style={styles.percent}>
                  {Math.round(coins * 100/ sum)}
                  <Text style={styles.percentMark}>%</Text>
                </Text>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={()=>{
                    this.share(month, coins)
                  }}
                >
                  <Icon name="ios-share" style={styles.share}/>
                </TouchableOpacity>
              </View>
              <View style={{
                width: (deviceWidth - 100)/4-40
              }}>
                <Progress
                  width={(deviceWidth - 100)/4-40}
                  percent={coins / sum}
                />
              </View>
          </View>
        </NewMorph>
      </View>
    )
  }

  render () {
    if (sum == -1) {
      sum = 0
      this.props.data.map((obj, i) => {
        sum += obj.coins
      })
    }
    return (
      <View>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.props.data}
          renderItem={this._renderItem}
          style={styles.carousel}
          sliderWidth={deviceWidth - 50}
          itemWidth={deviceWidth - 100}
          activeSlideAlignment={'start'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingTop: 20
  },
  item: {
    backgroundColor: 'rgb(49,51,67)',
    padding: 25,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  title: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: '900',
    opacity: 0.7
  },
  des: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.7
  },
  percent:{
    color: '#FFF',
    fontSize: 35,
    fontWeight: '900',
    marginTop: 10
  },
  percentMark: {
    fontSize: 20,
    opacity: 0.5
  },

  share: {
    fontSize: 25,
    color: '#FFF',
    textAlign: 'center'
  },
  shareBtn: {
    width: 50,
    height: 50,
    display: 'flex',
    marginTop: 8*((deviceWidth - 100)/4-40) - 155 ,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED_COLOR,
    borderRadius: 8,
    borderBottomLeftRadius: 20,

  }
})




export default Months;
