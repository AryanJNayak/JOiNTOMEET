import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}/changePassword`;

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
    Alert,
} from "react-native";

import backGround from '../../assets/password-reset-line-icon-vector.jpg';

const ChangePassword = ({ navigation, route }) => {

    let {Data} = route.params;
    console.log(Data.email);


    let [data, setData] = useState({ email: Data.email, password: '', cpassword: '', role:Data.role, clg:Data.clg });

    let [errMsg, setErrMsg] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [cpassword, setcPassword] = useState('');
    const [showcPassword, setShowcPassword] = useState(false);
    let [isSignUp, setIsSignUp] = useState(0);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const toggleShowcPassword = () => {
        setShowcPassword(!showcPassword);
    };

    const clickSignUp = () => {
        setIsSignUp(1);
        setTimeout(() => {
            setIsSignUp(0);
        }, 100);
    }

    const SendDateToBackEnd = async () => {
        clickSignUp();

        if (!data.password || !data.cpassword) {
            setErrMsg("Please enter all fields")
        } else if (data.password != data.cpassword){
            setErrMsg("Password Does not match")
        }
        else {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };console.log(data);
            fetch(URL, option)
                .then(res => res.json())
                .then(datas => {
                    console.log(datas);
                    if (datas.err) {
                        setErrMsg(datas.err);
                    } else {
                        console.log("sucess")
                        setTimeout(() => {
                            navigation.navigate("HomePage", { screen: "HomePage", Data: Data });
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
                            <Text style={styles.head}>Change Password</Text>
                            {
                                errMsg != "" ?
                                    <Text style={styles.errMsg}>{errMsg}</Text>
                                    :
                                    null
                            }
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.extra}>
                                <TextInput style={styles.inputExtra}
                                    placeholder='Enter New Password'
                                    placeholderTextColor="#999999"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setData({ ...data, password: text })
                                    }
                                    }
                                    onPressIn={() => setErrMsg("")}
                                    autoComplete="off"
                                />
                                <TouchableOpacity style={{ width: "25%" }} onPress={toggleShowPassword}>
                                    <Text style={{
                                        color: "black",
                                        backgroundColor: "#6495ED",
                                        fontFamily: 'MerriweatherSans-Regular',
                                        textAlign: 'center',
                                        height: '90%',
                                        paddingTop: '8%',
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderRadius: 3
                                    }}>{showPassword ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.extra}>
                                <TextInput style={styles.inputExtra}
                                    placeholder='Conform New Password'
                                    placeholderTextColor="#999999"
                                    secureTextEntry={!showcPassword}
                                    value={cpassword}
                                    onChangeText={(text) => {
                                        setcPassword(text);
                                        setData({ ...data, cpassword: text })
                                    }
                                    }
                                    onPressIn={() => setErrMsg("")}
                                    autoComplete="off"
                                />
                                <TouchableOpacity style={{ width: "25%" }} onPress={toggleShowcPassword}>
                                    <Text style={{
                                        color: "black",
                                        backgroundColor: "#6495ED",
                                        fontFamily: 'MerriweatherSans-Regular',
                                        textAlign: 'center',
                                        height: '90%',
                                        paddingTop: '8%',
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderRadius: 3
                                    }}>{showcPassword ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                        <TouchableOpacity
                            style={styles.buttonHead}
                            activeOpacity={5}
                        >
                            <Text style={[styles.buttn, isSignUp && styles.disable]}
                                onPress={() => {
                                    SendDateToBackEnd();
                                }}
                            >Change Password</Text>
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
        backgroundColor: "#09072c",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgBackground: {
        width: '60%',
        resizeMode: 'contain'
    },

    container2: {
        width: '100%',
        height: '55%',
    },
    headContainer: {
        height:"20%",
        paddingBottom: 25,
        marginBottom: 10,
        // borderWidth:2,
    },
    head: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 30,
        textAlign: 'center',
        color: "#000",
        paddingVertical:5,
        // borderWidth:1,
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
        width: '80%',
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
        width: '80%',
        height: '40%',
        textAlign: 'center',
        backgroundColor: '#C5BA50',
        borderRadius: 5,
        fontSize: 20,
        paddingTop: 5
        ,
    }
});

export default ChangePassword;
