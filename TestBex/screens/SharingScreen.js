import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Linking, PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import files from './data'
export default function SharingScreen() {
  const [fileUri, setFileUri] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const requestExternalStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Permission',
            message: 'This app needs access to your external storage to convert the file to base64.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          convertToBase64();
        } else {
          console.log('Permission denied.');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    requestExternalStoragePermission();
  }, []);
  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      
      setFileUri(res.uri);
      console.log(fileUri)
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };


  const getImageBase64 = async (filePath) => {
    try {
      const fileUri = decodeURIComponent(filePath);
      console.log('fileUri',fileUri)
      const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
      console.log(response)
      return response;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  };
  const handleShare = async () => {
    if (!fileUri) {
      console.log('No file selected.');
      return;
    }
    console.log(fileUri)
    await getImageBase64("content://com.android.externalstorage.documents/document/primary%3ADCIM%2FCamera%2FIMG20220831155416.jpg")
    
    const shareOptions = {
      url: files.image1,
      message: message,
      // type: 'image/jpg', // Specify the correct MIME type here
    };
   
    try {
      console.log("1")
      // Linking.openURL(fileUri)
      const result = await Share.open(shareOptions);
      console.log(JSON.stringify(result))
      // const result = await Share.share({
      //   message:
      //     message,
      //   title: "Data Transfer"
      // })
      console.log("2")
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
    <View style={{ backgroundColor: 'grey', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{fileUri ? `${fileUri}`:''}</Text> 
      <Button title="Select File" onPress={handleFilePicker} />
      <TextInput placeholder="Message" onChangeText={setMessage} />
      <Button title="SHARE" onPress={handleShare} />
    </View>
  );
}
