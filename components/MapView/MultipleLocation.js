import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Button, Icon, Container, Header, Left, Right, Body, Title } from 'native-base';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions';


class LocationA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 26.85046,
      longitude: 75.7690263,
      error: null,
      concat: null,
      coords: [],
      x: 'false',
      cordLatitude: 26.85046,
      cordLongitude: 75.7690263,
      cordinates: [],
      isMapReady: false,
    };

    this.mergeLot = this.mergeLot.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.handleGetDirections = this.handleGetDirections.bind(this);
  }
  static navigationOptions = {
    header: null,
};

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
       (position) => {
         this.setState({
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           error: null,
         });
         this.mergeLot();
       },
       error => this.setState({ error: error.message }),
       { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
     );
   }

   handleGetDirections = () => {
    const data = {
       source: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
      destination: {
        latitude: 26.85046,
        longitude: 75.7690263,
      },
      params: [
        {
          key: 'travelmode',
          value: 'driving', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
    };
    getDirections(data);
  }

  mergeLot() {
    if (this.state.latitude != null && this.state.longitude!=null) {
       let concatLot = this.state.latitude +','+this.state.longitude;
       this.setState({
         concat: concatLot,
       }, () => {
         this.getDirections(concatLot, '26.85046,75.7690263');
       });
     }
   }

   openYourLocation = () => {
    return (
      Alert.alert(
      `This is Your Location`,
      ``,
      [
          { text: 'OK', onPress: () => { } },
      ],
      { cancelable: true }
  )
    );
   }

   async getDirections(startLoc, destinationLoc) {
         try {
             let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`);
             let respJson = await resp.json();
             let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
             let coords = points.map((point, index) => {
                 return {
                   latitude: point[0],
                   longitude: point[1],
                 };
             });
             this.setState({ coords: coords });
             this.setState({ x: 'true' });
             return coords;
         } catch (error) {
           console.log('masuk fungsi');
             this.setState({ x: 'error' });
             return error;
         }
     }
     onMapLayout = () => {
       this.setState({ isMapReady: true });
      }
  render() {
    return (
      <Container style={{ flex: 1 }}>
        <Header translucent={false} >
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Icon name='arrow-back' style={{ color: '#fff' }} />
                </Button>
            </Left>
            <Body style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Title >Location Map</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            </Right>
        </Header>
        {/* <Content style={{ flex: 1 }}> */}
        <View style={{ flex: 1 }}>

       <MapView style={styles.map}
       onLayout={this.onMapLayout}
       region={{
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
       }}>
        {
          this.state.isMapReady &&
          <React.Fragment>
          {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
            coordinate={{ 'latitude': this.state.latitude, 'longitude': this.state.longitude }}
            title={ 'Your Location'}
            onPress={() => this.openYourLocation()}
          />}
          {!!this.state.cordLatitude && !!this.state.cordLongitude && <MapView.Marker
             coordinate={{ 'latitude': this.state.cordLatitude, 'longitude': this.state.cordLongitude }}
             title={'Your Destination'}
           />}

          {!!this.state.latitude && !!this.state.longitude && this.state.x == 'true' && <MapView.Polyline
               coordinates={this.state.coords}
               strokeWidth={2}
               strokeColor="blue"/>
           }
           {!!this.state.latitude && !!this.state.longitude && this.state.x == 'error' && <MapView.Polyline
             coordinates={[
                 { latitude: this.state.latitude, longitude: this.state.longitude },
                 { latitude: this.state.cordLatitude, longitude: this.state.cordLongitude },
             ]}
             strokeWidth={2}
             strokeColor="blue"/>
            }
          </React.Fragment>
        }

       </MapView>
       </View>
        {/* </Content> */}
        <Button transparent onPress={this.handleGetDirections}>
        <Icon size={30}
                 color={'#fff'}
                 name={'ios-man'}
                //  onPress={this.handleGetDirections}
                 />
                 <Text>Get Directions</Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default LocationA;
