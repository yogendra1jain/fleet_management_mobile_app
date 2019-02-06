import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class LocationMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 26.85046,
            longitude: 75.7690263,
            latitudeDelta: 1,
            longitudeDelta: 1,
        };
    }
    onRegionChange = (region) => {
        // this.setState({
        //     latitude: region.latitude,
        //     longitude: region.longitude,
        //     latitudeDelta: region.latitudeDelta,
        //     longitudeDelta: region.longitudeDelta,
        // });
    }
    componentDidMount() {
        console.log('props in map', navigator.geolocation);
        let position1 = navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('current position', position);
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
              });
            },
            error => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
          console.log('position1', position1);
    }
    render() {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = this.state;
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                onRegionChange={this.onRegionChange}
            >
            {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
                coordinate={{ 'latitude': latitude, 'longitude': longitude }}
                title={'Your Location'}
              />}
              <MapView.Marker
                coordinate={{ 'latitude': 26.85046, 'longitude': 75.7690263 }}
                title={'Friend Location'}
              />
            </MapView>
        );
    }
}
export default LocationMap;
