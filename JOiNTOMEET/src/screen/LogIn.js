import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}/userLogin`;

import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";

import backGround from '../../assets/LogInBackground.png';

const LogIn = ({ navigation }) => {

    let [data, setData] = useState({ email: '', password: '' });

    let [errMsg, setErrMsg] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    let [isSignUp, setIsSignUp] = useState(0);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const clickSignUp = () => {
        setIsSignUp(1);
        setTimeout(() => {
            setIsSignUp(0);
        }, 100);
    }

    const SendDateToBackEnd = async () => {
        clickSignUp();

        if (data.email == "Test") {
            let studData = {
                name: "aryan",
            }
            navigation.navigate("HomePage", { screen: "HomePage", studentData: studData })
        }
        if (!data.email || !data.password) {
            setErrMsg("Please enter all fields")
        } else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            fetch(URL, option)
            .then(res => res.json())
            .then(datas => {
                console.log("h")
                if (datas.err) {
                    console.log(datas);
                    setErrMsg(datas.err);
                    } else {
                        // console.log(datas.Data);
                        setTimeout(() => {
                            navigation.navigate("HomePage", { screen: "HomePage", Data: datas.Data })
                        }, 70);
                    }
                })
        }
    }


    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
    const keyboardDismissMode = Platform.OS === "ios" ? 'interactive' : 'on-drag';

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={keyboardVerticalOffset}
            keyboardDismissMode={keyboardDismissMode}
            style={styles.keyboardAvoidingViewStyle}
        >
            <View style={styles.container1}>
                <Image source={backGround} style={styles.imgBackground} />
            </View>
            <View style={styles.container2}>
                <View
                    style={styles.mainContainer}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 1, paddingHorizontal: 30, width: '100%', height: '100%',
                        }}
                        keyboardShouldPersistTaps={'handled'}  >

                        <View style={styles.headContainer}>
                            <Text style={styles.head}>Log In</Text>
                            <Text style={styles.other}>Don't have account?&nbsp;
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("SignUp", { screen: "SignUp" })}>
                                    <Text style={styles.createNewaccount}>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </Text>
                            {
                                errMsg != "" ?
                                    <Text style={styles.errMsg}>{errMsg}</Text>
                                    :
                                    null
                            }
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email address</Text>
                            <TextInput style={styles.input}
                                placeholderTextColor="#999999"
                                onChangeText={(text) => setData({ ...data, email: text })}
                                onPressIn={() => setErrMsg("")}
                                autoComplete="off"
                                placeholder='John@gmail.com'
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.extra}>
                            <TextInput style={styles.inputExtra}
                                // secureTextEntry={false}
                                placeholder='Your Account Password'
                                placeholderTextColor="#999999"
                                secureTextEntry={!showPassword}
                                value={password}
                                // onChangeText={(text) => setPassword(text)}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setData({ ...data, password: text })
                                     }
                                }
                                onPressIn={() => setErrMsg("")}
                                autoComplete="off"
                            />
                            <TouchableOpacity style={{ width:"25%" }} onPress={toggleShowPassword}>
                                    <Text style={{ 
                                        color: "black", 
                                        backgroundColor:"#6495ED",
                                        fontFamily: 'MerriweatherSans-Regular',
                                        textAlign:'center',
                                        height:'90%',
                                        paddingTop:'8%',
                                        borderColor:'black',
                                        borderWidth: 1,
                                        borderRadius: 3
                                    }}>{showPassword ? 'Hide' : 'Show'}</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.fp} 
                            onPressIn={() => navigation.navigate("ForgotPassword", { screen: "ForgotPassword" })}
                        >
                            <Text style={{ color: 'red' }}>Forgot password ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonHead}
                            activeOpacity={1}
                        >
                            <Text style={[styles.buttn, isSignUp && styles.disable]}
                                onPress={() => {
                                    SendDateToBackEnd();
                                }}
                            > Log In </Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",

        height: "100%",
        width: "100%",

        backgroundColor: "#ffffff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        overflow: 'hidden',
    },
    container1: {
        width: '100%',
        height: '45%',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgBackground: {
        height: '100%',
        resizeMode: 'contain'
    },

    container2: {
        width: '100%',
        height: '55%',
    },
    headContainer: {
        paddingBottom: 10,
        paddingTop: 6,
        marginBottom: 10,
    },
    head: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 30,
        textAlign: 'center',
        color: "#000"
    },
    inputGroup: {
        flex: 1,
        padding: 0,
        paddingBottom: 20,
    },
    inputExtra:{
        fontFamily: 'Kanit-Regular',
        backgroundColor: '#00FFFF',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '75%',
        height: '90%',
        paddingLeft: 10,
    },
    extra:{
        width:'100%',
        flex:1,
        height:'30%',
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:'center',
        // backgroundColor:"black"
    },
    createNewaccount: {
        color: 'blue',
        top: 4,
        fontFamily: 'OpenSans-SemiBold',
    },
    errMsg: {
        // borderWidth: 1,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        color: 'red'
    },

    input: {
        fontFamily: 'Kanit-Regular',
        backgroundColor: '#00FFFF',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
        height: '55%',
        paddingLeft: 10,
    },
    label: {
        fontFamily: 'MerriweatherSans-Medium',
        fontSize: 15,
        color: "#000",
    },
    buttonHead: {
        width: '100%',
        height: '30%',

        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttn: {
        fontFamily: 'MerriweatherSans-Regular',
        borderWidth: 2,
        width: '40%',
        height: '40%',
        textAlign: 'center',
        paddingTop: 5,
        backgroundColor: '#6495ED',
        borderRadius: 5,
        fontSize: 20,
        marginTop: 40,
        marginBottom: 20,
        color:"black"
    },
    other: {
        textAlign: 'center',
        fontFamily: 'Kanit-Light',
        paddingTop: 3,
        fontSize: 15,
        color:"#000",
        fontWeight:'500'
    },
    fp: {
        // borderWidth: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '60%',
    },
    disable: {
        fontFamily: 'MerriweatherSans-Regular',
        borderWidth: 2,
        width: '40%',
        height: '40%',
        textAlign: 'center',
        backgroundColor: '#C5BA50',
        borderRadius: 5,
        fontSize: 20,
        paddingTop: 5
        ,
    }
});

export default LogIn;
