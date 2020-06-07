import React from 'react';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal, PermissionsAndroid,
  Dimensions, Alert
} from 'react-native';
import {firestore} from '../backend'
import AlertView from '../components/Alert'
import Spinner from './Spinner'
import Icon from 'react-native-vector-icons/Ionicons';

let w = Dimensions.get('window').width
const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

class Empty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: false,
      qrvalue: "",
      loading: false,
      alert: false,
      date: Date.now(),
      currentAlert: false
    }
  }
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,{
          'title': 'Разрешите использовать камеру',
          'message': 'Для сканирования QR-кода бутылки Coca Cola'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        that.setState({ qrvalue: "", camera: true });
      } else {
        alert("Не удалось открыть камеру");
        // alert with buttons
      }
    } catch (err) {
      alert(err)
    }
  }
  checkQRCode = (code) => {
      // check it
      const qrcodes = [
        "123","1234", "1235", "1234567", "12345678", "123456789","1234567890",
        "123a","1234a", "1235a", "1234567a", "12345678a", "123456789a","1234567890a",
        "123b","1234b", "1235b", "1234567b", "12345678b", "123456789b","1234567890b",
        "123c","1234c", "1235c", "1234567c", "12345678c", "123456789c","1234567890c",
      ]
      if (qrcodes.includes(code)) {
        if (this.props.codes.includes(code)) {
            if (!this.state.currentAlert) {
              this.setState({currentAlert: true})
              Alert.alert(
                'Упс...',
                'Этот код был использован',
                [
                  {text: 'Готово', onPress: () => {
                    this.setState({ currentAlert: false })
                  }, style: 'cancel'}
                ],
                { cancelable: true }
              );
            }
        } else {
            this.setState({qrvalue: code, camera: false, loading: true}, () => {
              this.getPoint()
            })
        }
      }
  }
  getPoint = async () => {
    const date = Date.now()
    this.setState({date})
    let self = this
    try {
      const response = await firestore.addCoins(self.props.uid, date)

      self.addCode(self.state.qrvalue)
    } catch (e) {
      this.setState({loading: false})
      this.showAlert(e.message)
    }
  }
  addCode = async (code) => {
    try {
      const response = await firestore.addCode(code)
      this.setState({
        alert: {
          "title": "Успешно",
          "des": "Вы получили +1 балл",
          "img": require("../Images/success.png"),
          "type": "SUCCESS",
          "tapped": this.alertTapped
        },
        loading: false
      })
    } catch (e) {
      this.setState({ loading: false })
      this.showAlert(e.message)
    }
  }
  alertTapped = (type) => {
    if (type === "ERROR") {
      this.setState({ alert : false })
    } else if (type === "SUCCESS") {
      let d = this.props.data
      if (this.props.data === false) {
        d = []
      }
      d.push({ day: this.state.date })

      var c = this.props.codes
      c.push(this.state.qrvalue)

      this.props.updateData(d, c)
      this.props.goHome()
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



  onOpenScanner = () => {
    var that = this;

    if(Platform.OS === 'android'){
      requestCameraPermission();
    } else {
      that.setState({ qrvalue: '', camera: true });
    }
  }

  showCamera = () => {
    return (
      <Modal visible={this.state.camera}>
        <Icon name="ios-close" style={styles.backIcon} onPress={()=> {
          this.setState({ camera: false })
        }}/>
        <CameraKitCameraScreen
           showFrame={false}
           laserColor={'red'}
           frameColor={'red'}
           colorForScannerFrame={'red'}
           onReadCode={event =>
             this.checkQRCode(event.nativeEvent.codeStringValue)
           }
        />
      </Modal>
    )
  }

  render () {
    if (this.state.loading) {
      return <Spinner/>
    } else {
      return (
        <View style={styles.view}>
            {this.showCamera()}
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

            <View style={styles.container}>
                <Image
                    style={styles.img}
                    source={require("../Images/empty.png")}
                />
                <Text style={styles.text}>Прямо сейчас отсканируйте QR код и заработайте баллы</Text>
                <TouchableOpacity style={styles.button} onPress={()=>{
                    this.onOpenScanner()
                }}>
                  <Text style={styles.buttonText}>
                      Открыть камеру
                  </Text>
                </TouchableOpacity>
            </View>
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLACK_COLOR
  },
  container: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: '60%',
    resizeMode: 'contain'
  },
  text: {
    fontWeight: '400',
    textAlign: 'center',
    color: '#FFF',
    marginTop: 30,
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16
  },
  button: {
    backgroundColor: "#DA0501",
    height: 48, width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, borderRadius: 4,
    shadowOpacity: 0.5, shadowColor: 'red',
    shadowRadius: 12, shadowOffset: {
      width: 0, height: 8
    }
  },
  buttonText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 16,
    color: '#fff'
  },
  backIcon: {
    color: "#FFF",
    fontSize: 30,
    position: 'absolute',
    top: 40,
    left: 25,
    zIndex:5
  }
});


export default Empty;
