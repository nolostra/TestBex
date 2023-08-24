// PinLockScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

const PinLockScreen = () => {
  const [pin, setPin] = useState('');
  const navigation = useNavigation();

  const checkPin = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password === pin) {
        navigation.navigate('Sharing');
      } else {
        alert('Invalid PIN');
      }
    } catch (error) {
      console.error('PIN authentication error:', error);
    }
  };

  return (
    <View>
      <Text>Enter your PIN:</Text>
      <TextInput
        secureTextEntry
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
      />
      <TouchableOpacity onPress={checkPin}>
        <Text>Unlock with PIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PinLockScreen;
