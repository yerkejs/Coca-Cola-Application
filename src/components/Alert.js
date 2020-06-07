import React from 'react';

import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';

let w = Dimensions.get('window').width
let h = Dimensions.get('window').height

const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgba(41,45,57, 0.9)"

class AlertView extends React.Component {
  render () {

    return (
      <View style={{...styles.alert, marginLeft: this.props.special ? 20 : 40}}>
          <Image
            source={this.props.img}
            style={styles.alertImg}
          />
          <Text style={styles.alertText}>{this.props.title}</Text>
          <Text numberOfLines={1} style={styles.alertDes}>{this.props.des}</Text>
          <TouchableOpacity style={styles.alertBtn} onPress={()=>{
            this.props.onAlertTap(this.props.type)
          }}>
              <Text style={styles.alertBtnText}>Готово</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 22,
    backgroundColor: BLACK_COLOR,
    width: w - 80,
    height: (w - 80) * 1.2 + 40,
    shadowOpacity: 0.2, shadowColor: 'black', shadowRadius: 20,
    shadowOffset: {width: 0, height: 12}, borderRadius: 12,
    marginTop: h/2 - ((w - 80) * 1.2 + 40)/2 - 25
  },
  alertText: {
    fontFamily: "Ubuntu-Bold",
    fontSize: 20,
    width: w - 120,
    textAlign: 'center',
    color: "#FFF"
  },
  alertImg: {
    width: w - 120,
    resizeMode: 'contain',
    height: w - 120
  },
  alertDes: {
    fontSize: 16,
    fontFamily: "Ubuntu-Regular",
    width: w - 120,
    textAlign: 'center',
    color: "#FFF"
  },
  alertBtn: {
    height: 48,
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DA0501",
    width: w - 120,
    borderRadius: 8,
    marginTop: 10
  },
  alertBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Ubuntu-Bold'
  }
});

export default AlertView;
