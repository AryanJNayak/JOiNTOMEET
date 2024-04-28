import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { apiUrl } from '../UrlConstants';
const List = ({ clg, role }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let URL
                if(role =="teacher"){
                    URL = `http://192.168.43.68/StudentList?clg=${clg}`;
                } else {
                    URL = `http://192.168.43.68/TeacherList?clg=${clg}`;
                }
                const response = await fetch(URL);
                const data = await response.json();
                setNotifications(data);
                console.log(JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={{marginBottom:20, paddingHorizontal:5}}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10, color: "blue" }}>
                {role == "teacher" ? "Student" : "Teacher"}
            </Text>
            {notifications.slice().reverse().map(notification => (
                
                <View key={notification._id} style={{ marginTop: 20, paddingVertical:10, borderColor: "#6495ED", borderWidth: 2, paddingLeft: 20, borderRadius:20}}>
                    <Text style={{ color: "white", fontSize: 15 }}>
                        {role == "teacher" ? notification.student_Name : notification.teacher_Name}
                    </Text>
                    <View style={styles.notificationContainer}>
                        <Text style={styles.notificationText}>
                        {role == "teacher" ? 
                        notification.student_RollNo + " | "+ notification.student_Email
                        : notification.teacher_Email}
                        
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#1c1c1c",
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        // marginBottom: 25,
        textAlign: 'center',
        color: '#fff',
        borderBottomColor: "blue",
        borderBottomWidth: 2,
        paddingBottom: 10,
    },
    notificationContainer: {
        // marginBottom: 10,
        // padding: 10,
        // backgroundColor: '#6495ED',
        borderRadius: 5,
    },
    notificationText: {
        fontSize: 13,
        color: '#fff',
        fontFamily: "MerriweatherSans-Medium"
    },
})