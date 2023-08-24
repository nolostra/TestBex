// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SharingScreen from './screens/SharingScreen';
import PinLockScreen from './screens/pinLock';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sharing" component={SharingScreen} />
        <Stack.Screen name="pinlock" component={PinLockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
