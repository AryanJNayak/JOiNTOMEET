import { apiUrl } from '../UrlConstants';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Schedule from './Schedule';

const ScheduleView = ({ navigation, route }) => {
  const { email, name, clg, role, phone } = route.params.Data;
  let Data = {
    email, clg, name, role, phone
  }

  console.log(Data.name + "<< ScheduleView");
  const URL = `${apiUrl}/shedule?clg=${clg}`;
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setMeetings(data);
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
        backgroundColor: "#1c1c1c",
        borderBottomColor: "blue",
        borderBottomWidth: 2,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        SCHEDULE
      </Text>
      <View style={styles.container}>
        {role == "teacher" ?
          <TouchableOpacity style={styles.buttonHead}
            onPress={() => {
              navigation.navigate("CreateSchedule", { screen: "CreateSchedule", Data: Data })
            }}
          >
            <Text style={styles.button}>
              Create Schedule
            </Text>
          </TouchableOpacity> : null
        }
        <ScrollView style={{ flex: 1, width: '90%' }} showsVerticalScrollIndicator={false}>
          {meetings.map((meeting, index) => (
            <Schedule key={index} meeting={meeting} Data={Data} navigation={navigation} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default ScheduleView

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
})
