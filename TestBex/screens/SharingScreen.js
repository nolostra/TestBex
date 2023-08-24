import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Linking, PermissionsAndroid ,DeviceInfo} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import RNPermissions, { PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import files from './data'
export default function SharingScreen() {
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
      
      setFileUri(res.uri);
      console.log(fileUri)
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };


  const getImageBase64 = async (filePath) => {
    try {
      // const fileUri = decodeURIComponent(filePath);
      // console.log('fileUri',fileUri)
      const response = await RNFetchBlob.fs.readFile(filePath, 'base64');
      console.log("+11",response)
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
    console.log("key1",fileUri)
    let resp = await getImageBase64(fileUri)
    console.log("key",'data:image/png;base64,'+resp.slice(0,20))
    const shareOptions = {
      url: 'data:image/png;base64,'+resp,
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
