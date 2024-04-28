//3, 4, 6, 9, 15, 19
import React, {useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  BackHandler,
  Alert
} from 'react-native'

import Header from '../components/Header';
import MenuButton from '../components/MenuButton';

import List from '../screen/List'

const HomePage = ({ navigation, route }) => {

  const { Data } = route.params;
  console.log(Data, "<< Homepage");
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <Header navigation={navigation} Data={Data} />
      <ScrollView style={{ flex: 1, width: '100%'}}>
        <MenuButton navigation={navigation} Data={Data} />
        <List clg={Data.clg} role={Data.role}/>
      </ScrollView>
    </View>

  )
}

export default HomePage

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#1c1c1c',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

})
