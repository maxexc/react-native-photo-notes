import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Image, FlatList, Button } from 'react-native';

import { Feather } from "@expo/vector-icons";

const DefaultScreenPosts = ({ route, navigation }) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if(route.params) {
            setPosts((prevState) => [...prevState, route.params]);
        }
    }, [route.params]);
    console.log('route.params', route.params);
    // console.log('latitude', route.params.location.latitude);
    console.log('posts', posts);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PostsScreen</Text>
            </View>   
            <FlatList
                data={posts}
                // showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Image source={{ uri: item.photo }} style={styles.imagePost} />
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={{ marginHorizontal: 40, marginBottom: 10 }} >
                            <View style={{ marginBottom: 10 }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    title='go to Map'
                                    style={styles.location}
                                    onPress={() => navigation.navigate('Map', { location: item.location })}
                                >
                                    <Feather name="map-pin" style={styles.locationIcon} size={20} />
                                    <Text style={styles.locationText} >
                                        (Latitude: {route.params.location.latitude.toFixed(4)} {``}
                                        Longitude: {route.params.location.longitude.toFixed(4)})
                                    </Text>
                                </TouchableOpacity>
                            </View> 
                            <Button title='go to Comments' onPress={() => navigation.navigate('Comments') } />
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
        borderBottomWidth: 1,
        borderColor: '#cfcfcf8f',
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
    },    
    headerTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 17,
        lineHeight: 22,
        marginBottom: 14,
    },
    imagePost: {
        marginHorizontal: 16,
        width: 350,
        height: 240,
        backgroundColor: '#BDBDBD',
    },
    title: {
        marginHorizontal: 16,
        fontFamily: "Roboto-Bold",
        fontSize: 16,
        marginVertical: 16,
    },
    location: {
        flexDirection: 'row',
        alignContent: 'center',
    },
     locationIcon: {
        color: "#BDBDBD",
        alignSelf: "flex-start",
        marginRight: 4,
    },
    locationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: '#212121',
        textDecorationLine: 'underline',
     }
})

export default DefaultScreenPosts;