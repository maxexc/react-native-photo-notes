import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const CommentsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>CommentsScreen</Text>
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
    }
})

export default CommentsScreen;