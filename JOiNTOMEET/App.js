import {
  View,
} from 'react-native';

//Components to Be Render
import Welcome from './src/screen/Welcome';
import LogIn from './src/screen/LogIn';
import SignUp from './src/screen/SignUp';
import Varification from './src/screen/Varification';
import HomePage from './src/screen/HomePage';
import JoinMeetingRoom from './src/screen/JoinMeetingRoom';
import VideoConferencePage from './src/screen/VideoConferencePage';
import ForgotPassword from './src/screen/ForgotPassword';
import ChangePassword from './src/screen/ChangePassword';
import ScheduleView from './src/components/ScheduleView';
import Assignment from './src/components/Assignment';
import Notification from './src/components/Notification';
import Role from './src/screen/Role';
import CreateSchedule from './src/screen/CreateSchedule'
import CreateNotification from './src/screen/CreateNotification'
import CreateAssignment from './src/screen/CreateAssignment'
import Profile from './src/screen/Profile'
import GetAttendence from './src/screen/GetAttendence'

// import Test from './src/screen/Test';
// import Test1 from './src/screen/Test1';

//For Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//createNativeStackNavigator Function Returns an Object containing 2 properties: Screen and Navigator
//Stack is an instance of createNativeStackNavigator function
const Stack = createNativeStackNavigator();
// import * as SplashScreen from 'expo-splash-screen';

console.reportErrorsAsExceptions = false;

export default function App() {

  // SplashScreen.preventAutoHideAsync();
  // setTimeout(SplashScreen.hideAsync, 2000);

  return (
    //NavigationContainer is a component which manages our navigation tree
    <View style={{ flex: 1, backgroundColor: '#1c1c1c', }}>
      < NavigationContainer >
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Varification" component={Varification} options={{ headerShown: false }} />
          <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="JoinMeetingRoom" component={JoinMeetingRoom} options={{ headerShown: false }} />
          <Stack.Screen name="VideoConferencePage" component={VideoConferencePage} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
          <Stack.Screen name="ScheduleView" component={ScheduleView} options={{ headerShown: false }} />
          <Stack.Screen name="Assignment" component={Assignment} options={{ headerShown: false }} />
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
          <Stack.Screen name="Role" component={Role} options={{ headerShown: false }} />
          <Stack.Screen name="CreateSchedule" component={CreateSchedule} options={{ headerShown: false }} />
          <Stack.Screen name="CreateNotification" component={CreateNotification} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="CreateAssignment" component={CreateAssignment} options={{ headerShown: false }} />
          <Stack.Screen name="GetAttendence" component={GetAttendence} options={{ headerShown: false }} />
          
          {/* 
          <Stack.Screen name="Test" component={Test} options={{ headerShown: false }} />
          <Stack.Screen name="Test1" component={Test1} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
      </NavigationContainer >
    </View>
  );
}
