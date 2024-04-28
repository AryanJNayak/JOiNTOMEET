import { apiUrl } from '../UrlConstants';
//import Hooks
import React, {
    useState,
    useCallback,
    useEffect
} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import FilePickerManager from 'react-native-file-picker';
import {
    View,
    Text,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
} from "react-native";
import axios from 'axios';
import DocumentPicker, { types } from 'react-native-document-picker';
import CustomModal from '../components/CustomModal'

//COMPONENT
const CreateAssignment = ({ navigation, route }) => {
    const { email, clg, } = route.params.Data;
    
    const { Data } = route.params;
    // console.log(Data.role + " << create assignment")
    //useState for store data enter by users
    const [isModalVisible, setModalVisible] = useState(false);
    //Enter valid 6 digit ID
    let [errMsg, setErrMsg] = useState(null);  //useState for show err message from backend
    let [isSignUp, setIsSignUp] = useState(0); //Kepp track of signup button click or not
    let [isLoad, setIsLoad] = useState(0); //keep track of loding button is clicked or not

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatepicker, setShowDatepicker] = useState(false);
    // const [showTimepicker, setShowTimepicker] = useState(false);
    const [finaldate, setFinaldate] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [ name, setName] = useState(null);
    let [data, setData] = useState({
        clg,
        name: '',
        instruction:'',
        selectedDate
    });

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.pdf],
            });
            console.log(response);
            setName(response[0].name);
            setSelectedDocument(response);
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()+1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const uploadDocument = async () => {
        setIsLoad(1);
        if (!selectedDocument) {
            console.warn('No document selected');
            return;
        }
        console.log(data);
        try {
            
            const document = selectedDocument[0];
            const formData = new FormData();
            formData.append('pdf', {
                uri: document.uri,
                name: document.name,
                type: document.type,
            });

            formData.append('clg', data.clg);
            formData.append('title', data.name);
            formData.append('instruction', data.instruction);
            formData.append('d', formatDate(selectedDate));
            const URL = `http://192.168.43.68/assignment`;
            // const URL = `${apiUrl}/assignment`;
            
            // Get FormData entries and iterate over them using a traditional loop
            console.log('Selected Document URI:', document.uri);
            console.log('Selected Document Name:', document.name);
            console.log('Selected Document Type:', document.type);
            console.log('Selected Document Size:', document.size);
            console.log('Selected Document Size:', formData);

            console.log(URL);
            const response = await axios.post(URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data.message + " <<<<<<<<<<");
            if(response.data.message) {
                console.log("done");
                setTimeout(() => {
                    setIsLoad(0);
                }, 1000);
            } else if (response.data.error){
                console.log(">>"+response.data.error);
                setTimeout(() => {
                    setIsLoad(0);
                }, 1000);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Request failed with status code', error.response.status);
                console.error('Error data:', error.response.data); // This contains the error message sent from the server
                setTimeout(() => {
                    setIsLoad(0);
                    setErrMsg(error.response.data.error);
                }, 1000);

            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
                setTimeout(() => {
                    setIsLoad(0);
                }, 1000);

            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
                setTimeout(() => {
                    setIsLoad(0);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        // console.log(selectedDate);
        const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
            .toISOString()
            .split('T')[0];
        // const formattedTime = selectedTime.toTimeString().substring(0, 5);
        // const selectedDateTime = `${formattedDate} ${formattedTime}`;
        setFinaldate(formattedDate);
    }, [selectedDate])

    const handleDateChange = (event, date) => {
        setShowDatepicker(false);
        if (date) {
            setSelectedDate(date);
            // setShowTimepicker(true);
        }
    };

    const openDatePicker = () => {
        setShowDatepicker(true);
        // setShowTimepicker(false);
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
                            <Text style={styles.indicatorText}>Posting Assignment...</Text>
                        </View>
                    </View> :
                    null
            }

            {/* heading JOiNTOMEET */}
            < Text style={styles.headingJoinToMeet}> Assignment </Text>
            <View style={styles.mainContainer}
                onPressIn={() => setErrMsg("")}
            >
                {/* <Text style={styles.errMsg}>{errMsg}</Text> */}
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

                        <Text style={styles.label}>Assignment Name&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder='Java '
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, name: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        />
                    </View>


                    {/* ID */}
                    <View style={styles.inputGroup}>

                        <Text style={styles.label}>Instruction&nbsp;&nbsp;&nbsp;</Text>

                        <TextInput style={styles.input}
                            placeholder="Enter Instruction ' . ' separated"
                            placeholderTextColor="#999999"
                            onChangeText={(text) => setData({ ...data, instruction: text })}
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                            multiline
                        // numberOfLines={4}
                        />
                    </View>



                    <View style={{
                        flex: 1,
                        padding: 0,
                    }}>

                        <Text style={styles.label}>Upload&nbsp;&nbsp;&nbsp; </Text>
                        <TouchableOpacity onPress={handleDocumentSelection} 
                            onPressIn={() => setErrMsg("")}
                        style={{
                            marginBottom: 35,
                            width: '100%',
                            height: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',

                        }}>

                            <Text style={{
                                paddingLeft: 10,
                                paddingTop:15,

                                fontFamily: 'Kanit-Regular',

                                width: '100%',
                                height: '100%',
                                color: "#999999",
                                backgroundColor: '#00FFFF',

                                borderBottomWidth: 1,
                                borderBottomColor: 'black',
                                // borderWidth:1
                            }}
                            placeholder='Select PDF'
                            placeholderTextColor="#999999"
                            onPressIn={() => setErrMsg("")}
                            autoComplete="off"
                        > {name ? name : "Select PDF"}</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ height: "10%" }}>

                        <Text style={{
                            fontSize: 15,
                            fontFamily: 'MerriweatherSans-Medium',
                            color: "black",
                        }}>
                        Deadline
                        </Text>
                        <TouchableOpacity onPress={openDatePicker} onPressIn={() => setErrMsg("")} 
                        style={{
                            // marginTop: 10,
                            marginBottom: 45,

                            width: '100%',
                            height: '80%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <Text style={
                                {
                                    textAlign: 'center',
                                    fontFamily: 'Kanit-Regular',

                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#00FFFF',
                                    color: "#000",

                                    paddingTop: 10,
                                    borderBottomWidth: 1,
                                    textAlign: 'left',
                                    paddingLeft: 10
                                }
                            }>
                                {finaldate}
                            </Text>

                        </TouchableOpacity>
                    </View>
                    {showDatepicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={selectedDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                    

                    {/* signup */}
                    <TouchableOpacity style={styles.buttonHead} activeOpacity={1} >
                        <Text style={[styles.button, isSignUp && styles.disableButton]}
                            onPressIn={() => setErrMsg("")}
                            onPress={
                                () => {
                                    Keyboard.dismiss();
                                    setTimeout(() => { uploadDocument(); }, 100);
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
        height: '5%',
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
    },

    buttonHead: {
        marginTop: 45,
        marginBottom: 25,

        width: '100%',
        height: '15%',

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

export default CreateAssignment;
