import React, { useEffect, useState } from 'react';
import * as ScreenOrientation from "expo-screen-orientation";
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
} from 'react-native';
import { useDispatch } from 'react-redux';
import { onStateChange } from '../../redux/auth/authSlice';


const initialState = {
    email: '',
    password: '',
}

export const LoginScreen = ({ navigation }) => {
    const [state, setState] = useState(initialState)
    const [isKeyboardShown, setIsKeyboardShown] = useState(true);
    const [isSecureText, setIsSecureText] = useState(true);
    const [isActiveMail, setIsActiveMail] = useState(false);
    const [isActivePass, setIsActivePass] = useState(false);

    const dispatch = useDispatch()
    
    // ----WARNING---- check orientation ----WARNING---- //    
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        checkOrientation();
        const subscription = ScreenOrientation.addOrientationChangeListener(
        handleOrientationChange
        );
        return () => {
        ScreenOrientation.removeOrientationChangeListeners(subscription);
        };
    }, []);
    const checkOrientation = async () => {
        const orientation = await ScreenOrientation.getOrientationAsync();
        setOrientation(orientation);
    };
    const handleOrientationChange = (e) => {
        setOrientation(e.orientationInfo.orientation);
    };
    // console.log(orientation);    
    
    const [widthDimensions, setWidthDimensions] = useState();   

    useEffect(() => {
        // ----WARNING---- check orientation ----WARNING---- //
        
        if (orientation !== 1) {
            return setWidthDimensions((Dimensions.get('window').width) / 2);
        } else setWidthDimensions((Dimensions.get('window').width) - 20 * 2);

        // -------------------------------------------------- //

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
    }, [isKeyboardShown, orientation]);

    const handleSubmit = () => {
        Keyboard.dismiss();
        // console.log(state);
        console.log('email:', state.email, 'password:', state.password); 
        dispatch(onStateChange())
        // dispatch(authSignUpUser(state));
        setState(initialState);
    };

    return (   
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground
                    source={require("../../assets/background.jpg")}
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
                            {/* title & inputs */}
                            <Text style={styles.title}>Login</Text>
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
                                        <Text style={styles.submitBtnText}>SIGN IN</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity  
                                    activeOpacity={0.6} 
                                    onPress={() => navigation.navigate('Registration')}
                                >
                                    <Text style={styles.linkToLoginPageText}>Don't have an account?
                                        <Text style={{ fontFamily: 'Roboto-Bold' }}> Sign up</Text>
                                    </Text>
                                </TouchableOpacity> 
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
    title: {
        fontSize: 30,
        lineHeight: 35,
        letterSpacing: 0.72,
        marginTop: 32,
        marginBottom: 33,
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
    linkToLoginPageText: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#1B4371',
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },   
    homeIndicator: {
        position: 'absolute',
        height: 5,
        width: 134,
        alignSelf: 'center',
        bottom: 6,
        backgroundColor: '#212121',
        borderRadius: 100,
    },
})