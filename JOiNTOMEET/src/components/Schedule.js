import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Schedule = ({ meeting, Data, navigation }) => {
    let { email, name, clg, role, phone } = Data;    
    let [isJoined, setIsJoined] = useState(0); 
    let [roomData, setRoomData] = useState({
        name: name,
        email: email,
        id: meeting.id,
        password: meeting.password,
        clg,
        role,
        phone,
        meeting: meeting.name 
    });

    const joinCall = () =>{
        //change state when joined button is clicked
        setIsJoined(1);

        navigation.navigate("VideoConferencePage", { roomData: roomData });

        //after 200ms state change
        setTimeout(() => {
            setIsJoined(0);
        }, 300);
    }

    const formatDate = (date) => {
        let newdate = new Date(date);

        const day = newdate.getDate().toString().padStart(2, '0');
        const month = (newdate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = newdate.getFullYear();
        const hours = newdate.getHours().toString().padStart(2, '0');
        const minutes = newdate.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    return (
        <View style={{ width: "100%", alignItems: 'center' }}>
          
            <View style={styles.meeting}>
                <Text style={styles.heading}>{meeting.name}</Text>
                <Text style={styles.meetingText}>Id: <Text>{meeting.id} </Text> </Text>
                <Text style={styles.meetingText}>Password: <Text>{meeting.password}</Text></Text>

                <Text style={styles.meetingText}>From:
                    <Text> {formatDate(meeting.start)}</Text>
                </Text>

                <Text style={styles.meetingText}>To:
                    <Text> {formatDate(meeting.end)}</Text>
                </Text>

                <TouchableOpacity style={{ top: 15, right: 20, position: 'absolute' }}
                    onPress={joinCall}
                >
                    <Text style={{ color: "red", fontSize: 15, fontWeight: 800, fontFamily: "Rubik-Regular" }}>
                        JOIN CLASS
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Schedule

const styles = StyleSheet.create({
    meeting: {
        flex: 1,
        width: '95%',
        justifyContent: 'center',
        backgroundColor: '#1c1c1c', // Background color
        marginTop: 15,
        borderWidth: 3,
        borderColor: "#000",

        // borderLeftColor:'#FF751F',
        borderRadius: 5,
        paddingBottom: 20
    },

    meetingText: {
        paddingStart: 20,
        color: "black",
        color: '#fff',
        fontFamily: 'Kanit-Light',
    },

    heading: {
        fontFamily: 'MerriweatherSans-Regular',
        backgroundColor: "#6495ED",
        textAlign: 'center',
        // borderRadius:5,
        width: '55%',
        height: '25%',
        color: 'black',
        marginBottom: 7,
        marginTop: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
    },

    buttonHead: {
        width: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    button: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        backgroundColor: '#6495ED',
        width: '80%',
        color: "black",

        borderWidth: 2,
        borderRadius: 5,
    },
})