import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text,  TextInput,  TouchableOpacity,  View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';

import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Feather } from "@expo/vector-icons";


const CreateScreen = ({ navigation }) => {
    const [camera, setCamera] = useState(true);
    const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions(null); 
    const [type, setType] = useState(Camera.Constants.Type.back);   
    const [isActiveBtn, setIsActiveBtn] = useState(false)
    const [photo, setPhoto] = useState('');
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState("");
    const [geocode, setGeocode] = useState("");
    
    // useEffect(() => {
    //     (async () => {      
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         console.log('status', status);
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }            
    //     })();
    // }, []);
    
    if (!cameraPermission) {
        // Camera permissions are still loading
        return <View />;
    };
 
    if (!cameraPermission.granted) {
        // Camera permissions are not granted yet
        return (
        <View style={styles.container}>
            <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
            </Text>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btnPermission}
                onPress={setCameraPermission}
            >
                    <Text style={styles.btnPermissionTitle}>GRANT PERMISSION</Text>
            </TouchableOpacity>            
        </View>            
        ); 
    } 
    // console.log('cameraPermission:', cameraPermission.status);


    const locationUpdates = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Insufficient permissions!",
                    "Sorry, we need location permissions to make this work!",
                    [{ text: "Okay" }]
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            console.log('location', location);
            // console.log('latitude', location.coords.latitude);
            // console.log('longitude', location.coords.longitude);
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }
    };

    // const getGeocodeAsync = async () => {
    //     let geocode = await Location.reverseGeocodeAsync(location);
    //     console.log('geocode', geocode);
    //     setGeocode({ geocode });
    //     setGeocode(({ geocode }) => geocode[0]);
    // };
    const handleGeocode = (text) => setGeocode(text);

    const takePhoto = async () => {     
        const photo = await camera.takePictureAsync();
        // console.log('Camera----->', photo.uri);
        setPhoto(photo.uri);
        console.log('photo:', photo);   
        setIsActiveBtn(true);
        locationUpdates();
        // getGeocodeAsync();
    };

    const sendPhoto = () => {
        console.log('navigation', navigation);
        navigation.navigate('DefaultScreen', { photo, location, title })
    }

    const handleTypeOfCamera = () =>
    setType(
        type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
    );
    // console.log('typeCamera:', type); 
    
    const deletePhoto = () => {
        setIsActiveBtn(false)
        setPhoto(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png");
        // setTitle(null);
        // setGeocode('');
    }

    const uploadPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setIsActiveBtn(true);

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
            console.log('canceled photo', photo);
        }
    };
 

    return (
    <>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Post</Text>
        </View>
        <ScrollView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.cameraOver} >
                    <Camera style={styles.camera} ref={setCamera} type={type} >
                        {photo && (
                        <View style={styles.takePhotoContainer}>
                            <Image source={{uri: photo}} style={{ height: '100%', width: '100%'}} />                                      
                        </View> ) }
                        <TouchableOpacity></TouchableOpacity>
                        {!isActiveBtn &&(
                            <TouchableOpacity style={{...styles.cameraBtn, top: 20, right: 10,}} onPress={handleTypeOfCamera}>
                                <MaterialIcons name="flip-camera-ios" size={24} color="black" />
                            </TouchableOpacity>)}
                        {!isActiveBtn &&(
                            <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
                                <FontAwesome5 name="camera" size={34} color="black" />
                            </TouchableOpacity>)}
                        {!isActiveBtn && (
                            <TouchableOpacity style={{...styles.cameraBtn, bottom: 20, left: 10}} onPress={uploadPhoto}>
                                <Entypo name="upload" size={24} color="black" />
                            </TouchableOpacity>)}
                        {isActiveBtn && (
                            <TouchableOpacity style={{...styles.cameraBtn, bottom: 20, right: 10}} onPress={deletePhoto}>
                                <MaterialIcons name="delete" size={24} color="black" />
                            </TouchableOpacity>)} 
                    </Camera>
                </View>
                <TextInput
                    placeholder="Name..."
                    placeholderTextColor="#BDBDBD"
                    style={styles.pictureName}
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <View style={styles.locationSection}>
                    <TextInput
                        // onLongPress={getGeocodeAsync}
                        onChangeText={handleGeocode}
                        placeholder="Location..."
                        placeholderTextColor="#BDBDBD"
                        style={styles.location}
                        // value={ 
                        //     geocode.region
                        //     ? `${geocode.region}, ${geocode.country}, ${geocode.district}`
                        //     : geocode
                        // }
                    />
                    <TouchableOpacity 
                        // onPress={getGeocodeAsync}
                    >
                        <Feather 
                            name="map-pin"
                            style={styles.locationIcon} 
                            size={24} 
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                        style={{
                            ...styles.sendContainer,
                            backgroundColor: isActiveBtn ? "#FF6C00" : "#F8F8F8",                            
                        }}
                    onPress={isActiveBtn ? sendPhoto : null}
                >                    
                    <Text style={{
                        ...styles.sendLabel, 
                        color: isActiveBtn ? "#F6F6F6" : "#BDBDBD",
                        }}
                    >PUBLISH</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={delete}
                    style={{...styles.delete,  }}
                >
                    <Feather name="trash-2" size={24} color={isActiveBtn ? "#212121" : "#BDBDBD"} />
                </TouchableOpacity> */}  
            </View>
        </ScrollView>
    </>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    header: {
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 10,
        height: 78,
        backgroundColor: '#fff',

        borderBottomWidth: 1,
        borderBottomColor: "#BDBDBD",
    },    
    headerTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        lineHeight: 22,
        marginBottom: 14,
    },
    cameraOver: {
        borderRadius: 8,
        height:  340,
        marginVertical: 16,
        
        overflow: 'hidden',
    },
    camera: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },    
    btnPermission: {
        height: 40,
        width: 180,
        borderRadius: 6,
        borderWidth: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#4169e1',
        borderColor: '#f0f8ff',
        shadowColor: '#171717',
        shadowOffset: {width: 2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
    },
    btnPermissionTitle: {
        color: '#f0f8ff',
        fontSize: 16,
    },    
    takePhotoContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        borderRadius: 8,
    },
    cameraBtn: {
        position: 'absolute',  
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        justifyContent: "center",
        alignItems: "center",  
    },
    snapContainer: {
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pictureName: {
        fontSize: 16,
        fontFamily: "Roboto-Regular",
        alignItems: "flex-start",
        height: 50,
        borderBottomWidth: 1,
        width: "100%",
        borderColor: "#E8E8E8",
        marginBottom: 16,
    },
     locationSection: {
        flexDirection: "row-reverse",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 32,
    },
    location: {
        flex: 1,        
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        lineHeight: 19,
        alignItems: "flex-start",
        height: 50,
        borderBottomWidth: 1,
        width: "100%",
        borderColor: "#E8E8E8",
        paddingLeft: 24,
        marginLeft: -24,
    },   
    locationIcon: {
        color: "#BDBDBD",
        alignSelf: "flex-start",
        marginRight: 4,
    },    
    sendContainer: {
        marginHorizontal: 30,
        height: 51,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',    
        marginBottom: 32,
    },
    sendLabel: {
        fontSize: 16,
        lineHeight: 19,
        fontFamily: 'Roboto-Regular',
    },
    delete: {
        width: 70,
        height: 40,
        alignSelf: 'center',
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        magrinTop: 120,
    },
})

export default CreateScreen;