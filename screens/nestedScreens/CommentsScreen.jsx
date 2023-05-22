import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CommentsScreen = () => {
    const [comment, setComment]= useState('')
    const createPost = () => { }
    const sendPhoto = () => {}

    return (
        <View style={styles.container}>
            <Text style={{ alignSelf: 'center'}}>CommentsScreen</Text>
            <View style={styles.inputContainer} >
                <TextInput style={styles.input} onChangeText={setComment} />
            </View>
            <TouchableOpacity onPress={sendPhoto} style={styles.sendBtn} >
                <Text style={styles.sendLabel}>ADD POST</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        // alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#cfcfcf8f',
    },
    sendBtn: {
        marginHorizontal: 30,
        height: 40,
        borderWidth: 2,
        borderColor: '#20b2aa',
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    sendLabel: {
        color: '#20b2aa',
        fontSize: 20,
    },
    inputContainer: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomColor: '#20b2aa',
    }
})

export default CommentsScreen;