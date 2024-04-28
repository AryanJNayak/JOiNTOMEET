import { apiUrl } from '../UrlConstants';
import { localUrl } from '../localhostUrl';

import React, {
    useState,
    useCallback
} from "react";

import {
    View,
    Text,
    Modal,
    Platform,
    Pressable,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import validator from 'validator';

//custome alert
const CustomAlert = (props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
            onRequestClose={() => {
                props.setModalVisible(false);
            }}
        >
            <Pressable style={[Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop, styles.backdrop]} onPress={() => props.setModalVisible(false)} />
            <View>

            </View>
        </Modal>
    )
}

//COMPONENT
const SignUp = ({ navigation }) => {
    // let [modalVisible, setModalVisible] = useState(false);
    
    //useState for store data enter by users
    let [data, setData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        clg:'',
        role:''
    });
    
    let [errMsg, setErrMsg] = useState(null);  //useState for show err message from backend
    let [isSignUp, setIsSignUp] = useState(0); //Kepp track of signup button click or not
    let [isLoad, setIsLoad] = useState(0); //keep track of loding button is clicked or not
    const [selectedRole, setSelectedRole] = useState('student');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };
    
    const clickSignUp = () => {
        //change state when signup button is clicked
        setIsSignUp(1);
        
        

        //after 200ms state change
        setTimeout(() => {
            setIsSignUp(0);
        }, 200);
    }

    //keyboardavoidingview
    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
    const keyboardDismissMode = Platform.OS === "ios" ? 'interactive' : 'on-drag';
    
    //this made POST request to '/signup'
    const SendDateToBackEnd = async () => {
        // console.log(selectedRole);
        setIsLoad(0);
        data.role = selectedRole;
        
        console.log(data.role)

        const URL = `${localUrl}/${data.role}`;
        // const URL = `${apiUrl}/${data.role}`;
        
        clickSignUp();
        if (data.name == "Test") {
            let studData = {
                name: "aryan",
            }
            navigation.navigate("HomePage", { screen: "HomePage", studentData: studData })
        }

        //if user not entered data
        if (!data.email || !data.password || !data.name || !data.phone || !data.confirmPassword) {
            setErrMsg("Please enter all fields")
        } else if (!validator.isEmail(data.email)) {
            setErrMsg('Enter valid Email!')
        } else if(data.phone.length != 10){
            setErrMsg('Enter valid Phone Number')
        }
        else {
            setIsLoad(1);
            // navigation.navigate("Role", { data });
            // const URL = `${apiUrl}/student`;
            console.log(data);
            console.log(URL);

            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };

            await fetch(URL, option)
                .then(res => res.json())
                .then(datas => {
                    console.log(datas);
                    if (datas.err) {
                        console.log(datas.err);
                        setTimeout(() => {
                            setErrMsg(datas.err);
                            setIsLoad(0);
                        }, 2000);
                    } else if (datas.msg || datas.data) {
                        console.log(datas.msg);
                        console.log(datas.data);

                        //Navigate to Varification Page with studentData props with varificationCode
                        navigation.navigate("Varification", { Data: datas.data });
                        setIsLoad(0);
                    }
                    setIsLoad(0);
                })
        }
        setIsLoad(0);
    }


    return (

        //when touch on screen then keyboard goes down
        < KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={keyboardVerticalOffset}
            keyboardDismissMode={keyboardDismissMode}
            style={styles.keyboardAvoidingViewStyle}
        >


            {
                isLoad ?
                    <View style={styles.containerLoad}>
                        <View style={styles.mainLoader}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.indicatorText}>Checking Details...</Text>
                        </View>
                    </View> :
                    null
            }

            {/* heading JOiNTOMEET */}
            < Text style={styles.headingJoinToMeet} > JOiNTOMEET</Text >
            <View style={styles.mainContainer}
                onPressIn={() => setErrMsg("")}
            >

                {/* scroll View  when keyboard pop-up then user can scroll*/}
                <ScrollView style={styles.container}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false} >

                    {/* already existing */}
                    <View style={styles.headContainer}>

                        <Text style={styles.head}>Sign Up</Text>

                        <Text style={styles.info}>Already have an account?&nbsp;
                            <TouchableOpacity
                                onPress={() => { navigation.navigate("LogIn", { screen: "LogIn" }) }}>
                                <Text style={styles.alreadyExist} >

                                    Log In

                                </Text>
                            </TouchableOpacity>
                        </Text>

                        {/* showing err from backend */}
                        <Text style={styles.errMsg}>{errMsg}</Text>

                    </View>


                    {/* name */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Name&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder='John'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, name: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    {/* phone */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Phone&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder='9999999999'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, phone: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    {/* email */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Email address&nbsp;&nbsp;&nbsp; </Text>

                        <TextInput style={styles.input}
                            placeholder='John@gmail.com'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, email: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    {/* password */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Password&nbsp;&nbsp;&nbsp; </Text>

                        <TextInput style={styles.input}
                            placeholder='Enter Strong password'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, password: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    {/* confirm password */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Confirm Password&nbsp;&nbsp;&nbsp; </Text>

                        <TextInput style={styles.input}
                            placeholder='Confirm password ?'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, confirmPassword: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>

                    {/* college name */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Class ame&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder='C.U. shah'
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, clg: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderBottomColor: 'black',
                        borderBottomWidth: 2,
                        height: "20%",
                        // alignItems: 'center',
                        // justifyContent: 'center',
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
                                width: '100%',
                                height: '5%',
                                borderRadius: 10,
                                color: '#999999',
                                backgroundColor: '#00FFFF',
                            }}

                            selectedValue={selectedRole}
                            onValueChange={handleRoleChange}>
                            <Picker.Item label="student" value="student" />
                            <Picker.Item label="teacher" value="teacher" />
                        </Picker>
                    </View>


                    {/* signup */}
                    <TouchableOpacity style={styles.buttonHead} activeOpacity={1} >
                        <Text style={[styles.button, isSignUp && styles.disableButton]}
                            onPressIn={() => setErrMsg("")}
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    setTimeout(() => { SendDateToBackEnd(); }, 100);
                                }
                            } >
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                </ScrollView>

            </View>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingViewStyle: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',

        width: '100%',
        height: '100%',
        backgroundColor: 'black',

        paddingTop: 70,
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

        width: '50%',
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

    headingJoinToMeet: {
        minHeight: "10%",

        fontSize: 40,
        color: 'blue',
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Heebo-Medium',
    },

    mainContainer: {
        paddingTop: 10,

        height: "90%",
        width: "100%",
        backgroundColor: "#ffffff",

        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,

        flexDirection: "column",
        justifyContent: "space-between",
    },

    container: {
        flex: 1,

        paddingHorizontal: 40,
    },

    headContainer: {
        height: '12%',
        marginBottom: 5,
    },

    head: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'OpenSans-SemiBold',
        color:"black",
    },

    info: {
        paddingTop: 3,
        color: "black",
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Kanit-Light',
    },

    alreadyExist: {
        top: 4,

        color: 'blue',
        fontFamily: 'OpenSans-SemiBold',
    },

    errMsg: {
        color: 'red',
        textAlign: 'center',
        fontFamily: 'Rubik-Regular',
    },

    inputGroup: {
        flex: 1,
        padding: 0,
        marginBottom: 30,
    },

    label: {
        fontSize: 15,
        fontFamily: 'MerriweatherSans-Medium',
        color: "black",
    },

    input: {
        paddingLeft: 10,

        fontFamily: 'Kanit-Regular',

        width: '100%',
        height: '55%',
        color:"black",
        backgroundColor: '#00FFFF',

        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

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
        height: '50%',
        backgroundColor: '#6495ED',
        color:"black",

        paddingTop: 4,
        marginBottom: 50,

        borderWidth: 2,
        borderRadius: 5,
    },

    disableButton: {
        paddingTop: 4,

        width: '40%',
        height: '50%',
        backgroundColor: '#C5BA50',

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        borderWidth: 2,
        borderRadius: 5,

    },

    //This is for custome modals/alert
    iOSBackdrop: {
        opacity: 0.3,

        backgroundColor: "#000000",
    },

    androidBackdrop: {
        opacity: 0.32,

        backgroundColor: "#232f34",
    },

    backdrop: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
    },
});

export default SignUp;