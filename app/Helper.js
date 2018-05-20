
import {PermissionsAndroid, Platform} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

// var RNFS = require('react-native-fs');
import RNFS from 'react-native-fs';

/**
 * audio settings:
 * 1. define records path
 * 2. check permission for android
 * 
 * @2018/05/18
 */
export default class Helper {


  
  static recordsDir() {
    return AudioUtils.DocumentDirectoryPath + '/nfk';
  }

  static setup() {
    return Promise.all([
      RNFS.exists(this.recordsDir()),
      RNFS.mkdir(this.recordsDir()),
      this._checkPermission()
    ]);
  }

  static _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'AudioExample needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  static copyFile(source, dest) {
    return RNFS.copyFile(source, dest);
  }


}