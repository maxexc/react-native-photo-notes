import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ProfileScreen</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text >ProfileScreen</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#cfcfcf8f',
    },
    header: {
        top: 0,
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
})

export default ProfileScreen;