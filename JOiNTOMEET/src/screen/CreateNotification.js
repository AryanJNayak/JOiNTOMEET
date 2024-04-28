import { apiUrl } from '../UrlConstants';
//import Hooks
import React, {
    useState,
    useCallback,
    useEffect
} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
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
    Button
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import validator from 'validator';
import CustomModal from '../components/CustomModal'
//COMPONENT
const CreateNotification = ({ navigation, route }) => {
    const { email, name, clg, role } = route.params.Data;
    //useState for store data enter by users
    console.log(email, name, clg, role)
    const [isModalVisible, setModalVisible] = useState(false);
    let [data, setData] = useState({
        clg,
        name: '',
        id: '',
        email,
        password: '',
        start: ''
    });

    let [errMsg, setErrMsg] = useState(null);  //useState for show err message from backend
    let [isSignUp, setIsSignUp] = useState(0); //Kepp track of signup button click or not
    let [isLoad, setIsLoad] = useState(0); //keep track of loding button is clicked or not

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [showTimepicker, setShowTimepicker] = useState(false);
    const [finaldate, setFinaldate] = useState("");



    useEffect(() => {
        console.log(email);

        const formattedDate = selectedDate.toISOString().split('T')[0];
        const formattedTime = selectedTime.toTimeString().substring(0, 5);
        const selectedDateTime = `${formattedDate} ${formattedTime}`;
        setFinaldate(selectedDateTime);
    }, [])


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
        setIsLoad(0);
        console.log(finaldate);
        data.start = finaldate;
        console.log(data);
        const URL = `${apiUrl}/shedule`;
        clickSignUp();

        //if user not entered data
        if (!data.name) {
            setErrMsg("Please enter all fields")
        } else if (data.id.length != 6) {
            setErrMsg('Enter valid 6 digit ID')
        }
        else {
            setIsLoad(1);
            // navigation.navigate("Role", { data });
            // const URL = `${apiUrl}/student`;

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
                    console.log("done");
                    console.log(datas);
                    if (datas.err) {
                        console.log(datas.err);
                        setTimeout(() => {
                            setErrMsg(datas.err);
                            setIsLoad(0);
                        }, 2000);
                    } else if (datas.msg || datas.data) {
                        console.log(datas.msg);
                        setIsLoad(0);
                        setModalVisible(true);
                        setTimeout(() => {
                            setModalVisible(false);
                            // navigation.goBack();
                        }, 2000)
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
            <CustomModal title='Success!' isVisible={isModalVisible} />

            {
                isLoad ?
                    <View style={styles.containerLoad}>
                        <View style={styles.mainLoader}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.indicatorText}>Creating Notification...</Text>
                        </View>
                    </View> :
                    null
            }

            {/* heading JOiNTOMEET */}
            < Text style={styles.headingJoinToMeet} >Create Notification</Text >
            <View style={styles.mainContainer}
                onPressIn={() => setErrMsg("")}
            >

                {/* scroll View  when keyboard pop-up then user can scroll*/}
                <ScrollView style={styles.container}
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false} >

                    {/* already existing */}
                    <View style={styles.headContainer}>

                        {/* showing err from backend */}
                        <Text style={styles.errMsg}>{errMsg}</Text>

                    </View>


                    {/* name */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Notification Message&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder='Java '
                            placeholderTextColor="#999999"
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(text) => setData({ ...data, name: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
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
                            Create
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

        paddingTop: 90,
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
        minHeight: "15%",

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
        height: '15%',
        // marginBottom: 10,
    },

    head: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
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
        color: "black",
        backgroundColor: '#00FFFF',

        borderBottomWidth: 1,
        borderBottomColor: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        minHeight: 100,
    },

    buttonHead: {
        marginTop: 15,
        marginBottom: 25,

        width: '100%',
        height: '35%',

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
        color: "black",

        paddingTop: 4,

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

});

export default CreateNotification;