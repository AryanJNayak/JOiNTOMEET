import React, {
  useCallback,
} from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

import FontAwesome from "react-native-vector-icons/FontAwesome";

const SearchBar = () => {

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <FontAwesome name="search" size={20} color="#858585" style={{ paddingHorizontal: 10 }} />
        <TextInput style={styles.textInput}
          placeholder='Search'
          placeholderTextColor={"white"}
        />
      </View>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    // borderWidth: 1,
    paddingTop: '6%',
    paddingBottom: '8%',
    paddingHorizontal: '5%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#333333",
    borderRadius: 10,
    paddingHorizontal: '2%',
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    color: 'white',
    fontFamily: 'Kanit-Regular'
  }
})
