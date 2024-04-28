import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import { apiUrl } from '../UrlConstants';
import RNFetchBlob from 'rn-fetch-blob';


const Attendence = ({ Attendence, Data, navigation }) => {
    let { email, name, clg, role } = Data;
    // console.log(Attendence + " << attendence");

    const requestStoragePermission = async (clg, subject, date) => {
        console.log(clg, subject, date);
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Downloader App Storage Permission',
                    message:
                        'Downloader App needs access to your storage ' +
                        'so you can download files',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log("1");
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("granted");
                let URL = `${apiUrl}/download-excel?date=${date}&subject=${subject}&clg=${clg}`;
                console.log(URL);
                const { dirs } = RNFetchBlob.fs;
                const [month2, year2] = date.split('-');
                const file_name = `${clg}_Attendance_${subject}-${month2}-${year2}`
                const path = `${dirs.DownloadDir}/${file_name}.xlsx`;
                try {
                    const res = await RNFetchBlob.config({
                        fileCache: true,
                        path: path,
                        addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path: path,
                            description: 'Downloading file...',
                        },
                    }).fetch('GET', URL)

                    // Show a success message
                    // Alert.alert('Download Complete', 'File saved to Download folder.');
                } catch (error) {
                    
                    // The request was made and the server responded with a status code
                    if (error.response) {
                    
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    
                    } else if (error.request) {
                     
                        // The request was made but no response was received
                        console.log(error.request);
                    
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                }
            } else {
                console.log("not granted");
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.log("error");
            console.warn(err);
        }
    };



    return (
        <View style={{ width: "100%", alignItems: 'center' }}>

            <View style={styles.meeting}>
                <Text style={styles.heading}>{Attendence.subject}</Text>
                <Text style={styles.meetingText}>Teacher Name: {Attendence.name}</Text>
                <Text style={styles.meetingText}>email: {Attendence.email}</Text>

                <Text style={styles.meetingText}>Date:
                    <Text> {Attendence.date}</Text>
                </Text>

                <TouchableOpacity style={{ top: 5, right: 20, position: 'absolute' }}
                    onPressIn={() => {
                        requestStoragePermission(clg, Attendence.subject, Attendence.date);
                    }}
                >
                    <Text style={{ color: "red", fontSize: 15, fontWeight: 800, fontFamily: "Rubik-Regular" }}>
                        Downloaded
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Attendence

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
        width: '55%',
        height: '30%',
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