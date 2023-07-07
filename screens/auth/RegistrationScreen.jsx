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
    Image,
    ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { authSignUpUser } from '../../redux/auth/authOperations';
import { authSlice } from '../../redux/auth/authSlice';
import { uploadAvatarToServer } from '../../firebase/serverAPI';
import { useDimantions } from '../../util/useDimentions';
import { pickImage } from '../../util/pickImage';
import { Toast } from 'toastify-react-native';

const initialState = {
    userPhoto: null,
    nickName: '',
    email: '',
    password: '',
}

export const RegistrationScreen = ({ navigation }) => {
    const [state, setState] = useState(initialState);
    const [isKeyboardShown, setIsKeyboardShown] = useState(true);
    const [isSecureText, setIsSecureText] = useState(true);
    const [isActiveLogin, setIsActiveLogin] = useState(false);
    const [isActiveMail, setIsActiveMail] = useState(false);
    const [isActivePass, setIsActivePass] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [userPhoto, setUserPhoto] = useState();
    const [isLoader, setIsLoader] = useState(false);
    let { errorSignIn } = useSelector((state) => state.auth);
    // console.log(Platform.OS);        

    const dispatch = useDispatch();
    const {orientation, currentDimentions} = useDimantions();

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyboardShown(false);
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardShown(true);
        });

        checkUser();
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [isKeyboardShown, orientation, userPhoto, avatar, errorSignIn]);

    const checkUser = () => {
        if (errorSignIn !== null) {
            setIsLoader(false);
            Toast.error(`💭 Sorry, this E-mail already exists 🙄`, 'center');
            dispatch(authSlice.actions.setErrorSignIn({ errorSignIn: null }));
        };
    };

    const handleSubmit = async () => {    
        try {
            setIsLoader(true);
            Keyboard.dismiss();       

            const userPhoto = avatar ? await uploadAvatarToServer(avatar) : null;
            setUserPhoto(userPhoto);
       
            dispatch(authSignUpUser({ ...state, userPhoto }));
            
        } catch (error) {
            if (error.message !== null) { setIsLoader(false) };
            console.log(error);
        };
    };
    
    const handlePickImage = async () => {
        const resultPickImages = await pickImage();
        await setAvatar(resultPickImages);
    };

    const warring = () => {
        Toast.warn('Input fields cann`t be empty 👀', 'center');
    };
    const warringEmail = () => {
        Toast.warn('Please put "@" in \nEmail', 'center');
    };
    const warringPassword = () => {
        Toast.warn('Password must be at least 6 symbols 💬 ', 'center');
    };

    return (   
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={require("../../assets/background.jpg")}
            style={styles.background}>                
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
                            paddingBottom: isKeyboardShown ? 37 : 16,
                            width: currentDimentions,
                    }}>
                    
                    {/* avatar   button add/delete avatar */}
                        <View style={styles.avatar}>
                            {avatar !== null?
                                (<Image style={styles.avatarImg} source={{ uri: avatar }} />) :
                                (<Image style={styles.avatarImg} source={ require('../../assets/defaultAva.png')} />)}

                            {avatar !== null ? (
                                <TouchableOpacity activeOpacity={0.5} style={styles.removeAvatarIcon} onPress={() => {setAvatar(null)}} >
                                    <View>
                                        <View style={{ backgroundColor: '#fff', borderRadius: 50, }}>
                                            <AntDesign style={{ transform: [{ rotate: '45deg' }] }} name="closecircleo" color="#BDBDBD" size={25} />                                                    
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                ) : (
                                <TouchableOpacity activeOpacity={0.5} style={styles.addAvatarIcon} onPress={handlePickImage}>
                                    <View>
                                        <View style={{ backgroundColor: '#fff', borderRadius: 50, }}>
                                            <AntDesign name="pluscircleo" color="#FF6C00" size={25} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
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
                            placeholder='nickName'
                            placeholderTextColor='#BDBDBD'
                            value={state.nickName}
                            onChangeText={(value) => setState((prevState) => ({...prevState, nickName: value}))}
                        />
                        <TextInput
                            keyboardType="email-address"
                            autoComplete="email"
                            required
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
                                    if ((state.nickName.trim() === "") && (state
                                        .email.trim() === "") && (state.password.trim()) === "") {
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
                                    <Text style={styles.submitBtnText}>SIGN UP</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity  
                                activeOpacity={0.6}
                                onPress={() => navigation.navigate('Login')}
                                style={{ paddingVertical: 5 }}
                            >
                                <Text style={styles.linkToLoginPageText}>Already have an account, 
                                    <Text style={{ fontFamily: 'Roboto-Bold'}}> Log in</Text>    
                                </Text>
                            </TouchableOpacity> 
                            <View style={styles.homeIndicator} /> 
                        </> ) : null }             
                                    
                    </View>
                </KeyboardAvoidingView>                               
            </ImageBackground>  
        </TouchableWithoutFeedback>          
    )
}

const styles = StyleSheet.create({
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
    avatar: {
        position: 'relative',
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
        padding: 10,
        transform: [{ rotate: '45deg' }],
        right: -22.5,
        bottom: 4,
    },
    addAvatarIcon: {
        position: 'absolute',
        padding: 10,
        color: "#FF6C00",
        right: -22.5,
        // right: Platform.OS === 'ios' ? -97 : 22.5,
        bottom: 4,
    },
    title: {
        fontSize: 30,
        lineHeight: 35,
        letterSpacing: 0.72,
        marginTop: 20,
        marginBottom: 22,
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
});
