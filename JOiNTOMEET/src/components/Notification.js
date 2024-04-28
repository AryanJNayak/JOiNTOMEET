import { apiUrl } from '../UrlConstants';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Notifications = ({ navigation, route }) => {

  let {clg,role,name,email} = route.params;
  console.log(clg + " " + role + "<<Notification");
  const Data = {
    clg, name, role, email
  }

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = `${apiUrl}/notification?clg=${clg}`;
        const response = await fetch(URL);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const doThis = (timestamp) => {
    // const timestamp = "2024-03-17T11:09:42.546+00:00";
    const dateObj = new Date(timestamp);

    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString('en-US', { month: 'short' })
    const date = dateObj.getDate();
    const hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    if (minute <= 9) {
      minute = "0" + minute;
    }

    // console.log("Year:", year);
    // console.log("Month:", month);
    // console.log("Date:", date);
    // console.log("Hour:", hour);
    // console.log("Minute:", minute);

    return `${date} ${month} ${hour}:${minute}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {role == "teacher" ?
        <TouchableOpacity style={styles.buttonHead}
          onPress={() => {
            navigation.navigate("CreateNotification", { screen: "CreateNotification", Data: Data })
          }}
        >
          <Text style={styles.button}>
            Create Notification
          </Text>
        </TouchableOpacity> : null
      }
      {notifications.slice().reverse().map(notification => (
        <View key={notification._id} style={{ marginTop:20 }}>
          <Text style={{ color: "white", textAlign: 'center', fontSize: 10 }}>{doThis(notification.timestamp)}</Text>
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{notification.notification}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1c1c1c"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#fff',
    borderBottomColor: "blue",
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  notificationContainer: {
    // marginBottom: 10,
    padding: 10,
    backgroundColor: '#6495ED',
    borderRadius: 5,
  },
  notificationText: {
    fontSize: 13,
    color: '#000',
    fontFamily: "MerriweatherSans-Medium"
  },
  buttonHead: {

    width: '100%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  button: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'MerriweatherSans-Regular',

    backgroundColor: '#6495ED',
    width: '80%',
    color: "black",

    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Notifications;
