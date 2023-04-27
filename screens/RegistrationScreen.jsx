import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity, 
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';


const initialState = {
    avatar: null,
    login: '',
    email: '',
    password: '',
}

export const RegistrationScreen = () => {
    // console.log(Platform.OS);
    const [state, setState] = useState(initialState)
    const [isKeyboardShown, setIsKeyboardShown] = useState(true);
    const [isSecureText, setIsSecureText] = useState(true);
    const [isActiveLogin, setIsActiveLogin] = useState(false);
    const [isActiveMail, setIsActiveMail] = useState(false);
    const [isActivePass, setIsActivePass] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const [widthDimensions, setWidthDimensions] = useState(
        Dimensions.get('window').width - 20 * 2,
    )   

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyboardShown(false);
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardShown(true);
        });
        
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [isKeyboardShown]);

    const handleSubmit = () => {    
        Keyboard.dismiss();
        // console.log(state);
        console.log('login:', state.login, 'email:', state.email, 'password:', state.password);
        // dispatch(authSignUpUser(state));
        setState(initialState);
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        console.log(avatar);
        }
    };

    return (   
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground
                    source={require("../assets/background.jpg")}
                    style={styles.background}                      
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    >
                        {/* main form */}
                        <View
                            style={{
                                ...styles.form,
                                paddingBottom: isKeyboardShown ? 45 : 16,
                                width: widthDimensions,
                        }}>
                        
                        {/* avatar   button add/delete avatar */}
                            <View style={styles.avatar}>
                                <Image source={{ uri: avatar }} style={styles.avatarImg} />
                                {avatar ? (
                                <Pressable onPress={() => {setAvatar(null);}} >
                                    <View style={styles.removeAvatarIcon}>
                                        <AntDesign name="closecircleo" style={{transform: [{ rotate: '45deg' }]}} color="#BDBDBD" size={25} />
                                    </View>
                                </Pressable>
                                ) : (
                                <Pressable onPress={pickImage}>
                                    <View style={styles.addAvatarIcon}>
                                        <AntDesign name="pluscircleo" color="#FF6C00" size={25}/>
                                    </View>
                                </Pressable>
                                )}
                            </View>                            

                            {/* title & inputs */}

                            <Text style={styles.title}>Registration</Text>
                            <TextInput
                                keyboardType="default"
                                autoComplete="name"
                                style={{
                                    ...styles.input,
                                    borderColor: isActiveLogin ? "#FF6C00" : "#E8E8E8",
                                    backgroundColor: isActiveLogin ? "#FFFFFF" : "#F6F6F6",
                                }}
                                onFocus={() => setIsActiveLogin(true)}
                                onBlur={() => setIsActiveLogin(false)}
                                placeholder='Login'
                                placeholderTextColor='#BDBDBD'
                                value={state.login}
                                onChangeText={(value) => setState((prevState) => ({...prevState, login: value}))}
                            />
                            <TextInput
                                keyboardType="email-address"
                                autoComplete="email"
                                style={{
                                    ...styles.input,
                                    borderColor: isActiveMail ? "#FF6C00" : "#E8E8E8",
                                    backgroundColor: isActiveMail ? "#FFFFFF" : "#F6F6F6",
                                }}
                                onFocus={() => setIsActiveMail(true)}
                                onBlur={() => setIsActiveMail(false)}
                                placeholder='Email'
                                placeholderTextColor='#BDBDBD'
                                value={state.email}
                                onChangeText={(value) => setState((prevState) => ({...prevState, email: value}))}
                            />
                            
                            {/* show / hide password */}
                            <View style={{position: 'relative'}}>
                                <TextInput  
                                    keyboardType="default"  
                                    style={{
                                    ...styles.input,
                                    borderColor: isActivePass ? "#FF6C00" : "#E8E8E8",
                                    backgroundColor: isActivePass ? "#FFFFFF" : "#F6F6F6",
                                    }} 
                                    onFocus={() => setIsActivePass(true)}
                                    onBlur={() => setIsActivePass(false)}
                                    placeholder='Password'
                                    placeholderTextColor='#BDBDBD'
                                    value={state.password}
                                    onChangeText={(value) => setState((prevState) => ({...prevState, password: value}))}
                                    secureTextEntry={isSecureText}
                                />
                                <Pressable 
                                    onPress={() => setIsSecureText(prevState => !prevState)}
                                    style={styles.showPass} 
                                >
                                    <Text style={styles.showPassText} >
                                        {isSecureText ? 'Show' : 'Hide'}
                                    </Text>                                        
                                </Pressable>
                            </View>
                                
                        {/* registration button    link to LoginPage*/}                        
                        {isKeyboardShown ? ( 
                            <> 
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.submitBtn}
                                    onPress={handleSubmit}
                                >
                                        <Text style={styles.submitBtnText}>SIGN UP</Text>
                                </TouchableOpacity>
                                
                                <Pressable style={styles.linkToLoginPage} 
                                // onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.linkToLoginPageText}>Already have an account, log in</Text>
                                </Pressable> 
                                <View style={styles.homeIndicator} /> 
                            </> ) : null } 
                        
                        </View>
                    </KeyboardAvoidingView>                               
                </ImageBackground>                                     
            </View>
        </TouchableWithoutFeedback>          
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        backgroundColor: "#97c6f1",
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: "flex-end",        
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        justifyContent: 'flex-end', 
        alignItems: 'center',
    },
    form: {   
        position: 'relative',
        backgroundColor: '#fff',
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 16,        
    },
    avatar: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: 120,
        height: 120,
        backgroundColor: '#F6F6F6',
        borderRadius: 16,
        marginTop: -60,
        alignSelf: 'center',
    },
    avatarImg: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    removeAvatarIcon: {
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
        right: -13,
        bottom: 14,
        backgroundColor: '#fff',
        borderRadius: 50,        
    },
    addAvatarIcon: {
        position: 'absolute',
        color: "#FF6C00",
        right: -12,
        bottom: 14,
    },
    homeIndicator: {
        position: 'absolute',
        height: 5,
        width: 134,
        alignSelf: 'center',
        bottom: 8,
        backgroundColor: '#212121',
        borderRadius: 100,
    },
    title: {
        fontSize: 30,
        lineHeight: 35,
        letterSpacing: 0.72,
        marginTop: 92,
        marginBottom: 32,
        textAlign: 'center',
        color: '#212121',
        fontFamily: 'Roboto-Medium',
    },
    input: {
        marginBottom: 16,
        paddingHorizontal: 16,
        width: '100%',
        height: 50,
        borderRadius: 8,
        color: "#212121",
        borderWidth: 1,
        fontSize: 16,
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },   
    showPass: {
        position: "absolute",
        top: 50 / 2 / 2,
        right: 16,
    },
    showPassText: {        
        fontSize: 16,
        color: '#1B4371',
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },
    submitBtn: {
        marginTop: 27,
        marginBottom: 16,
        height: 51,
        backgroundColor: '#FF6C00',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },
    linkToLoginPage: {
        alignSelf: 'center',
    },
    linkToLoginPageText: {
        fontSize: 16,
        color: '#1B4371',
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },
})