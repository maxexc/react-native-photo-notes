import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Feather, FontAwesome, AntDesign  } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { subscribeAllPosts } from "../../firebase/serverAPI";
import { switcherLike } from "../../util/switcherLike";
import { Toast } from 'toastify-react-native';


const DefaultScreenPosts = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const { userId } = useSelector((state) => state.auth);
   

    const getPostFromDB = () => {
        return subscribeAllPosts((querySnapshot) => {
            const _post = [];
            querySnapshot.forEach((doc) => {
                const likesRef = doc.data().likes;
                const likesLenght = likesRef.length;
                const isLiked = likesRef.includes(userId);
            
                _post.push({ ...doc.data(), id: doc.id, like: likesLenght, likeStatus: isLiked });
            });
        
            setPosts(_post); 
            setIsLoader(true);
        });
    };

    useEffect(() => {
        if (userId === null) {
            return;
        };
        if (!isLoader) { successLogin() };        
        
        // unsubscribe from Server  
        return getPostFromDB();

    }, [userId]);

    const onLike = async (id, likes) => {
        setIsLoader(false);
        switcherLike(id, likes, userId);
    };
    
    
    const successLogin = () => {
        Toast.success('Welcome! ✔', 'top');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PostsScreen</Text>
            </View>  
            {!isLoader && (
                        <ActivityIndicator
                            style={styles.loader}
                            size='large'
                            color="#FF6C00"
                        />
                    )}
            <FlatList
                style={styles.flatlist}
                data={posts}
                // showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ position: 'relative', marginBottom: 5 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 2, }}>
                            {item.userPhoto !== null ?
                            (<Image style={styles.avatar} source={{ uri: item.userPhoto }} />) :
                            (<Image style={styles.avatar} source={ require('../../assets/defaultAva.png')} />)}
                            <Text style={{ alignSelf: 'center' }}>{item.nickName} </Text>
                        </View>

                        <Image source={{ uri: item.photo }} style={styles.imagePost} />
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={{ marginHorizontal: 0, marginBottom: 10, position: 'relative' }} >
                            <View style={styles.navigationBox} >
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    title='go to Comments'
                                    style={styles.icon}
                                    onPress={() => navigation.navigate('Comments', { postId: item.id, photo: item.photo })}
                                >
                                    <FontAwesome
                                        name="comments-o"
                                        style={styles.postIcon}
                                        size={24}         
                                        color={item.comments > 0 ? '#FF6C00' : '#BDBDBD'}
                                    />
                                    <Text>{item.comments}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{...styles.icon, paddingVertical: 2}}
                                    activeOpacity={0.5}
                                    id={item.id}
                                    onPress={() => onLike(item.id, item.likes)}
                                >
                                    <AntDesign
                                        name="like2"
                                        style={styles.postIcon}
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
                    </View>                    
                )}
            />  
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 10,
        height: 78,
        backgroundColor: '#fff',

        borderBottomWidth: 1,
        borderBottomColor: "#BDBDBD",
        marginBottom: 10,
    },
    headerTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        lineHeight: 22,
        marginBottom: 14,
    },
    loader: {
        position: "absolute",
        bottom: "50%",
        right: '45%',
        zIndex: 1,
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
    },
    flatlist: {
        flex: 1,
        paddingHorizontal: 16,
        width: '100%',
    },
    avatar: {
        height: 28,
        width: 28,
        borderRadius: 50,
        alignSelf: 'center',
        marginRight: 5,
    },
    imagePost: {
        width: '100%',
        height: 240,
        backgroundColor: '#BDBDBD',
    },
    title: {
        marginHorizontal: 16,
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        marginTop: 5,
    },
    navigationBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
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
        marginRight: 130,
    },
});

export default DefaultScreenPosts;