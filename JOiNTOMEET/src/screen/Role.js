import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}`;
const Role = ({ navigation, route }) => {
    const { data } = route.params;

    const [selectedRole, setSelectedRole] = useState('student');
    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };
    const SendDateToBackEnd = () =>{
        console.log(data);
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            borderBottomColor: 'black',
            borderBottomWidth: 2,
            height: "20%",
            alignItems: 'center',
            justifyContent: 'center',
            // height:'10%'
        }}>
            <Text style={{
                color: "#000",
                fontSize: 15,
                fontFamily: 'MerriweatherSans-Medium',
                color: "black",
            }}>Select your role:</Text>
            <Picker
                style={{
                    width: '80%',
                    height: '7%',
                    borderRadius: 10,
                    color: '#999999',
                    backgroundColor: '#00FFFF',
                }}

                selectedValue={selectedRole}
                onValueChange={handleRoleChange}>
                <Picker.Item label="student" value="student" />
                <Picker.Item label="admin" value="admin" />
                <Picker.Item label="teacher" value="teacher" />
            </Picker>

            {/* signup */}
            <TouchableOpacity style={styles.buttonHead} activeOpacity={1} >
                <Text style={styles.button}
                    onPress={() => { SendDateToBackEnd }} >
                    Sign Up
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Role

const styles = StyleSheet.create({
    buttonHead: {
        marginTop: 10,

        width: '100%',
        height: '10%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    button: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        width: '40%',
        height: '60%',
        backgroundColor: '#6495ED',
        color: "black",

        paddingTop: 4,
        marginBottom: 50,

        borderWidth: 2,
        borderRadius: 5,
    },

    disableButton: {
        paddingTop: 4,

        width: '40%',
        height: '70%',
        backgroundColor: '#C5BA50',

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        borderWidth: 2,
        borderRadius: 5,

    },
})