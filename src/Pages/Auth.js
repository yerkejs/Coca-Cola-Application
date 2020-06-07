
import React from 'react';
import {
  View, Text, SafeAreaView,
  Image, StyleSheet, TextInput,
  TouchableOpacity, Modal, Keyboard
} from 'react-native';
import WebView from 'react-native-webview'
import CodeInput from 'react-native-confirmation-code-input';
import url from 'url';
import Spinner from './Spinner'
import { TextInputMask } from 'react-native-masked-text'
import {auth} from '../backend'
import AlertView from '../components/Alert'

const RED_COLOR = "rgb(229,30,42)"
const BLACK_COLOR = "rgb(42,43,57)"

const captchaUrl = `http://coca-8cf9d.firebaseapp.com/`
const redColor = "#AB0302"

class Auth extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      showModal: false,
      codeIsSent: false,
      confirmation: {},
      phone: "+7",
      alert: false,
      code: ""
    }
  }
  static navigationOptions = { headerMode: 'none' };

  login = (phone) => {
    this.setState({
      showModal: true,
      phone: phone
    })
  }
  resend = () => {
    this.setState({
      codeIsSent: false
    })
    this.resendCode()
  }
  back = () => {
    this.setState({
      showModal: false,
      codeIsSent: false
    })
  }



  _handleResponse = data => {
    let query = url.parse(data.url, true).query;
    if (query.hasOwnProperty('token')) {
      this._sendConfirmationCode(query.token);
    } else if (query.hasOwnProperty('cancel')) {
      this.setState({ showModal: false});
    }
  }





  _sendConfirmationCode = async (captchaToken) => {
      this.setState({ showModal: false, loading: true, code:  captchaToken});
      let self = this
      let number = this.state.phone;


      const captchaVerifier = { type: 'recaptcha', verify: () => Promise.resolve(captchaToken)}

      try {
        const response = await auth.login(number, captchaVerifier)
        self.setState({codeIsSent: true, confirmation: response, loading: false})
      } catch (e) {
        this.showAlert(e.message)
        self.setState({loading: false})
      }
  }
  resendCode = async () => {
    let self = this
    self.setState({ loading: true })
    const captchaVerifier = { type: 'recaptcha', verify: () => Promise.resolve(self.state.code)}
    let number = this.state.phone;
    try {
      const response = await auth.login(number, captchaVerifier)
      self.setState({codeIsSent: true, confirmation: response, loading: false})
    } catch (e) {
      this.showAlert(e.message)
      self.setState({loading: false})
    }
  }



  alertTapped = (type) => {
    if (type === "ERROR") {
      this.setState({alert: false})
    }
  }



  showAlert = (e) => {
    Keyboard.dismiss()
    console.log(e)
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

  confirm = (phoneNumber) => {
    this.setState({loading: true})
    this.state.confirmation.confirm(phoneNumber)
    .then((result) => {
      this.setState({ codeIsSent: false})
      this.props.signIn(result.user.uid)
    })
    .catch((err) => {
      this.setState({ loading: false })
      this.showAlert("Неверный код")
    });
  }

  /*
      MARK: UI DESIGN
  */
  renderCaptchScreen = () => {
    return (
      <View style={{ marginTop: 100 }}>
        <Modal
        visible={this.state.showModal}
        onRequestClose={() => this.setState({ showModal: false })}
        >
          <View style={{
            width: '100%', backgroundColor: '#DA0501',
            display: 'flex', paddingTop: 25, paddingBottom: 20, alignItems: 'center', justifyContent: 'center'
          }}>
              <Text style={{
                fontFamily:'Ubuntu-Bold', color: '#fff',
                fontSize: 20
              }}>Coca Cola</Text>
          </View>
          <WebView
            source={{ uri: captchaUrl }}
            onNavigationStateChange={data =>
              this._handleResponse(data)
            }
            injectedJavaScript={`document.f1.submit()`}
          />
        </Modal>
      </View>
    )
  }


  render () {
    return (
      <SafeAreaView style={{flex: 1, width: '100%', backgroundColor: RED_COLOR, fontFamily: 'Ubuntu-Regular'}}>
          <View style={{flex: 1, margin: 20, marginTop: 8, zIndex: 2, display: 'flex'}}>
              { this.state.alert === false ? null :
                <AlertView
                  title={this.state.alert.title}
                  des={this.state.alert.des}
                  type={this.state.alert.type}
                  img={this.state.alert.img}
                  onAlertTap={this.state.alert.tapped}
                  special={true}
                />
              }
              <View style={styles.nav}>
                  <Image style={styles.logo} source={require('../Images/logo.png')}/>
              </View>
              {this.state.codeIsSent ?
                <ConfirmationView
                  resend={this.resend}
                  confirm={this.confirm}
                  back={this.back}
                  phone={this.state.phone}
                /> :
                <AuthenticationForm login={this.login} showAlert={this.showAlert}/>
              }
          </View>
          <Image
            style={styles.bottle}
            source={require('../Images/logo.png')}
          />
          {this.state.loading ? <Spinner/> : null}
          {this.renderCaptchScreen()}
      </SafeAreaView>
    )
  }
}



class ConfirmationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 60,
      timeFinished: false,
      phoneNumber: "",
      code: ""
    }
  }
  startTimer = () => {
    let self = this
    this.setState({
      timeisDoing: true, time: 60
    }, () => {

      this.timer = setInterval(() => {
        if (self.state.time == 0) {
          this.stopTimer()
          self.setState({timeFinished: true, timeisDoing: false})
        } else {
          self.setState({
            time: self.state.time - 1
          })
        }
      }, 1000)
    })
  }
  stopTimer = () => {
    this.setState({timeisDoing: false})
    clearInterval(this.timer)
  }

  componentDidMount() {
    this.startTimer()
  }
  confirm = () => {

    if (this.state.code.length == 6) {

        this.props.confirm(this.state.code)
    } else {

    }
  }
  render() {

    return (
      <View>
        <Text style={styles.title}>Успешно</Text>
        <Text style={styles.p}>SMS с кодом отправлен на ваш номер:{"\n"}{this.props.phone}</Text>
        <CodeInput
            ref="codeInputRef2"
            keyboardType="numeric"
            codeLength={6}
            inactiveColor='#fff'
            autoFocus={false}
            size={40}
            compareWithCode={false}
            textChange={(e)=>{
              this.setState({ code: e })
            }}
            codeInputStyle={{ fontWeight: '800', backgroundColor:"#DA0501" }}
            onFulfill={(isValid, code) => {}}
        />

        {this.state.timeFinished ?
          <TouchableOpacity onPress={()=>{
            this.props.resend()
          }} style={{ marginTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#fff', fontWeight: '700'}}>Переотправить код</Text>
          </TouchableOpacity>
          :
          <Text style={{...styles.p, marginTop: 80, textAlign:'center'}}>
             Переотправить 0:{this.state.time > 9 ? this.state.time : "0" + this.state.time}
          </Text>
        }

        <TouchableOpacity style={styles.submit} onPress={this.confirm}>
            <Text style={{...styles.des, color: RED_COLOR, fontWeight: '700', fontSize: 18}}>Далее</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          this.props.back()
        }} style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',}}>
            <Text style={{color: '#fff', fontWeight: '700', textAlign: 'left'}}>Назад</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class AuthenticationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      phoneMask: ""
    }
  }
  send = () => {
    if (this.state.phoneMask.length == 17) {
      this.props.login(this.state.phoneMask)
    } else {
      this.props.showAlert("Введите корректный номер")
    }
  }
  render () {
    return (
      <View>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.p}>Введите номер телефона</Text>
        <TextInputMask
           type={'custom'}
           options={{
             mask: '+7(999)-999-99-99'
           }}
           style={styles.phoneInput}
           underlineColorAndroid = "transparent"
           placeholder = "+7 XXX XXX XX XX"
           placeholderTextColor = {RED_COLOR}
           value={this.state.phoneMask}
           onChangeText={(phoneMask, phone) => this.setState({phoneMask, phone})}
           keyboardType={'numeric'}
        />
        <Text style={{...styles.p, marginTop: 24}}>
          <Text style={{color:'#fff', fontWeight: '900'}}>Прочитайте правила. </Text>
          Входя в приложение, вы принимаете ее условия
        </Text>
        <TouchableOpacity style={styles.submit} onPress={this.send}>
            <Text style={{...styles.des, color: RED_COLOR, fontWeight: '700', fontSize: 18}}>Далее</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
/* DESIGN UI:*/

const styles = StyleSheet.create ({
   nav: {
     height: 60,
     display: 'flex',
     alignItems: 'flex-start',
     justifyContent: 'center'
   },
   logo: {
     width: 80,
     resizeMode: 'contain',
   },
   title: {
     fontWeight: '700',
     fontSize: 28,
     textShadowColor: 'rgba(0,0,0,0.2)',
     textShadowRadius: 10,
     marginTop: 15,
     color: '#fff',
     fontFamily: 'Ubuntu-Bold'
   },
   p: {
     fontWeight: '500',
     fontSize: 15,
     color: '#fff',
     opacity: 0.8,
     fontFamily: 'Ubuntu-Regular'
   },
   phoneInput: {
     padding: 15, paddingLeft: 20,
     paddingRight: 20, backgroundColor: '#ff5a57',
     marginTop: 32, fontSize: 16, fontWeight: '900',
     borderBottomColor: "red", borderBottomWidth: 2,
     borderRadius: 8, color: "#FFF",
     fontFamily: 'Ubuntu-Bold'
   },
   submit: {
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     padding: 15, backgroundColor: '#fff',
     marginTop: 24, borderRadius: 8,
     fontFamily: 'Ubuntu-Regular'
   },
   bottle: {
     zIndex: 1,
     position: 'absolute',
     resizeMode: 'cover',
     bottom: 0, width: '400%', height: '80%',
     left: 0, tintColor: '#DA0501'
   }
})



export default Auth;
