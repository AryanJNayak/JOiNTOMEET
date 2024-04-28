import { apiUrl } from '../UrlConstants';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Attendence from '../components/Attendence';

const GetAttendence = ({ navigation, route }) => {
    const { name, clg, role } = route.params.Data;
    let Data = {
        clg, name, role
    }

    // console.log(Data.name + "<< Contact");
    const URL = `${apiUrl}/atd?clg=${clg}`;
    const [attendence, setattendence] = useState([]);

    
    const modifyData = async (data) => {
        const consolidatedData = {};

        // Group data by month
        data.forEach(item => {
            const date = new Date(item.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            // If monthYear not in consolidatedData, create an entry
            if (!consolidatedData[monthYear]) {
                consolidatedData[monthYear] = {
                    // attendance: [],
                    date: monthYear,
                    email: item.email,
                    name: item.name,
                    subject: item.subject
                };
            }
            
        });
        
        return Object.values(consolidatedData);
    }
    function formatMonthYear(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
        const year = date.getFullYear();
        return `${month}-${year}`;
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);
                const data = await response.json();
                
                // setattendence(modifyData(data)._j);

                // console.log(modifyData(data)._j, "<<<<++++++<<<<<<<++++");
                console.log(data);


                const groupedData = data.reduce((acc, curr) => {
                    const { subject, date, email } = curr;
                    const formattedDate = formatMonthYear(date);

                    const key = `${subject}_${formattedDate}_${email}`;
                    if (!acc[key]) {
                        acc[key] = { subject, date: formattedDate, email };
                    }
                    return acc;
                }, {});

                // Convert the grouped data into an array
                const arrangedData = Object.values(groupedData);

                setattendence(arrangedData);
                console.log(arrangedData,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")


                // console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#1c1c1c", justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
                fontSize: 25,
                paddingVertical: 10,
                fontWeight: 600,
                color: "#6495ED",
                width: "70%",
                // borderBottomColor:"#944fa3", 
                // borderBottomWidth:3,
                backgroundColor: "#1c1c1c",
                borderBottomColor: "blue",
                borderBottomWidth: 2,
                marginBottom: 20,
                textAlign: 'center'
            }}>
                Attendance
            </Text>
            <View style={styles.container}>
            
                <ScrollView style={{ flex: 1, width: '90%' }} showsVerticalScrollIndicator={false}>
                    {attendence.map((meeting, index) => (
                        <Attendence key={index} Attendence={meeting} Data={Data} navigation={navigation} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

export default GetAttendence

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Card background color
        paddingBottom: 20,
        paddingTop: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,

    },
    buttonHead: {
        // marginTop: 10,
        // marginBottom: 10,

        width: '100%',
        // height: '30%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor: '#6495ED',
    },

    button: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        backgroundColor: '#6495ED',
        width: '80%',
        // height: '60%',
        color: "black",

        // paddingTop: 4,
        // marginBottom: 50,

        borderWidth: 2,
        borderRadius: 5,
    },
})
