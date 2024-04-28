import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
// import ZegoUIKitPrebuiltVideoConference from '@zegocloud/zego-uikit-prebuilt-video-conference-rn'
// import { ZegoExpressEngine, ZegoExpressEngineConfig } from 'zego-express-engine-reactnative';
import ZegoUIKitPrebuiltVideoConference from '../videoconference/index'

import { io } from 'socket.io-client'
import { apiUrl } from '../UrlConstants';

let socket

const VideoConferencePage = ({ navigation, route }) => {
    let buttonState = false;

    let { id, name, email, clg, phone, role, meeting } = route.params.roomData;
    console.log(id, name, email, "<<<<<<<<<+++++++++++++++<<<<<<<<<<<<<<<");
    let Data = {
        clg, email, name, phone, role
    }

    const leaveRoom = async () => {
        if (socket) {
            await socket.disconnect();
        }
        navigation.navigate('HomePage', { Data: Data })
    }

    let subject = "gujarati";

    const joinRoom = () => {
        socket.emit('join-room', { clg, email, subject, conferenceID: id })
    }

    useEffect(() => {
        socket = io(apiUrl);
        console.log(Data, "Start <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        socket.on('connection', () => {
            console.log("connected");
        })
        // if (role == "student") {
        //     joinRoom();
        // }
        joinRoom();
        socket.on('all-user', users => {
            console.log(users);
        })
        
    }, [])


    return (

        <View style={styles.container}>
            <ZegoUIKitPrebuiltVideoConference
                appID={1076974689}
                appSign='07b9c342819c2fb28aefeabe57e098edb2c3dba1219be2d1d0e8ee8657035439'
                userID={email} // userID can be something like a phone number or the user id on your own user system. 
                userName={name}
                conferenceID={id} // conferenceID can be any unique string. 
                navigation={navigation}
                email={email}
                role={role}
                clg={clg}
                Data={Data}
                meeting={meeting}
                
                config={{
                    onLeave: () => {
                        leaveRoom()
                    },
                }}
            />
         
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoConference: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default VideoConferencePage;
