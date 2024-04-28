import React, {
  useCallback
} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import Feather from "react-native-vector-icons/Feather";


const MenuButton = ({ navigation, Data }) => {
  // console.log(Data.email + " " + Data.name + " " + Data.phone + "<- this");

  console.log(Data.email + " " + Data.role + "<< from menubutton");

  return (
    <View style={styles.container}>

      <View style={styles.textIconContainer}>
        <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            navigation.navigate("GetAttendence", { screen: "GetAttendence", Data: Data })
          }}
        >
          <View style={{ ...styles.iconContainer, backgroundColor: '#FF751F' }}>
            <Feather name="file" size={25} color={'white'} />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Attendance</Text>
      </View>

      <View style={styles.textIconContainer}>
        <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            navigation.navigate("JoinMeetingRoom", { screen: "JoinMeetingRoom", Data: Data })
          }}
        >
          <View style={{ ...styles.iconContainer, backgroundColor: '#0470DC' }} >
            <Feather name="plus-square" size={25} color={'white'} />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Join</Text>
      </View>

      <View style={styles.textIconContainer}>
        <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            navigation.navigate("Assignment", { screen: "Assignment", Data: Data })
          }}
        >

          <View style={{ ...styles.iconContainer, backgroundColor: '#0470DC' }}>
            <Feather name="upload" size={25} color={'white'} />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>Assignment</Text>
      </View>

      <View style={styles.textIconContainer}>
        <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            navigation.navigate("ScheduleView", { screen: "ScheduleView", Data: Data })
          }}
        >
          <View style={{ ...styles.iconContainer, backgroundColor: '#0470DC' }}>
            <Feather name="calendar" size={25} color={'white'} />
          </View>
        </TouchableOpacity>
        <Text style={styles.text}>
          {Data.role == "student" ? "Schedule" : "Post Schedule"}
        </Text>
      </View>

    </View>
  )
}

export default MenuButton

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  textIconContainer: {
    borderColor: 'white',
    width: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    borderColor: "#fff",
    borderRadius: 13,
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '18%',
    paddingHorizontal: '9%',
  },

  text: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
    fontFamily: 'Kanit-Regular',
  }
})
