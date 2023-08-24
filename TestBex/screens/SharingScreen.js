import React, { useState } from 'react';
import { View, Text, TextInput, Button, } from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import RNFileShareIntent from 'react-native-file-share-intent';
// import { Share } from 'react-native';
import Share from 'react-native-share';
import  DocumentPicker from 'react-native-document-picker';

export default function SharingScreen() {
  const [fileUri, setFileUri] = useState('');
  const [message, setMessage] = useState('');
  const requestReadExternalStorage = async () => {
    try {
      const granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      const granted2 = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      console.log(granted,granted2)
      // if (
      //   granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
      //   granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      // ) {
      //   // The user has granted permissions, proceed with file picking and handling
      //   // Your existing code here
      // } else {
      //   // The user denied one or both permissions
      //   console.log('Permissions denied');
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilePicker = async () => {
    try {
      await  requestReadExternalStorage()
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      
      //output: content://com.android.providers.media.documents/document/image%3A4055
    
      RNFetchBlob.fs
        .stat(res.uri)
        .then(async (stats) => {
          console.log("stats",stats);
          console.log("file:/"+stats.path);
          let path ="file:"+stats.path
          console.log("path === ", path)
          setFileUri(path);
          // RNFetchBlob.fs.readFile(path,'base64') // You can specify other encoding types
          // .then((fileData) => {
          //   console.log(fileData);
          //   setFileUri(path); // Here you have the file content
          // })
          // .catch((readErr) => {
          //   console.log(readErr);
          // });

          const contents = await RNFS.readFile(fileUri, 'base64');
          console.log(contents)

          // setFileUri(stats.path);
     //output: /storage/emulated/0/WhatsApp/Media/WhatsApp Images/IMG-20200831-WA0019.jpg
        })
        .catch((err) => {
          console.log(res[0].uri);
          console.log(err);
        })
      
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
      url: fileUri,
      message: message,
    };
  
    if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
      // On Android, handle content URIs
      shareOptions.url = '';
      shareOptions.type = fileUri.type; // You might need to provide the correct MIME type
      shareOptions.url = fileUri;
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
