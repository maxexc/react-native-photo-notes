import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ route }) => {
    console.log( 'route.params.location', route.params.location);
    const { latitude, longitude } = route.params.location; 

    return (
        <View style={styles.container}>
            <MapView
                style={styles.container}
                region={{
                    latitude:latitude,
                    longitude: longitude,
                    longitudeDelta: 0.1,
                    latitudeDelta: 0.4,
                }}
                mapType="standard"
                minZoomLevel={1}
                onMapReady={() => console.log("Map is ready")}
                //  onRegionChange={() => console.log("Region change")}
            >
                <Marker
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    title='travel photo'
                    description='location'
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#cfcfcf8f',
    }
})

export default MapScreen;