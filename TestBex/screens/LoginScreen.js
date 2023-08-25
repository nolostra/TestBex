import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import * as Keychain from 'react-native-keychain';
// import * as LocalAuthentication from 'expo-local-authentication';
// import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics()
// import PinView from 'react-native-pin-view';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputPin, setInputPin] = useState('');

  const handleLogin = async () => {
      const biometryType = await rnBiometrics.isSensorAvailable()
      const credentials = await Keychain.getGenericPassword();
      console.log("b--",BiometryTypes.Biometrics )
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
        
      } else
       if (credentials) {
          navigation.navigate('pinlock');
        }else if (username === 'admin' && password === 'admin') {
          navigation.navigate('Sharing');
        }



      
    
  };

  return ( 
    <View style={{ backgroundColor: '#121212', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ backgroundColor: '#1e1e1e', borderRadius: 10, padding: 20, width: '80%' }}>
      <TextInput style={{ borderRadius: 10, marginBottom: 20, textAlign: 'center', padding: 15, backgroundColor: '#333', color: '#f0f0f0', fontSize: 16 }} placeholder="Username" placeholderTextColor="#999" onChangeText={setUsername} />
      <TextInput style={{ borderRadius: 10, marginBottom: 20, textAlign: 'center', padding: 15, backgroundColor: '#333', color: '#f0f0f0', fontSize: 16 }} placeholder="Password" placeholderTextColor="#999" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} color="#007AFF" />
    </View>
  </View>
  );
}
