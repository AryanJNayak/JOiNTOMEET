// Done
import React, {
    useState,
    useEffect,
    useCallback
} from 'react';

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
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { apiUrl } from '../UrlConstants';
import {loaclUrl} from '../localhostUrl';

import backGroundImage from '../../assets/join-to-meet-high-resolution-logo-white-on-transparent-background.png';

//COMPONENT
const Varification = ({ navigation, route }) => {

    //containe studentData from SignUp Component
    const { Data } = route.params;
    // console.log(Data);

    let [errMsg, setErrMsg] = useState(null);      //useState for show err message from backend
    let [isSignUp, setIsSignUp] = useState(0);     //Kepp track of signup button click or not
    let [data, setData] = useState({ code: '' });  //store data from users
    let [message, setMessage] = useState("");
    let [isLoad, setIsLoad] = useState(0); //keep track of loding button is clicked or not
    
    useEffect(() => {
        setMessage("Check Spam Directory Also");
        setTimeout(() => {
            setMessage("");
        }, 50000)
        ;
    }, []);
    
    const clickSignUp = () => {
        //change state when signup button is clicked
        setIsSignUp(1);
        
        //after 100ms state change
        setTimeout(() => {
            setIsSignUp(0);
        }, 100);
        

        setTimeout(() => {
            setErrMsg("");
        }, 5000);
    }

    //this made POST request to '/varify'
    const SendDateToBackEnd = async () => {

        clickSignUp();

        //if user not entered varificationCode
        if (!data.code) {
            setErrMsg("Enter Code");
        } else if (data.code != Data.varificationCode) {
            setErrMsg("Invalid Code"); //if user not enter valid varificationCode
        } else {
            setIsLoad(1);
            console.log(Data.varificationCode);
            console.log(data.code);
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Data)
            };

            const URL = `http://192.168.43.68/userSignup`;
            // const URL = `${apiUrl}/studentSignup`;
            await fetch(URL, option)
                .then(res => res.json())
                .then(datas => {
                    if (datas.err) {
                        console.log(datas.err);
                        setErrMsg(datas.err);
                        setIsLoad(0);
                    } else {
                        //After Successfull signup it navigate to HomePage
                        console.log("from Verification to Home Page", datas.Data);
                        navigation.navigate("HomePage", { Data: datas.Data});
                        setIsLoad(0)
                    }
                })
            setIsLoad(1);
        }
    }

    //keyboardavoidingview
    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
    const keyboardDismissMode = Platform.OS === "ios" ? 'interactive' : 'on-drag';

    return (

        //When touch on screen then keyboard goes down
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={keyboardVerticalOffset}
            keyboardDismissMode={keyboardDismissMode}
            style={styles.keyboardAvoidingViewStyle}
        >

            {
                isLoad ?
                    <View style={styles.containerLoad
                    } >
                        <View style={styles.mainLoader}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.indicatorText}>Verifying...</Text>
                        </View>
                    </View > :
                    null
            }

            {/*Background image container With Image - first conatiner*/}
            <View style={styles.container1}>
                <Image source={backGroundImage} style={styles.imgBackground} />
            </View>

            {/*second container*/}
            <View style={styles.container2} >

                {/*main container contains scrollableView with inputFields and button */}
                <View style={styles.mainContainer} >

                    {/* scroll View  when keyboard pop-up then user can scroll*/}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}
                        style={styles.scrollViewStyle} >

                        {/* it contains heading with signup and login navigation */}
                        <View style={styles.headContainer}>

                            {/* heading */}
                            <Text style={styles.headings}>Verify it's you</Text>

                            <Text style={styles.navigationContainer}>

                                {/* navigate to signup and login*/}
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("SignUp", { screen: "SignUp" })}>
                                    <Text style={styles.navigationButton} >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("LogIn", { screen: "LogIn" })}>
                                    <Text style={styles.navigationButton} >
                                        Log In
                                    </Text>
                                </TouchableOpacity>

                            </Text>

                            {/* showing err from backend */}
                            <Text style={styles.errMsg}>{errMsg}</Text>

                            {/* description */}
                            <View style={styles.information}>
                                <Text style={{ fontFamily: 'Rubik-Regular', color: "black", fontSize:15, }}>
                                    code just sent to: &nbsp;
                                    <Text style={{ fontFamily: 'Rubik-Regular', color:"black", fontWeight:'700' }}>
                                        {Data.email}
                                    </Text>
                                </Text>

                                <Text style={{
                                    fontFamily: 'Rubik-Regular',
                                    color: 'red',
                                    fontWeight: 500,
                                    height: '35%',
                                    // borderWidth:2,
                                    
                                }}>
                                    {message}
                                </Text>

                            </View>

                        </View>

                        {/* inputField */}
                        <View style={styles.inputGroup}>

                            <Text style={styles.label}>Varification Code</Text>

                            <TextInput style={styles.input}
                                onChangeText={(text) => setData({ ...data, code: text })}
                                onPressIn={() => { setErrMsg(""); }}
                                autoComplete="off"
                                placeholderTextColor="#999999"
                                placeholder='Code'
                            />
                        </View>

                        {/* varify the varificationCode to userEnteredCode */}
                        <TouchableOpacity style={styles.buttonHead} activeOpacity={1} >
                            <Text style={[styles.button, isSignUp && styles.disableButton]}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    setTimeout(() => { SendDateToBackEnd() }, 100);
                                }} >
                                Verify
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>

                </View>

            </View>

        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,

        top: 0,
        position: 'absolute',

        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },

    containerLoad: {
        position: 'absolute',
        top: 70,

        width: '100%',
        height: '100%',

        backgroundColor: "rgba(0,0,0,0.5)",

        justifyContent: 'center',
        alignItems: 'center',

        zIndex: 1,
    },

    mainLoader: {
        borderRadius: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        width: '40%',
        height: '20%',
        backgroundColor: '#fff',
    },

    indicatorText: {
        zIndex: 1,
        color: '#000',
        fontFamily: 'Kanit-Regular',
        fontSize: 18,
        marginTop: 12,
        width: '100%',
        textAlign: 'center',
    },

    container1: {
        width: '100%',
        height: '45%',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imgBackground: {
        height: '40%',
        resizeMode: 'contain'
    },

    container2: {
        padding: 0,

        width: '100%',
        height: '55%',
    },

    mainContainer: {
        padding: 0,

        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",

        overflow: 'hidden',

        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },

    scrollViewStyle: {
        flex: 1,

        width: '100%',
        height: '100%',

        paddingTop: 20,
        paddingHorizontal: 30,
    },

    headContainer: {
        paddingTop: 5,

        height: '40%',

        display: 'flex',
        justifyContent: 'space-around',
    },

    headings: {
        // borderWidth: 2,
        fontSize: 30,
        color:"black",
        textAlign: 'center',
        fontFamily: 'OpenSans-SemiBold',
    },

    navigationContainer: {
        paddingTop: 15,
        textAlign: 'center',
        fontFamily: 'Kanit-Light',
    },

    navigationButton: {
        color: 'blue',
        marginRight: 10,
        fontFamily: 'OpenSans-SemiBold',
    },

    errMsg: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 5
    },

    information: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    inputGroup: {
        padding: 0,
        marginVertical: 16,

        height: '20%',
    },

    label: {
        fontSize: 15,
        fontFamily: 'MerriweatherSans-Medium',
        color:"black"
    },

    input: {
        paddingLeft: 10,

        color: '#000',
        fontFamily: 'Kanit-Regular',

        height: '50%',
        width: '100%',
        backgroundColor: '#00FFFF',

        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

    buttonHead: {
        width: '100%',
        height: '11%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 100,
    },

    button: {
        paddingTop: 5,

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',


        width: '40%',
        height: '100%',
        backgroundColor: '#6495ED',
        color:"black",


        borderWidth: 2,
        borderRadius: 5,
    },

    disableButton: {
        paddingTop: 5,

        borderWidth: 2,
        borderRadius: 5,

        width: '40%',
        height: '100%',
        backgroundColor: '#C5BA50',

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSan-Regular',
    }
});

export default Varification;
