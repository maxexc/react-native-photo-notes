import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { addCommentToServer, putPostLengthToServer, subscribeAllComments } from "../../firebase/serverAPI";
import { Toast } from 'toastify-react-native';


const CommentsScreen = ({ route }) => {
    const { postId, photo } = route.params
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const { nickName, userPhoto, userId } = useSelector((state) => state.auth);
    const [isActive, setIsActive] = useState(false);

    const getAllComments = () => {   
        return subscribeAllComments(postId, (querySnapshot) => {
            const _post = [];
            querySnapshot.forEach((doc) => {
                _post.push({ ...doc.data(), id: doc.id });
            });
            putPostLengthToServer(postId, _post);
            setAllComments(_post);
        });
    };
    
    const createComment = async ( ) => {
        if (comment === "") {
            Toast.warn(`To create a comment, \nthe field must be filled. 🗯`, 'center' );
            return;
        }
        const params = {
                comment,
                nickName,
                userPhoto,
                date: Date.now().toString(),
                fullDate: new Date(Date.now()).toString(),
                userId,
            };

        await addCommentToServer(postId, params);
        setComment('');    
    };
    
    useEffect(() => {
        return getAllComments();   
    }, []);


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 85}            
        >
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>                
                    <Image source={{ uri: photo }} style={styles.imagePost} />
                </TouchableWithoutFeedback>
                {allComments.length === 0 ? (
                    <View style={styles.wrapperError} >                    
                        <Text style={styles.error}>
                            There are no comments under this post yet.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={allComments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (                            
                            <View key={item.id}
                                style={item.nickName === nickName ? styles.comentarAuthor : styles.comentarGuest}>
                                <View>
                                    {item.userPhoto !== null ?
                                    (<Image source={{ uri: item.userPhoto }} style={styles.avatar} />) :
                                    (<Image source={require('../../assets/defaultAva.png')} style={styles.avatar}  />)}
                                    <Text style={{ alignSelf: 'center' }}>{item.nickName} </Text>
                                </View>
                                <View style={item.nickName === nickName ? styles.comentWrapAuthor : styles.comentWrapGuest}>
                                    <Text>{item.comment}</Text>
                                    <Text style={styles.date}>{item.fullDate}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Write your comment..."
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    style={{
                        ...styles.input,
                        borderColor: isActive ? "#FF6C00" : "#E8E8E8",
                        backgroundColor: isActive ? "#FFFFFF" : "#F6F6F6",
                    }}
                    placeholderTextColor="#BDBDBD"
                    onFocus={() => {setIsActive(true)}} 
                    onBlur={() => {setIsActive(false)}}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        ...styles.sendBtn,
                        backgroundColor: comment !== "" ? "#FF6C00" : "#BDBDBD",
                    }}
                    onPress={createComment}
                >
                    <View>
                        <AntDesign name="arrowup" size={24} color="#FFFFFF" />
                    </View>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    imagePost: {
        width: '100%',
        borderRadius: 8,
        marginBottom: 8,
        height: 240,
        backgroundColor: '#BDBDBD',
    },
    wrapperError: {
        flex: 1,
    },
    error: {
        marginTop: 20,
        alignSelf: "center",
        fontFamily: "Inter-Medium",
        paddingHorizontal: 10,
        fontSize: 30,
        color: "#BDBDBD",
        borderWidth: 1,
        borderColor: "#BDBDBD",
        borderRadius: 20,
    },
    comentarAuthor: {
        flex: 1,
        flexDirection: "row-reverse",
        marginBottom: 24,
        width: "auto",
    },
    comentarGuest: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 24,
        width: "auto",
    },
    avatar: {
        height: 28,
        width: 28,
        borderRadius: 50,
        alignSelf: 'center'
    },
    comentWrapAuthor: {
        marginRight: 16,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: 10,
        padding: 16,
        fontFamily: "Roboto-Regular",
        flex: 1,
    },
    comentWrapGuest: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: 10,
        padding: 16,
        fontFamily: "Roboto-Regular",
    },
    date: {
        paddingTop: 8,
        fontSize: 10,
        color: "#BDBDBD",
    },
    inputContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    input: {
        position: 'relative',
        width: "100%",
        height: 50,
        paddingLeft: 16,
        paddingRight: 52,
        borderWidth: 1,
        borderRadius: 100,
        fontSize: 16,
        borderColor: "#E8E8E8",
    },
    sendBtn: {
        position: "absolute",
        width: 38,
        height: 38,
        bottom: 8,
        right: 10,
        backgroundColor: "#FF6C00",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CommentsScreen;