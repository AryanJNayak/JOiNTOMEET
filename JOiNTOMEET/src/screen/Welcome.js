// Done
import React, {
    useState,
    useEffect,
    useCallback,
} from 'react';

import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import { apiUrl } from '../UrlConstants';
const URL = `${apiUrl}/check`;

import backGroundImage from '../../assets/WelcomeBackgroundImage.png';

//COMPONENT
const Welcome = ({ navigation }) => {

    let [isLogIn, setIsLogIn] = useState(0);   //keep track of login button is clicked or not
    let [isSignUp, setIsSignUp] = useState(0); //keep track of signup button is clicked or not
    let [isLoad, setIsLoad] = useState(0); //keep track of loding button is clicked or not

    const clickLogIn = () => {
        //change state when login button is clicked
        setIsLogIn(1);

        //after 100ms state change
        setTimeout(() => {
            setIsLogIn(0);
        }, 100);

        //navigate to login page after 70ms
        setTimeout(() => {
            navigation.navigate("LogIn", { screen: "LogIn" })
        }, 70);

    }

    const clickSignUp = () => {
        //change state when signup button is clicked
        setIsSignUp(1);

        //after 100ms state change
        setTimeout(() => {
            setIsSignUp(0);
        }, 100);
        console.log("signup");

        //navigate to signup page after 70ms
        setTimeout(() => {
            navigation.navigate("SignUp", { screen: "SignUp" })
        }, 70);
    }

    //sending data to backend
    const SendDateToBackEnd = async () => {

        //attributes
        const option = {
            method: 'GET',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "include"
        };

        //This made GET request at '/check'
        await fetch(URL, option)
            .then(res => res.json())
            .then(response => {
                console.log(response + " <<<<");

                if (response.Data) {
                    const data = response.Data;
                    console.log(data);

                    // if user already exist no need to login and sign up
                    console.log(data + "  << Welcome Page");
                    console.log("from welcomr to Home Page");
                    navigation.navigate("HomePage", { Data: data });
                    setTimeout(() => {
                        setIsLoad(0);
                    }, 2000)
                } else {
                    setTimeout(() => {
                        setIsLoad(0);
                    }, 2000)
                }
            })
            
            .catch((err) => {
                alert(JSON.stringify(err))
                setIsLoad(0);
            })
    }

    //useEffect take care of already existing users
    useEffect(() => {
        setIsLoad(1);

        setTimeout(() => {
            SendDateToBackEnd();
        }, 2000)
    }, []);

    return (

        // mainView
        <View style={styles.container}>

            {/* heading */}
            <Text style={styles.headingContainer}>
                Welcome
            </Text>

            {/* image container with image component */}
            <View style={styles.imageContainer}>

                <Image source={backGroundImage} style={styles.imageStyle} />

                {/* navigation container */}
                {
                    isLoad ?
                        <View style={styles.containerLoad}>
                            <ActivityIndicator size="large" color="#0000ff" />
                            <Text style={styles.indicatorText}>Authenticating...</Text>
                        </View>

                        :

                        <View style={styles.buttonHeadContainer}>

                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.button}
                                onPress={clickLogIn} >
                                <Text style={[styles.buttonText, isLogIn && styles.buttonDisable]}> Log In </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.button}
                                onPress={() => { clickSignUp(); }
                                } >
                                <Text style={[styles.buttonText, isSignUp && styles.buttonDisable]}>Sign Up</Text>
                            </TouchableOpacity>

                        </View>
                }
            </View>

        </View>
    )
}

export default Welcome;

const styles = StyleSheet.create({

    containerLoad: {
        borderWidth: 1,
        width: '40%',
        height: '34%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    indicatorText: {
        color: 'white',
        fontFamily: 'Kanit-Regular',
        fontSize: 18,
        marginTop: 12,
        width: '100%',
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        height: '100%',
        width: '100%',
        backgroundColor: '#000',
    },

    headingContainer: {
        fontSize: 30,
        color: '#fff',
        fontFamily: 'OpenSans-SemiBold',

        marginVertical: 20,

        textAlign: 'center',
        textAlignVertical: 'center',
    },

    imageContainer: {
        width: '100%',
        height: '75%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    //width property change aspectRatio
    imageStyle: {
        height: '26%',

        resizeMode: 'contain',
    },

    buttonHeadContainer: {
        width: '50%',
        height: '35%',

        marginTop: 20,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        borderColor: '#fff',
    },

    button: {
        width: '60%',
        height: '25%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        textAlign: 'center',
        textAlignVertical: 'center',

        marginVertical: 10,
    },

    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-SemiBold',

        paddingTop: 6,
        fontWeight: 'bold',
        width: '100%',
        height: '100%',
        backgroundColor: '#6495EF',
        color: "black",

        borderWidth: 1,
        borderRadius: 5,
    },

    buttonDisable: {
        paddingTop: 6,

        width: '100%',
        height: '100%',
        backgroundColor: '#000',

        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#fff',

        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-SemiBold',
    }
});