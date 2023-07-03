import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { authSignInUser } from '../../redux/auth/authOperations';
import { useDimantions } from '../../util/useDimentions';
import { ActivityIndicator } from 'react-native';
import { authSlice } from '../../redux/auth/authSlice';
import { Toast } from 'toastify-react-native';


const initialState = {
    email: '',
    password: '',
};

export const LoginScreen = ({ navigation }) => {
    const [state, setState] = useState(initialState);
    const [isKeyboardShown, setIsKeyboardShown] = useState(true);
    const [isSecureText, setIsSecureText] = useState(true);
    const [isActiveMail, setIsActiveMail] = useState(false);
    const [isActivePass, setIsActivePass] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    let { errorLogin } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const {orientation, currentDimentions} = useDimantions();

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyboardShown(false);
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardShown(true);
        });

        checkMail();
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [isKeyboardShown, orientation, errorLogin]);

    const checkMail = () => {
        if (errorLogin !== null) {
            setIsLoader(false);
            Toast.error('💭 Sorry, this user/pass         is NOT exist❗', 'center');
            dispatch(authSlice.actions.setErrorLogin({ errorLogin: null }));
        };
    };    

    const handleSubmit = () => {
        setIsLoader(true);
        Keyboard.dismiss();
        dispatch(authSignInUser(state));
        setState(initialState);
    };

    const warring = () => {
        Toast.warn('Input fields cann`t be empty 👀', 'center');
    };
    const warringEmail = () => {
        Toast.warn('Please put "@" in          Email', 'center');
    };
    const warringPassword = () => {
        Toast.warn('Password must be at least 6 symbols 💬 ', 'center');
    };

    return (   
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground
                    source={require("../../assets/background.jpg")}
                    style={styles.background}
                >
                    {isLoader && (
                        <ActivityIndicator
                            style={styles.loader}
                            size='large'
                            color="#FF6C00"
                        />
                    )}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                    >
                        {/* main form */}
                        <View
                            style={{
                                ...styles.form,
                                paddingBottom: isKeyboardShown ? 40 : 16,
                                width: currentDimentions,
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
                                    onPress={() => {
                                        if ((state.email.trim() === "") && (state.password.trim()) === "") {
                                            warring();
                                            return;
                                        } if (state.email.indexOf('@') === -1) {
                                            warringEmail();
                                            return;
                                        } if (state.password.length < 6) {
                                            warringPassword();
                                            return;
                                        } else {
                                            handleSubmit()
                                            return;
                                        }
                                    }}
                                >
                                        <Text style={styles.submitBtnText}>SIGN IN</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity  
                                    activeOpacity={0.6} 
                                    onPress={() => navigation.navigate('Registration')}
                                    style={{ paddingVertical: 5 }}
                                >
                                    <Text style={styles.linkToLoginPageText}>Don't have an account?
                                        <Text style={{ fontFamily: 'Roboto-Bold' }}> Sign up</Text>
                                    </Text>
                                </TouchableOpacity> 
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
    loader: {
        position: "absolute",
        bottom: "42%",
        right: '45%',
        zIndex: 1,
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
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
        paddingVertical: 3,
    },
    showPassText: {        
        fontSize: 16,
        color: '#1B4371',
        lineHeight: 19,
        fontFamily: "Roboto-Regular",
    },
    submitBtn: {
        marginTop: 27,
        marginBottom: 11,
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
})