import React, { Component } from 'react';
import {  
  View, Modal, Alert,
  Button, Image, 
  TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';

// var t = require('tcomb-form-native');
import t from 'tcomb-form-native';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import {AudioRecorder, } from 'react-native-audio';

import styles from '../styles/form.style';
import RecordHelper from '../Helper';


const Form = t.form.Form;



export default class ModalForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false, // show|hide modal form
      value: null, // form value
      record: false, // toggle switch flag
      pressed: false, // record button press flag
      playing: false, // playing recoreded sound
      aac: null, // the recorded file
      id: 0, // card id
    };
    this.saveFormData = this.saveFormData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.pressToRecord = this.pressToRecord.bind(this);
    this.finishRecord = this.finishRecord.bind(this);
    this.playingSound = this.playingSound.bind(this);
  }

  componentDidMount() {
    console.log('modal form mount...');
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  // called by app
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  // called by app
  popupForm(item) {
    this.setState({value:item, modalVisible: true});
  }
  popupFormWithPermission(item, permission) {
    this.clearFlag = 0;
    var tempAudioPath = this._prepareRecord();
    this.setState({
      id: item.id?item.id:new Date().getTime(),
      aac: item.aac?item.aac:null,
      value: item,
      modalVisible: true,
      permission: permission,
      tempAudioPath: tempAudioPath,
      record: false
    });
    this._prepareRecord();
  }

  _prepareRecord() {
    var tempAudioPath = RecordHelper.recordsDir() + '/tmp.aac';
    AudioRecorder.prepareRecordingAtPath(tempAudioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    })
    // FIXME, error in ios for this catch @2018/06/13
    // .catch(() => {
    //   console.error('prepare record path ERROR!');
    // });
    return tempAudioPath;
  }

  modalClosed() {
    console.log('modal closed!');
  }

  getAudioFilePath() {
    return RecordHelper.recordsDir() + '/' + this.state.id + '.aac';
  }

  saveFormData() {
    let value = this.refs.form.getValue();
    if(value){
      let newValue = {...value, id: this.state.id, aac: this.state.aac, record: false};
      this.props.onFormSaved(newValue); // callback
    }

    this.setState({modalVisible: false});
    // clear content from all textbox
    this.setState({ value: null, record: false });

  }

  onChange(value) {
    console.log(value);
    // var record = value.record;
    this.setState({value: value, record: value.record});
  }

  handleCanvas = (canvas) => {
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F0F0F0';
    ctx.arc(50, 50, 41, 0, Math.PI * 2, true);
    ctx.fill();

  }

  handleBottomCanvas = (canvas) => {
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = 8;
    ctx.strokeStyle = "#DDDDDD";
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, 2 * Math.PI);
    ctx.stroke();

    this.canvas = canvas;
  }

  pressToRecord() {
    if(!this.state.permission) return;

    this.setState({pressed: true});

    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 100, 100);
    
    this.arcTotal = 0;
    this.clearFlag = 0; // to improve drawing blink problem @2018/06/09
    this.drawingInterval = setInterval(()=>{
      this.arcTotal += Math.PI/50;
      
      if(this.clearFlag % 10 == 0) ctx.clearRect(0, 0, 100, 100); // clear the canvas
      
      ctx.strokeStyle = "#32CD32";
      ctx.beginPath();
      ctx.arc(50, 50, 45, 0-Math.PI/2, this.arcTotal-Math.PI/2);
      ctx.stroke();
      
      this.clearFlag += 1;

      // more than 10 seconds to stop automatically...
      if(this.arcTotal>2*Math.PI){
        this.finishRecord();
        this.arcTotal = 0;
        this.clearFlag = 0;
      }
      
    }, 100);

    //  recording sound...
    this._prepareRecord();
    this._record();
  }

  finishRecord() {
    this.setState({pressed: false});

    clearInterval(this.drawingInterval);
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 100, 100); // clear the canvas
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#DDDDDD";
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, 2 * Math.PI);
    ctx.stroke();

    // more than one second to create file...
    if(this.arcTotal > Math.PI/5) {
      // stop record!
     this._stop(()=>{
       // COPY temp file to permanent file
      RecordHelper.copyFile(this.state.tempAudioPath, this.getAudioFilePath());
      // SAVE to state!
      this.setState({aac: this.getAudioFilePath()});
     });
    }else{
      this._stop();
    }

  }
  

  playingSound() {
    if(this.state.playing) return;
    if(!this.state.aac) return this._showAlert('提醒', '当前卡片没有录音');
    
    this.setState({playing: true});
    // TODO, if end of soud revert the playing to false...
    // setTimeout(()=> this.setState({playing: false}), 3000);
    if(this.state.aac) this._play(()=> this.setState({playing: false}));
  }

  _showAlert(title, content) {
    Alert.alert(
      title,
      content,
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '好的', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    )
  }
  
  // ---------------- core function -------------------------
  async _record() {
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  async _stop(callback) {
    try {
      const filePath = await AudioRecorder.stopRecording();
      // console.warn(`record file: ${filePath}`);
      if(callback) callback();
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play(callback) {
    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.state.aac, '', (error) => {
        if (error) {
          console.error('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          callback();
        });
      }, 100);
    }, 100);
  }
// ----------------- end of core function ----------------


  render() {
    // here we are: define your domain model
    var Card = t.struct({
      big: t.String,              // a required string
      title: t.maybe(t.String),  // an optional string
      subtitle: t.maybe(t.String),  // an optional string
      record: t.Boolean,               // a required number
    });
    var options = {
      fields: {
        big: {
          label: '词汇', // <= label for the name field
          placeholder: '填写你要记忆的词汇'
        },
        title: {
          label: '解释',
          placeholder: '填写对该词汇的解释'
        },
        subtitle: {
          label: '举例',
          placeholder: '对该词汇造句或者相关词汇'
        },
        record: {
          label: '添加录音'
        }
      }
    }; // optional rendering options (see documentation)

    const micimg = this.state.pressed?
      (<Image source={require('../static/microphone_e.png')} style={styles.floatImg}/>):
      (<Image source={require('../static/microphone_d.png')} style={styles.floatImg}/>);

    const playicon = this.state.playing?
      (<Icon name="volume-up" size={30} color="#666" />):
      (<Icon name="play-circle" size={30} color="#666" />);

    const recordView = this.state.record ? (
      <View style={styles.fullWidthRow}>
        <View style={styles.oneThirdColumn}></View>
        <View style={styles.oneThirdColumn}>
          <View style={styles.centerChild}>
            <TouchableWithoutFeedback style={styles.floatCanvas}>
              <Canvas ref={this.handleBottomCanvas} />
            </TouchableWithoutFeedback>
            <TouchableOpacity style={styles.cnvsWrapper} 
              onPressIn={this.pressToRecord}
              onPressOut={this.finishRecord}>
              <Canvas ref={this.handleCanvas}/>
              {micimg}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.oneThirdColumn}>
          <TouchableOpacity onPress={this.playingSound}>
            {playicon}
          </TouchableOpacity>
        </View>
      </View>
    ) : false;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={this.modalClosed}
        >
        <View style={styles.container}>
          <Form
            ref="form"
            type={Card}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />

          {recordView}
          
          <View style={styles.btnBackground}>
            <Button
              onPress={this.saveFormData}
              title="保 存"
              color="#FFFFFF"
            />
          </View>
          <View style={styles.btnBackgroundGray}>
            <Button
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
              title="取 消"
            />
          </View>
        </View>
      </Modal>
    );

  }
}
