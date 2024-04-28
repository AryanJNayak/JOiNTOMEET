import { StyleSheet, Text, View, Linking, Button, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, {useState} from 'react'
import RNFetchBlob from 'rn-fetch-blob';
import { apiUrl } from '../UrlConstants';
// const URL = `${apiUrl}

const AssignmentPreview = ({ assignment, clg }) => {
    console.log(assignment.assignment_Title, clg , " << assignment Preview");
    let URL = `${apiUrl}/get-pdf/${assignment.assignment_Title}?clg=${clg}`;
    const requestStoragePermission = async () => {
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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                downloadFile();
            } else {
                console.log('storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const downloadFile = () => {
        const { config, fs } = RNFetchBlob;
        const fileDir = fs.dirs.DownloadDir;
        config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                    fileDir +
                    '/' + assignment.assignment_Title + '.pdf',
                description: 'file download',
            },
        })
            .fetch('GET', URL, {
                //some headers ..
            })
            .then(res => {
                console.log('The file saved to ', res.path());
            });
    };

    return (
        <View style={{ width: "100%", alignItems: 'center', }}>
            <View style={styles.meeting}>
                <View style={styles.heading}>
                    <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'MerriweatherSans-Regular', }}>{assignment.assignment_Title}</Text>
                </View>
                
                
                <View style={{width:'90%', marginBottom: 10}}>
                <Text style={styles.meetingText}>Instruction: </Text>
                    {assignment.assignment_Instruction.map((instruction, index) => (
                        <Text key={index} style={styles.instruction}>* {instruction}</Text>
                    ))}
                </View>
                
                <View style={{width:'90%'}}>
                    <Text style={styles.meetingText}>Last Date: {assignment.assignment_Deadline} </Text>
                </View>

                <TouchableOpacity style={{ marginBottom: 10, marginTop:20, backgroundColor:'white', width:'50%' }} 
                    onPress={requestStoragePermission}>
                    <Text style={{ color: "black", fontSize: 15, fontWeight: 800, fontFamily: "Rubik-Regular", textAlign:'center' }}>
                        Download File
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AssignmentPreview

const styles = StyleSheet.create({
    meeting: {
        flex: 1,
        width: '95%',
        justifyContent: 'center',
        backgroundColor: '#1c1c1c', // Background color
        marginTop: 15,
        borderWidth: 3,
        borderColor: "#000",
        borderRadius: 5,
        paddingBottom: 4,
        paddingTop: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    
    meetingText: {
        color: "black",
        color: '#fff',
        fontFamily: 'Kanit-Light',
    },

    heading: {
        backgroundColor: "#6495ED",
        borderRadius:5,
        width:'90%',
        color: 'black',
        marginBottom: 10,
        padding: 6,
        marginTop: 5,
        borderRightWidth: 2,
        borderBottomWidth: 2,
    },

    instruction:{
        color:"grey"
    }
})
