import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from "expo-location";
import { Feather, FontAwesome5, Entypo, MaterialIcons } from "@expo/vector-icons";
import { pickImage } from "../../util/pickImage";
import { addImageToServer, addPostToServer } from "../../firebase/serverAPI";


const CreateScreen = ({ navigation }) => {
    const [camera, setCamera] = useState(true);
    const [cameraPermission, setCameraPermission] = Camera.useCameraPermissions(null); 
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);    
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState({latitude: -76, longitude: 22});
    const [title, setTitle] = useState("");
    const [geoaddress, setGeoaddress] = useState('');
    const { userId, nickName, userPhoto } = useSelector((state) => state.auth);
    const [isLoader, setIsLoader] = useState(false);
    
    useEffect(() => {
        const getPermissions = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                };            
                let currentLocation = await Location.getCurrentPositionAsync();
                setLocation({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                });  
                await reverseGeocode();
            } catch (error) {
                console.log(error);
            }
        }
        getPermissions();    
    }, [photo]);
    
    if (!cameraPermission) {
        // Camera permissions are still loading
        return <View />;
    };
 
    if (!cameraPermission.granted) {
        // Camera permissions are not granted yet
        return (
        <View style={{...styles.container, alignItems: 'center', justifyContent: 'center'}}>
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
    };

    const reverseGeocode = async () => {
        try {
            let geocode = await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude,
            });
            if (geocode[0].city === null && geocode[0].district === null) {
                 setGeoaddress(`${geocode[0].country}`);
            } else setGeoaddress(`${geocode[0].city}, ${geocode[0].country}, ${geocode[0].district}`);
        } catch (error) {
            console.log(error);
        }
    }

    const handleGeocode = (text) => setGeoaddress(text);

    const takePhoto = async () => {           
        setIsLoader(true);
        const options = {
            quality: 0.8,
        };
        try {
            const photo = await camera.takePictureAsync(options);
            setPhoto(photo.uri);  
            setIsActiveBtn(true);
            reverseGeocode();
            setIsLoader(false);
        } catch (error) {
            console.log(error);
        };
    };

    const sendPost = async () => {
        Keyboard.dismiss();
        navigation.navigate('DefaultScreen', { photo, location, title, geoaddress });
        const image = await addImageToServer(photo);
        const dateNow = Date.now().toString();

        await addPostToServer({
            userId: userId,
            nickName: nickName,
            userPhoto: userPhoto,
            photo: image,
            title: title,
            location: location,
            geoaddress: geoaddress,
            date: dateNow,
            comments: 0,
            likes: [],
        });
        setIsActiveBtn(false);
    }

    const handleTypeOfCamera = () =>
    setCameraType(
        cameraType === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
    );
    // console.log('cameraType:', cameraType); 
    
    const deletePhoto = () => {
        setIsActiveBtn(false);
        setPhoto("https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png");
        setGeoaddress('');
    };

    const handlePickImage = async () => {
        const resultPickImages = await pickImage();
        await reverseGeocode();
        
        if (resultPickImages !== undefined) {
            await reverseGeocode();
            setPhoto(resultPickImages);
            setIsActiveBtn(true);
        };
    };
 

    return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >    
        <KeyboardAvoidingView style={{flex: 1,  backgroundColor: '#fff',}} behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <ScrollView  >            
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create Post</Text>
                </View> 
            <View style={styles.container}>    
                {isLoader && (
                        <ActivityIndicator
                            style={styles.loader}
                            size='large'
                            color="#FF6C00"
                        />
                    )}                           
                <View style={styles.cameraOver} >
                    <Camera style={styles.camera} ref={setCamera} type={cameraType} >
                        {photo && (
                        <View style={styles.takePhotoContainer}>
                            <Image source={{uri: photo}} style={{ height: '100%', width: '100%'}} />                                      
                        </View> ) }
                        <TouchableOpacity></TouchableOpacity>
                        {!isActiveBtn &&(
                            <TouchableOpacity onPress={handleTypeOfCamera} style={{...styles.cameraBtn, top: 20, right: 10,}} >
                                <MaterialIcons name="flip-camera-ios" size={24} color="black" />
                            </TouchableOpacity>)}
                        {!isActiveBtn &&(
                            <TouchableOpacity onPress={takePhoto} style={styles.snapContainer}>
                                <FontAwesome5 name="camera" size={34} color="black" />
                            </TouchableOpacity>)}
                        {!isActiveBtn && (
                            <TouchableOpacity onPress={handlePickImage} style={{...styles.cameraBtn, bottom: 20, left: 10}} >
                                <Entypo name="upload" size={24} color="black" />
                            </TouchableOpacity>)}
                        {isActiveBtn && (
                            <TouchableOpacity onPress={deletePhoto} style={{...styles.cameraBtn, bottom: 20, right: 10}} >
                                <MaterialIcons name="delete" size={24} color="black" />
                            </TouchableOpacity>)} 
                    </Camera>
                </View>               
                <TextInput
                    keyboardType="default"
                    placeholder="Name..."
                    placeholderTextColor="#BDBDBD"
                    style={styles.pictureName}
                    value={title}
                    onChangeText={text => setTitle(text)}
                />
                <View style={styles.locationSection}>
                    <TextInput
                        keyboardType="default"
                        onLongPress={reverseGeocode}
                        onChangeText={handleGeocode}
                        placeholder="Location..."
                        placeholderTextColor="#BDBDBD"
                        style={styles.location}
                        value={geoaddress}
                    />
                    <TouchableOpacity 
                        onPress={reverseGeocode}
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
                    onPress={isActiveBtn ? sendPost : null}
                >                    
                    <Text style={{
                        ...styles.sendLabel, 
                        color: isActiveBtn ? "#F6F6F6" : "#BDBDBD",
                        }}
                    >PUBLISH</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
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
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
    },
    btnPermissionTitle: {
        color: '#f0f8ff',
        fontSize: 16,
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
        height: 340,
        marginVertical: 16,
        overflow: 'hidden',
    },
    camera: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
    loader: {
        position: "absolute",
        bottom: "30%",
        right: '48%',
        zIndex: 1,
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
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
});

export default CreateScreen;