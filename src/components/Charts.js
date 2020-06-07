import React from 'react'
import { LineChart, Grid,BarChart, YAxis, XAxis, ProgressCircle } from 'react-native-svg-charts'
import {
  View, StyleSheet, ActivityIndicator,
  Text
} from 'react-native';
import { firestore } from '../backend'


const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

export default class ChartView extends React.Component {

  render () {
    return (
      <View style={{display: 'flex', flexDirection: 'column'}}>
          <View style={{
            height: 200, width: '100%', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'space-between',
            zIndex: 1
          }}>
              <YAxis
                  data={Object.values(this.props.graphData)}
                  contentInset={{ top: 20, bottom: 20 }}
                  svg={{
                      fill: '#FFF',
                      fontSize: 12,
                      fontWeight: '700'
                  }}
                  min={0}
                  numberOfTicks={5}
                  formatLabel={(value) => `${value}`}
              />
              {
                this.props.type == "Bar" ?
                <BarChart
                    style={{ flex: 1, marginLeft: 16}}
                    data={ Object.values(this.props.graphData) }
                    svg={{
                      stroke: RED_COLOR, strokeWidth: 4,fill:RED_COLOR
                    }}
                    contentInset={{ top: 20, bottom: 20 }}
                    animate
                    yMin={0}
                >
                    <Grid/>
                </BarChart>
                :
                <LineChart
                    style={{ flex: 1, marginLeft: 16}}
                    data={ Object.values(this.props.graphData) }
                    svg={{
                      stroke: RED_COLOR, strokeWidth: 4
                    }}
                    contentInset={{ left: 10, right: 10, top: 20, bottom: 20 }}
                    animate={true}
                >
                    <Grid/>
                </LineChart>
              }

          </View>
          <XAxis
              style={{ marginHorizontal: -10, marginLeft: 16 }}
              data={Object.keys(this.props.graphData)}
              formatLabel={(value, index) => index + 1}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 10, fill: '#FFF', fontWeight: '700' }}
          />
      </View>
    )
  }
}
export class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: []
    }
  }

  async componentDidMount () {
    var array = []
    if (this.state.data[0] === undefined) {
      try {
        const response = await firestore.getRank();
        response.docs.forEach((item, i) => {
          array.push(item.data().point)
        });
        this.setState({ data: array, loading: false})
      } catch (e) {
        console.log(e)
      }
    }
  }
  render () {
    let {loading, data} = this.state
    return (
      <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
               animating = {loading}
               color = '#DE3535'
               size = "large"
          />
          {
            loading ? null : <Board data={data} point={this.props.point}/>
          }
      </View>
    )
  }
}
class Board extends React.Component {
  render () {
    let {data, point} = this.props
    let myRank = data.indexOf(point) + 1

    let biggerOne = data[myRank - 2] === undefined ? false : data[myRank - 2]
    let smallerOne = data[myRank] === undefined ? false : data[myRank]

    return (
      <View style={styles.board}>
          {biggerOne ?
            <Record
              text={"Пользователь #" + (myRank - 1)}
              coins={biggerOne}
            /> : null
          }
          <Record
            text={"Вы #" + myRank}
            coins={point}
            me={true}
          />
          {smallerOne ?
            <Record
              text={"Пользователь #" + (myRank + 1)}
              coins={smallerOne}
            /> : null
          }
      </View>
    )
  }
}
class Record extends React.Component {
  render () {
    return (
      <View style={ this.props.me ? styles.me : styles.record }>
          <Text style={{...styles.text1, color: this.props.me ? "#FFF" : RED_COLOR}}>{this.props.text}</Text>
          <Text style={{...styles.text2, color: this.props.me ? "#FFF" : RED_COLOR}}>{this.props.coins}</Text>
      </View>
    )
  }
}

export class ProgressView extends React.Component {
  render () {

      return (
        <ProgressCircle
          style={{ height: 100 }}
          progress={this.props.point / this.props.total}
          progressColor={RED_COLOR}
          strokeWidth={10}
        />
      )
  }
}


const styles = StyleSheet.create({
  board: {
    flex: 1,
    width: '100%',
    marginTop: -30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  record: {
    flex: 1,
    backgroundColor: "#FFF",
    width: '100%',
    display: 'flex', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: 20, paddingRight: 20,
    borderRadius: 8, elevation: 4,
    shadowColor: '#000', shadowOffset: {width: 0, height: 5},
    shadowRadius: 8, shadowOpacity: 0.1,
    marginTop: 8, marginBottom: 8,
    maxHeight: 80
  },
  me : {
    flex: 1,
    backgroundColor: RED_COLOR,
    width: '100%',
    display: 'flex', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: 20, paddingRight: 20,
    borderRadius: 8, elevation: 4,
    shadowColor: RED_COLOR, shadowOffset: {width: 0, height: 4},
    shadowRadius: 8, shadowOpacity: 0.4,
    marginTop: 8, marginBottom: 8,
    maxHeight: 80
  },
  text1: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Ubuntu-Bold"
  },
  text2: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    fontFamily: "Ubuntu-Bold"
  }
})
