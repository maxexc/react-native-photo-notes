import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, FlatList, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser, deleteAvatarFromStore, setNewAvatar } from "../../redux/auth/authOperations";
import { deleteAvatarFromServer, deletePostFromServer, deletePostImageFromServer, subscribeUserPosts } from "../../firebase/serverAPI";
import { pickImage } from "../../util/pickImage";
import { switcherLike } from "../../util/switcherLike";
import { AntDesign, FontAwesome, Entypo, Feather } from "@expo/vector-icons";
import { Toast } from 'toastify-react-native';


const DefaultProfileScreen = ({ navigation }) => {
    let { nickName, userPhoto, userId, } = useSelector((state) => state.auth);
    const [avatar, setAvatar] = useState(userPhoto);
    const [posts, setPosts] = useState([]);
    const [isLoader, setIsLoader] = useState(false);    

    const dispatch = useDispatch();

    const signOut = () => {
        Toast.success(`You are logged off       now❕ `, 'center',);
        dispatch(authSignOutUser());        
    };    

    const getUserPosts = () => {
        return subscribeUserPosts(userId, (querySnapshot) => {
            const _post = [];
            querySnapshot.forEach((doc) => {
                
                const likesRef = doc.data().likes;
                const likesLenght = likesRef.length;
                const isLiked = likesRef.includes(userId);
                _post.push({ id: doc.id, ...doc.data(), like: likesLenght, likeStatus: isLiked });
            });
            setPosts(_post);
            setIsLoader(true);
        });
    };

    useEffect(() => {
        // unsubscribe from Server
        return getUserPosts();
    }, []);    
    
    const postDelete = async (id, title, photo) => {
        setIsLoader(false);

        const reg = /(?<=Images%2F)[^?]+/gi;
        const photoName = photo.match(reg).pop();
        
        await deletePostFromServer(id);
        deletePostImageFromServer(photoName);

        Toast.success(`Post "${title}" was       DELETED! ✔`, 'top',);
    };
    
    const handlePickImage = async () => {
        const resultPickImages = await pickImage();
        setAvatar(resultPickImages);
        dispatch(setNewAvatar(resultPickImages));
    };   

    const onLike = async (id, likes) => {
        setIsLoader(false);
        switcherLike(id, likes, userId);
    };    

    const handleDeleteAvatar = async () => {
        if (avatar === null) {
            return;
        };

        const reg = /(?<=avatars%2F)[^?]+/gi;
        const userAvatar = userPhoto.match(reg).pop();
        
        await deleteAvatarFromServer(userAvatar);
        setAvatar(null);
        dispatch(deleteAvatarFromStore());
    };

   
    return (
        <ImageBackground
            source={require("../../assets/background.jpg")}
            style={styles.background}
        >
            <View style={styles.form}>                
                <View style={styles.avatar}>
                    {avatar ?
                        (<Image style={styles.avatarImg} source={{ uri: avatar }} />) :
                        (<Image style={styles.avatarImg} source={ require('../../assets/defaultAva.png')} />)}
                    {avatar ? (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.removeAvatarIcon}
                            onPress={() => handleDeleteAvatar()}
                        >
                                <View>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 50, }}>
                                        <AntDesign style={{ transform: [{ rotate: '45deg' }] }} name="closecircleo" color="#BDBDBD" size={25} />                                                    
                                    </View>
                                </View>
                            </TouchableOpacity>
                            ) : (
                            <TouchableOpacity activeOpacity={0.5} style={styles.addAvatarIcon} onPress={() => handlePickImage()}>
                                <View>
                                    <View style={{ backgroundColor: '#fff', borderRadius: 50, }}>
                                        <AntDesign name="pluscircleo" color="#FF6C00" size={25} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                    )}                                
                </View>
                <Text style={styles.userName}>{nickName}</Text>
                {!isLoader && (
                        <ActivityIndicator
                            style={styles.loader}
                            size='large'
                            color="#FF6C00"
                        />
                    )}
                    
                <TouchableOpacity style={styles.logOutIcon} onPress={signOut}>
                    <Entypo name="log-out" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <FlatList
                    style={styles.flatlist}
                    data={posts}
                    // showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    eyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={{ position: 'relative' }}>
                            <Image source={{ uri: item.photo }} style={styles.imagePost} />
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={{ position: 'relative' }} >                                
                                <View style={styles.navigationBox}>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        title='go to Comments'
                                        style={styles.icon}
                                        onPress={() => navigation.navigate('Comments', { postId: item.id, photo: item.photo })}
                                    >
                                        <FontAwesome
                                            name="comments-o"
                                            style={styles.postIcon}
                                            color={item.comments > 0 ?  '#FF6C00' : '#BDBDBD'}
                                            size={24}
                                        />        
                                        <Text>{ item.comments }</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{...styles.icon, paddingVertical: 2}}
                                        activeOpacity={0.5}
                                        id={item.id}
                                        onPress={() => onLike(item.id, item.likes)}
                                    >
                                        <AntDesign
                                            style={styles.postIcon}
                                            name="like2"
                                            size={20}
                                            color={item.likeStatus ? '#FF6C00' : '#BDBDBD'}
                                        />
                                        <Text>{item.like}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        title='go to Map'
                                        style={styles.icon}
                                        onPress={() => navigation.navigate('Map', { location: item.location, geoaddress: item.geoaddress })}
                                    >
                                        <Feather name="map-pin" style={styles.locationIcon} size={20} />
                                        <Text style={styles.locationText} >
                                            {item.geoaddress}
                                        </Text>
                                    </TouchableOpacity>
                                </View> 
                            </View>
                            <TouchableOpacity
                                id={item.id}
                                onPress={() => postDelete(item.id, item.title, item.photo)}
                                title={item.title}
                                style={{ ...styles.deleteBtn, top: 245, right: 10 }}
                            >
                                <Entypo name="circle-with-cross" size={24} color="#ff6a00a4" />
                            </TouchableOpacity>
                        </View>
                    )}
                />  
            </View>
        </ImageBackground>        
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        justifyContent: 'flex-end',
    },
    form: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff',
        marginTop: 103,
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
        padding: 10,
        transform: [{ rotate: '45deg' }],
        right: 22.5,
        bottom: 4,
    },
    addAvatarIcon: {
        padding: 10,
        color: "#FF6C00",
        right: 22.5,
        bottom: 4,
    },
    userName: {
        marginTop: 60,
        marginBottom: 5,
        marginHorizontal: 16,
        fontFamily: "Roboto-Medium",
        fontSize: 30,
        letterSpacing: 0.01,
        lineHeight: 35,
        textAlign: "center",
        color: '#212121',
    },
    loader: {
        position: "absolute",
        bottom: "50%",
        right: '50%',
        zIndex: 1,
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
    },
    logOutIcon: {
        padding: 5,
        marginTop: 17,
        right: 27,
        position: "absolute",
    },
    flatlist: {
        flex: 1,
        paddingHorizontal: 16,
        width: '100%',
    },
    imagePost: {
        width: '100%',
        borderRadius: 8,
        height: 240,
        backgroundColor: '#BDBDBD',
    },
    title: {
        marginHorizontal: 16,
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    navigationBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 30,
    },
    icon: {
        flexDirection: 'row',
        alignContent: 'center',
        marginRight: 20,
    },
    postIcon: {
        alignSelf: 'center',
        marginRight: 10,
    },
    locationIcon: {
        color: "#BDBDBD",
        alignSelf: 'center',
        marginRight: 4,
    },
    locationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: '#212121',
        textDecorationLine: 'underline',
        marginRight: 110,
    },
    deleteBtn: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default DefaultProfileScreen;