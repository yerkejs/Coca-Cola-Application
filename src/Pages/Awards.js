import React from 'react'
import {
  View
} from 'react-native';
import NoAward from './NoAward'
import Music, {SurpriseBox} from './Music'
import Spinner from './Spinner'
import {firestore} from '../backend'
import AlertView from '../components/Alert'



export default class Awards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      point: 0,
      priseOpened: true,
      loading: false,
      alert: false
    }
  }
  componentDidMount() {
    this.setState({
      point: this.props.route.params.data.point
    })
    if (this.props.route.params.data.prise === false || this.props.route.params.data.prise === undefined) {
      this.setState({ priseOpened: false })
    }
  }
  goBack = async () => {
    this.setState({ loading: true, priseOpened: true })
    try {
      const response  = await firestore.setPrise(this.props.route.params.uid)
      this.setState({ loading: false })
    } catch (e) {
      this.setState({ loading: false })
      this.showAlert(e.message)
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
  alertTapped = (type) => {
    if (type === "ERROR") {
      this.setState({ alert : false })
    }
  }



  render () {
    let {point} = this.state
    let total = 30 + point - (point % 30)
    if (this.state.loading) {
      return <Spinner/>
    } else if (point < 30) {
      return <NoAward point={point} navigation={this.props.navigation}/>
    } else if (!this.state.priseOpened) {
      return <SurpriseBox goBack={this.goBack}/>
    } else {
      return (
        <View style={{width: '100%', height: '100%'}}>
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
          <Music
            navigation={this.props.navigation}
            music={this.props.route.params.music}
            setMusic={this.props.route.params.setMusic}
          />
        </View>
      )
    }
  }
}
