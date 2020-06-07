import React, {
  Component,
} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet, Dimensions,
  TouchableOpacity,
  Share
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import NewMorph from '../components/NewMorph'
import Day from './Day';

const RED_COLOR = "rgb(229,30,42)"






export default class ProfileCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      data: []
    }
  }
  componentWillMount () {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
    var data = []
    Object.keys(this.props.data).map((dayNumber, index) => {
      data.push({
        "day": days[dayNumber - 1],
        "coins": this.props.data[dayNumber]
      })
    })
    this.setState({ data })
  }
  _renderItem = ({item, index}) => {
      return (
          <View style={{
            width: '100%',
            flex: 1, height: 180,
            backgroundColor: 'red', ...styles.container
          }}>
              <Text style={styles.day}>{ item.day }</Text>


              <View style={styles.stats2}>
                  <Text style={styles.placeholder}>Монеты</Text>
                  <Text style={styles.placeholder}>Процент</Text>
              </View>



              <View style={styles.stats}>
                  <Text style={styles.coin}>{ item.coins }</Text>
                  <Text style={styles.percentage}>{ Math.round((item.coins * 100 )/this.props.coins) }%</Text>
              </View>



                <TouchableOpacity style={styles.btn} onPress={()=>{
                    this.share(item.day.toLowerCase(), item.coins)
                }}>
                    <Text style={styles.btnText}>Поделиться</Text>
                </TouchableOpacity>

          </View>
      );
  }
  share = async (day, coins) => {
    const days = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]
    var i = ""
    switch (day) {
      case "понедельник":
        i = "В понедельник"
        break;
      case "вторник":
        i = "Во вторник"
        break;
      case "среда":
        i = "В среду"
        break;
      case "четверг":
        i = "В четверг"
        break;
      case "пятница":
        i = "В пятницу"
        break;
      case "суббота":
        i = "В субботу"
        break;
      case "воскресенье":
        i = "В воскресенье"
        break;
      default:
        i = ""
    }

    var monet = coins == 1 ? "монету" : coins > 5 ? "монеты" : "монет"

    try {
      const result = await Share.share({
        message: i + ", я в приложении Coca-Cola заработал " + coins + " " + monet + ". Скоро я выиграю новые призы!!!",
        title:"Смотри на мою статистику, зацени",
        url:"https://springpromo.coca-cola.kz/kz/index.html"
      });
    } catch (error) {
      alert(error.message);
    }
  }

  get pagination () {
      const { activeSlide } = this.state;

      return (
          <Pagination
            dotsLength={this.state.data.length}
            activeDotIndex={activeSlide}
            containerStyle={{
                paddingVertical: 0,
                marginTop: 8
            }}
            dotStyle={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={1}
          />
      );
  }
  render() {
    let deviceWidth = Dimensions.get('window').width
    const onPress = this.props.onPress;

    return (
      <View style={{flex: 1}}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={this.state.data}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            renderItem={this._renderItem}
            sliderWidth={deviceWidth - 40}
            itemWidth={deviceWidth - 40}
          />
          { this.pagination }
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 10,
    backgroundColor: RED_COLOR
  },
  day: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 25, color: '#FFF'
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10
  },
  stats2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', marginBottom: -5
  },
  placeholder: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Ubuntu-Bold"
  },
  coin: {
    fontSize: 25,
    color: '#FFF',
    fontFamily: "Ubuntu-Bold",
    width: '50%',
    textAlign: 'center',
    padding: 5,
    marginTop: 12, marginBottom: 12,
    backgroundColor: "rgb(42,43,57)"
  },
  percentage: {
    fontSize: 25,
    color: '#FFF',
    fontFamily: "Ubuntu-Bold",
    width: '50%',
    backgroundColor: "rgb(42,43,57)",
    textAlign: 'center',
    padding: 5,
    marginTop: 8, marginBottom: 8,
    marginLeft: 20
  },
  btn: {
    height: 36,
    backgroundColor: "#e51e2a",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: "rgb(42,43,57)"
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Ubuntu-Bold"
  }
});
