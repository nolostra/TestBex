import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Linking, PermissionsAndroid ,DeviceInfo} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import RNPermissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import files from './data'
export default function SharingScreen() {
  const [typeFile,setTypeFile] = useState('')
  const [fileName, setFileName ] = useState('')
  const [fileUri, setFileUri] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const requestExternalStoragePermission = async () => {
      try {
        const granted = await RNPermissions.request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
         
        )
        console.log("inside of useEffect")
        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        //   {
        //     title: 'External Storage Permission',
        //     message: 'This app needs access to your external storage to convert the file to base64.',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        //   }
        // );
       
        if (granted == RESULTS.GRANTED) {
          console.log('Permission ',granted)
        } else {
          console.log('Permission denied.',granted);
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    checkFilePermissions();
    requestExternalStoragePermission();
  }, []);

  const checkFilePermissions = async () => {
   
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    console.log("11",granted)
    if (!granted) {
      console.log("not granted")
    
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save files.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      console.log("asked for permissions", granted1)
    }
  };
  
  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log("file",res)
      setFileName(res.name)
      setTypeFile(res.type)
      setFileUri(res.uri);
      console.log(fileUri)
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };


  const getImageBase64 = async (filePath) => {
    try {
      const response = await RNFetchBlob.fs.readFile(filePath, 'base64');
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
    let resp = await getImageBase64(fileUri)
    const shareOptions = {
      url: 'data:'+typeFile+';base64,'+resp,
      message: message,
      type: typeFile, // Specify the correct MIME type here
    };
   
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
    <View style={{ backgroundColor: '#121212', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, marginBottom: 20, color: '#f0f0f0', padding:30 , backgroundColor: fileName ? '#1e1e1e' : '#121212' ,borderRadius: 10, marginHorizontal:20 }}>{fileName ? `Selected File: ${fileName}` : ''}</Text>
    <Button title="Select File" onPress={handleFilePicker} color="#007AFF" />
    <TextInput
      style={{ borderRadius: 10, marginVertical: 20, padding: 15, width: '80%', backgroundColor: '#1e1e1e', fontSize: 16, color: '#f0f0f0' }}
      placeholder="Message"
      placeholderTextColor="#888"
      onChangeText={setMessage}
      value={message}
    />
    <Button title="SHARE" onPress={handleShare} color="#007AFF" />
  </View>

  );
}
