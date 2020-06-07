import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {AsyncStorage, View} from 'react-native'
import { firestore } from './backend'
import Spinner from './Pages/Spinner'
import Home from './Pages/Home'
import Awards from './Pages/Awards'
import Auth from './Pages/Auth'
import Stats from './Pages/Stats'
const Stack = createStackNavigator();
import AlertView from './components/Alert'
import Onboarding from './Pages/Onboarding'
import RNLocation from 'react-native-location';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'LOAD',
      data: {},
      location: [],
      alert: false,
      onboarding: false
    }

  }

  getData = async (key) => {
    let self = this
    try {
      const value = await AsyncStorage.getItem(key)
      if (value == null) {
        self.setState({user: false})
      } else {
        self.loadUser(value)
      }
    } catch(e) {

    }
  }
  setData = async (key, value) => {
    try {
      const operation = await AsyncStorage.setItem(key, value)
    } catch (e) {

    }
  }


  signIn = async (user) => {
    try {
      await AsyncStorage.setItem('user', user)
      this.loadUser(user)
    } catch (e) {
    }
  }
  signOut = async () => {
    try {
      await AsyncStorage.setItem('user', "")
      this.setState({ user: false })
    } catch (e) {
    }
  }


  async componentDidMount () {
    let self = this
    try {
       const value = await AsyncStorage.getItem('onboarding')
       if (value === "true") {
         console.log(value)
         self.setState({
           onboarding: true
         })
       }
    } catch (e) {
      console.log(e)
    }
    self.getData("user")
  }

  loadUser = async (user) => {
    let self = this
    try {
      const response = await firestore.loadPersonalData(user)
      if (response.exists) {
        self.setState({data: response.data() })
      } else {
        self.setMyLocation(user)
      }
      self.loadCoins(user)
    } catch (e) {
      console.log('user', e)
      self.showAlert(e.message)
    }
  }

  loadCoins = async (user) => {
    try {
      const response = await firestore.getCode()
      var t = this.state.data
      if (response.exists) {
        t.codes = response.data().codes
      } else {
        t.codes = []
      }
      this.setState({ data: t, user })
    } catch (e) {
      this.showAlert(e.message)
    }
  }


  setMyLocation = (user) => {

    RNLocation.configure({
      distanceFilter: 1, // Meters
      desiredAccuracy: {
        ios: "best",
        android: "balancedPowerAccuracy"
      },
      // Android only
      androidProvider: "auto",
      interval: 200000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
  })

  RNLocation.requestPermission({
    ios: 'whenInUse', // or 'always'
    android: {
      detail: 'coarse', // or 'fine'
      rationale: {
        title: "We need to access your location",
        message: "We use your location to show where you are on the map",
        buttonPositive: "OK",
        buttonNegative: "Cancel"
      }
    }
  });

  const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
    var location = locations[0]
    this.setState({ location: [location.latitude, location.longitude] });
    this.geocode([location.latitude, location.longitude], user)
    unsubscribe();
  });

}

  geocode = ( coords, user ) => {
    let url = "https://us1.locationiq.com/v1/reverse.php?key=cc37d9badc7523&lat=" + coords[0] + "&lon=" + coords[1] + "&format=json"
    fetch (url, {
      method: "GET"
    }).then((response) => response.json())
    .then((json) => {
      let city = json.address.state
      this.uploadData(user, city)
    }).catch((error) => {
       this.showAlert(error.message)
    });
  }


  presentApp = () => {
    this.setData('onboarding', "true")
    this.setState({onboarding: true})
  }
  addData = (object) => {
    var a = this.state.data
    a.push(object)
    this.setState({data: object})
  }

  uploadData = async (user, city) => {
    let self = this
    let {location} = this.state
    try {
      const response = await firestore.setLocation(user, location, city)
      self.setState({ user: user, data: {l: location} })
    } catch (e) {
      self.showAlert(e.message)
      self.setState({ user: user })
    }
  }
  showAlert = (e) => {
    this.setState({
      alert: {
        "title": "Упс...",
        "des": e,
        "img": require("./Images/error.png"),
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
  updateData = (data, point, codes) => {
    var d = this.state.data
    d.data = data
    d.point = point
    d.codes = codes
    this.setState({ data: d })
  }
  render () {
    if (this.state.user === "LOAD") {
      return (
        <View
          style={{flex: 1, width: '100%', height: '100%', display: 'flex'}}
        >
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
            <Spinner/>
        </View>
      )
    } else if (this.state.user == false) {
      return (
        <Auth
            signIn={this.signIn}
        />
      )
    } else if (!this.state.onboarding) {
      return (
        <Onboarding
          presentApp={this.presentApp}
        />
      )
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false}}
                initialParams={{
                  data: this.state.data,
                  signOut: this.signOut,
                  uid: this.state.user,
                  updateData: this.updateData,
                  addData: this.addData
                }}
            />
            <Stack.Screen
                name="Stats"
                component={Stats}
                options={{ headerShown: false}}
                initialParams={{
                  data: this.state.data
                }}
            />
            <Stack.Screen
                name="Awards"
                component={Awards}
                options={{ headerShown: false}}
                initialParams={{
                  data: this.state.data,
                  uid: this.state.user
                }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
  }
}



export default App;
