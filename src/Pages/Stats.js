import React from 'react';

import {
  View, Text,StyleSheet,
  Image, ScrollView, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropdownMenu from 'react-native-dropdown-menu';
import ChartView, {ProgressView, LeaderBoard} from '../components/Charts.js'


const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

export default class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort1: 0,
      sort2: 0,
      full: [],
      data: {},
      graphData: {},
      monthProgress: {},
      point: 0
    }
  }

  componentDidMount () {

    this.setState({
        full: this.props.route.params.data.data,
        point: this.props.route.params.data.point
    },()=>{
      console.log("DATA->>>>>")
      console.log(this.props.route.params.data)
      console.log(this.state)
      this.showMonths()
      this.showMonthProgress()
    })
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
  getMonth = (timestamp) => {
    var date = new Date(timestamp)
    var month = date.getMonth();
    return month
  }


  weeksGraph = (week) => {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
    var d = this.state.data[week].days
    var data = {}
    {[1,2,3,4,5,6,7].map((dayNumber, i) => {
      data[days[i]] = d[dayNumber] === undefined ? 0 : d[dayNumber]
    })}
    this.setState({ graphData: data })
  }



  showWeeks = () => {
    var output = {}
    var data = this.state.full
    var dataValues = this.state.dataValues
    Date.prototype.getWeekNumber = function(){
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    };
    data.map(( obj, index ) => {
      let week = this.getWeekNumber(obj.day)
      if (output["НЕДЕЛЯ #" + week] === undefined) {
        output["НЕДЕЛЯ #" + week] = {
          "days": {
            [this.getDay(obj.day)]: 1
          },
          "start": week,
          "coins": 1
        }

      } else {
        if (output["НЕДЕЛЯ #" + week].days[this.getDay(obj.day)] == undefined) {
          output["НЕДЕЛЯ #" + week].days[this.getDay(obj.day)] = 1
        } else {
          output["НЕДЕЛЯ #" + week].days[this.getDay(obj.day)] += 1
        }
        output["НЕДЕЛЯ #" + week].coins += 1
      }
    })
    this.setState({ data : output }, () => {
      this.weeksGraph(Object.keys(this.state.data)[0])
    })
  }
  showMonths = () => {
    var output = {}
    const months = [
      "Январь", "Февраль", "Март", "Апрель", 'Май', "Июнь",
      "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
    ]
    var data = this.state.full
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
    this.setState({ data: output2, graphData: output2 })
  }

  showMonthProgress = () => {
    var output = {}
    var data = this.state.full
    var total = 0
    const months = [
      "Январь", "Февраль", "Март", "Апрель", 'Май', "Июнь",
      "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
    ]

    var lastOne = this.getMonth(data[data.length - 1].day)
    months.map((m, index) => {
      if (index + 1 > lastOne ) {
        output[(index + 1 )+ ""] = null
      } else if (data.filter(obj => this.getMonth(obj.day) == index + 1 ).length == 0 ) {
        output[(index + 1 )+ ""] = total
      } else {
        lastOne = index + 1
        total += data.filter(obj => this.getMonth(obj.day) == index + 1 ).length
        output[(index + 1 )+ ""] = total
      }
    })
    this.setState({
      monthProgress: output
    })
  }



  render () {
    var data = [["Месяцы", "Неделя"]];
    var data2 = [Object.keys(this.state.data)]

    let point = this.state.point
    let total = 30 + point - (point % 30)

    return (
      <SafeAreaView
        style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
              <Icon name="md-arrow-round-back" style={styles.backIcon} onPress={()=>this.props.navigation.goBack()}/>
              <Image
                style={styles.logo}
                source={require("../Images/logo.png")}
              />
          </View>

          <Text style={styles.title}>Статистика</Text>
          <Text style={styles.p}>Вас ждут огненные призы</Text>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Image
              source={require("../Images/stats.png")}
              style={styles.img}
            />
            <Text style={styles.chartTitle}>Набранные монеты</Text>
            <View style={styles.row}>
                <DropdownMenu
                    bgColor={'#FFF'}
                    activityTintColor={'#DE3535'}
                    handler={(selection, row) => {
                      if (row == 1) {
                        this.showWeeks()
                      } else if (row == 0) {
                        this.showMonths()
                      }
                      this.setState({ sort1: row })
                    }}
                    data={data}
                />
                {this.state.sort1 == 1 ?
                  <DropdownMenu
                    bgColor={'#FFF'}
                    activityTintColor={'#DE3535'}
                    handler={(selection, row) => {
                      this.weeksGraph(Object.keys(this.state.data)[row])
                    }}
                    data={data2}
                /> : null}
            </View>
            <ChartView
              type="Bar"
              graphData={this.state.graphData}
            />
            <Text style={styles.chartTitle}>Ежемесячный прогресс</Text>
            <ChartView
              type="Linear"
              graphData={this.state.monthProgress}
            />
            <Text style={styles.chartTitle}>Лидерборд</Text>
            <LeaderBoard
              point={point}
            />
            <Text style={styles.chartTitle}>Приз: 60 монет</Text>
            <View style={styles.inline}>
              <View style={styles.progress}>
                  <ProgressView
                    point={point}
                    total={total}
                  />
              </View>
              <View style={styles.column}>
                <Image
                  source={require("../Images/music.png")}
                  style={styles.musicImg}
                />
                <Text style={styles.text}>Доступ в топ-{total} песен</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: BLACK_COLOR
  },
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
  p: {
    fontSize: 16,
    fontFamily: "Ubuntu-Medium",
    color: "#FFF",
    opacity: 0.8
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  chartTitle: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 18,
    marginLeft: 16,
    marginBottom: 8,
    color: "#FFF",
    marginTop: 8
  },
  scrollView: {
    marginTop: 8
  },
  img: {
    width: '100%',
    resizeMode: 'cover',
    height: 200, marginBottom: 12
  },
  inline: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 20
  },
  musicImg: {
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginTop: -20
  },
  progress: {
    width: 100
  },
  text: {
    fontFamily: "Ubuntu-Bold",
    color: "#FFF",
    fontSize: 18,
    marginTop: -20
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
