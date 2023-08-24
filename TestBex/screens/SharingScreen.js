import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
// import { Share } from 'react-native';
import Share from 'react-native-share';
import  DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
export default function SharingScreen() {
  const [fileUri, setFileUri] = useState('');
  const [message, setMessage] = useState('');


  const handleFilePicker = async () => {
    try {
      const results = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        //There can me more options as well find above
      });
      
      console.log(results)
      setFileUri(results);
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };

  const handleShare = async () => {
    if (!fileUri) {
      console.log('No file selected.');
      return;
    }
  
    const shareOptions = {
      title: 'Share File and Message',
      url: fileUri.uri,
      message: message,
    };
  
    if (Platform.OS === 'android' && fileUri.uri.startsWith('content://')) {
      // On Android, handle content URIs
      shareOptions.url = '';
      shareOptions.type = fileUri.type; // You might need to provide the correct MIME type
      shareOptions.url = fileUri.uri;
    }
    
    console.log(shareOptions)
    try {
      const result = await Share.open(shareOptions);
      if (result.action === Share.sharedAction) {
        console.log('File and message shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Sharing dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={{backgroundColor:'grey'}}>
      <Button title="Select File" onPress={handleFilePicker} />
      {/* <Text>Selected File: {fileUri[0].name}</Text> */}
      <TextInput placeholder="Message" onChangeText={setMessage} />
      <Button title="SHARE" onPress={handleShare} />
    </View>
  );
}
