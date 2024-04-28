import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}`;
import React, {
    useState,
    useCallback,
    useEffect,
} from 'react';

import {
    Text,
    View,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

let socket;
const { width } = Dimensions.get('window');

const JoinMeetingRoom = ({ navigation, route }) => {

    const { name, email, clg, role, phone } = route.params.Data;
    console.log(name, email, clg,  " <<Join Meeting Room")

    let [isJoined, setIsJoined] = useState(0); //Kepp track of joined button click or not
    let [roomData, setRoomData] = useState({
        name: name,
        email: email,
        id: '',
        password: '',
        clg,
        role,
        phone,
        meeting:null
    });

    const clickJoined = () => {
        //change state when joined button is clicked
        setIsJoined(1);

        navigation.navigate("VideoConferencePage", { roomData: roomData });

        //after 200ms state change
        setTimeout(() => {
            setIsJoined(0);
        }, 300);
    }

    return (
        <View style={styles.mainConatiner}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Join a New Meeting</Text>
                    </View>
                    <View style={styles.inputFieldContainer}>
                        <TextInput style={styles.inputField}
                            placeholder='Room Id'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setRoomData({ ...roomData, id: text })}
                            />
                    </View>
                    <View style={styles.inputFieldContainer}>
                        <TextInput style={styles.inputField}
                            placeholder='Password'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setRoomData({ ...roomData, password: text })}
                            />
                    </View>
                    <TouchableOpacity style={styles.buttonHead} activeOpacity={1}
                        onPress={
                            () => { clickJoined(); }
                        }>
                        <Text style={[styles.button, isJoined && styles.disableButton]}>
                            Join
                        </Text>
                    </TouchableOpacity>
                </View >
            </ScrollView >
        </View >
    )
}

export default JoinMeetingRoom

const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
        backgroundColor: '#1c1c1c',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        width: '100%',
        height: '100%',

        // borderWidth: 1,
        // borderColor: 'white',

        paddingTop: '10%',
        // marginBottom: '50%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headingContainer: {

        // borderWidth: 1,
        // borderColor: 'blue',

        width: '100%',
        height: '20%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        color: '#2e89d1',
        fontSize: 25,
        fontFamily: 'Heebo-Medium'
    },
    inputFieldContainer: {
        // borderWidth: 1,
        // borderColor: 'blue',

        width: '100%',
        height: '16%',

        // backgroundColor: 'yellow',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputField: {
        width: '80%',
        height: '70%',
        paddingLeft: 10,
        borderRadius: 9,
        backgroundColor: '#00FFFF',
        fontFamily: 'Kanit-Regular',
        color:"black",
    },

    buttonHead: {
        marginTop: 10,

        width: '100%',
        height: '40%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    button: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        width: '50%',
        height: '30%',
        backgroundColor: '#6495ED',

        paddingTop: '2%',
        marginBottom: '70%',

        borderWidth: 2,
        borderRadius: 5,
    },

    disableButton: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        width: '50%',
        height: '30%',
        backgroundColor: '#C5BA50',


        paddingTop: '2%',
        marginBottom: '70%',

        borderWidth: 2,
        borderRadius: 5,

    },
})