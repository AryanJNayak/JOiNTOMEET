import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}/password`;

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

import backGround from '../../assets/7070629_3293465.jpg';

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [verCode, setVerCode] = useState('');
    let [verificationCode, setVerificationCode] = useState('');
    let [Data, setdata] = useState({
        email,
        role:'',
        clg:'',
    })

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

    var code = '';
    const SendDateToBackEnd = async () => {
        // clickSignUp();

        // if (data.email == "Test") {
        //     let studData = {
        //         name: "aryan",
        //     }
        //     navigation.navigate("HomePage", { screen: "HomePage", studentData: studData })
        // }
        // console.log(data);
        if (!email) {
            setErrMsg("Please enter email address");
        } else {
            const data = { email };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            console.log(data);
            fetch(URL, options)
                .then(res => res.json())
                .then(datas => {
                    console.log(datas)
                    Data.clg = datas.code.clg;
                    Data.email = datas.code.email;
                    Data.role = datas.code.role;
                    console.log(Data);
                    if (datas.err) {
                        console.log(datas)
                        setErrMsg(datas.err);
                    } else {
                        setVerificationCode(datas.code.varificationCode);
                        console.log(verificationCode);
                        // setTimeout(() => {
                        // navigation.navigate("HomePage", { screen: "HomePage", studentData: datas.studData })
                        // }, 70);
                    }
                })
        }
    }

    const verify = () => {
        console.log("->", verCode == verificationCode);

        if (verCode == verificationCode) {
            navigation.navigate("ChangePassword", { Data });
        } else {
            setErrMsg("Invalid Code");
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
                            <Text style={styles.head}>Forgot Password</Text>
                            
                            {
                                errMsg != "" ?
                                    <Text style={styles.errMsg}>{errMsg}</Text>
                                    :
                                    null
                            }
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.extra}>
                                <TextInput style={styles.inputExtra}
                                    placeholder="Enter Your email"
                                    placeholderTextColor="#999999"
                                    onChangeText={(text) => {
                                        // setPassword(text);
                                        setEmail(text);
                                    }}
                                    onPressIn={() => setErrMsg("")}
                                    autoComplete="off"
                                />
                                <TouchableOpacity style={{ width: "25%" }} onPress={() => {
                                    SendDateToBackEnd();
                                }}
                                >
                                    <Text style={{
                                        color: "black",
                                        backgroundColor: "#6495ED",
                                        fontFamily: 'MerriweatherSans-Regular',
                                        textAlign: 'center',
                                        height: '90%',
                                        paddingTop: '8%',
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        // borderRadius: 3
                                    }}>Get Code</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Code</Text>
                            <TextInput style={styles.input}
                                placeholderTextColor="#999999"
                                onChangeText={(text) => setVerCode(text)}
                                onPressIn={() => setErrMsg("")}
                                autoComplete="off"
                                placeholder="Enter your code"
                            />
                        </View>
                   
                        <TouchableOpacity
                            style={styles.buttonHead}
                            activeOpacity={1}
                        >
                            <Text style={[styles.buttn, isSignUp && styles.disable]}
                                onPress={() => {
                                    verify();
                                }}
                            > Authenticate </Text>
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
        backgroundColor: '#fff',
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
        // borderTopLeftRadius: 50,
        // borderTopRightRadius: 50,
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
    inputExtra: {
        fontFamily: 'Kanit-Regular',
        backgroundColor: '#00FFFF',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '75%',
        height: '90%',
        paddingLeft: 10,
    },
    extra: {
        width: '100%',
        flex: 1,
        height: '30%',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
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
        width: '50%',
        height: '40%',
        textAlign: 'center',
        paddingTop: 5,
        backgroundColor: '#6495ED',
        borderRadius: 5,
        fontSize: 20,
        marginTop: 40,
        marginBottom: 20,
        color: "black"
    },
    other: {
        textAlign: 'center',
        fontFamily: 'Kanit-Light',
        paddingTop: 3,
        fontSize: 15,
        color: "#000",
        fontWeight: '500'
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

export default ForgotPassword