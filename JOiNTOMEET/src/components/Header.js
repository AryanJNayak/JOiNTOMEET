import React, { useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

// import { useFonts, Rubik_600SemiBold } from '@expo-google-fonts/rubik';

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Header = ({ navigation, Data }) => {
  console.log(Data + "<<from header");
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Notification", { screen: "Notification", clg: Data.clg, role: Data.role })
        }}>
        <MaterialCommunityIcons name="bell-badge-outline" size={28} color="#efefef" />
      </TouchableOpacity>

      <Text style={styles.head}>Meet & Chat</Text>

      <TouchableOpacity style={{ paddingTop: 4 }}
        onPress={() => {
          navigation.navigate("Profile", { screen: "Profile", Data: Data })
        }}
      >
        <AntDesign name="profile" size={27} color="#efefef" />
      </TouchableOpacity>

    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    borderBottomColor: 'black',
    borderBottomWidth: 5,

    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1c1c1c',
    marginBottom: 10
  },
  head: {
    fontSize: 19,
    color: '#efefef',
    fontFamily: 'Rubik-SemiBold',
  },
})
