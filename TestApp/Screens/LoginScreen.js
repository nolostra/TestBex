import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import * as Keychain from 'react-native-keychain';
import * as LocalAuthentication from 'expo-local-authentication';
const rnBiometrics = new ReactNativeBiometrics()
// import PinView from 'react-native-pin-view';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputPin, setInputPin] = useState('');

  const handleLogin = async () => {
      const biometryType = await rnBiometrics.isSensorAvailable()
      console.log("b--",BiometryTypes.Biometrics )
      console.log("b--",biometryType.biometryType )
      const credentials = await Keychain.getGenericPassword();
    //  console.log( await LocalAuthentication)
      console.log("creds", credentials)
      if (biometryType.biometryType === BiometryTypes.Biometrics) {
        console.log("b--1", )
       await rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then((resultObject) => {
          const { success } = resultObject
      
          if (success) {
            navigation.navigate('Sharing');
          } else {
            console.log('user cancelled biometric prompt')
          }
        })
        .catch(() => {
          console.log('biometrics failed')
        })
        
      } else if (inputPin === credentials.password) {
          navigation.navigate('Sharing');
        }else if (username === 'admin' && password === 'admin') {
          navigation.navigate('Sharing');
        }



      
    
  };

  return (
    <View style={{backgroundColor:'grey'}}>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      {/* <PinView onComplete={(value) => setPin(value)} /> */}
      <TextInput
              placeholder="Enter PIN"
              value={inputPin}
              onChangeText={setInputPin}
              secureTextEntry
            />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}