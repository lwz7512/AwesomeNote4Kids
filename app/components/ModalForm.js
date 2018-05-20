import React, { Component } from 'react';
import {  
  View, Text, Modal, 
  TouchableHighlight, StyleSheet, Button, Image, 
  TouchableOpacity, TouchableWithoutFeedback,
  PermissionsAndroid, Platform,
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
    // console.log(this.state);
  }
  popupFormWithPermission(item, permission) {
    console.log(item);
    
    this.setState({
      id: item.id?item.id:new Date().getTime(),
      aac: value.aac?value.aac:null,
      value: item,
      modalVisible: true,
      permission: permission,
      tempAudioPath: RecordHelper.recordsDir() + '/tmp.aac'
    });
    
    AudioRecorder.prepareRecordingAtPath(this.state.tempAudioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  getAudioFilePath() {
    return RecordHelper.recordsDir() + '/' + this.state.id + '.aac';
  }

  saveFormData() {
    let value = this.refs.form.getValue();
    console.log(value);
    if(value){
      let newValue = {...value, id: this.state.id, aac: this.state.acc};
      this.props.onFormSaved(newValue); // callback
    }

    this.setState({modalVisible: false});
    // clear content from all textbox
    this.setState({ value: null });
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
    ctx.arc(50, 50, 40, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#DDDDDD";
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, 2 * Math.PI);
    ctx.stroke();
  }

  handleBottomCanvas = (canvas) => {
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = 8;
    ctx.strokeStyle = "#F0F0F0";
    ctx.beginPath();
    ctx.arc(50, 50, 45, 0, 2 * Math.PI);
    ctx.stroke();

    this.canvas = canvas;
  }

  pressToRecord() {
    if(!this.state.permission) return;

    this.setState({pressed: true});

    let ctx = this.canvas.getContext('2d');
    this.arcTotal = 0;
    this.drawingInterval = setInterval(()=>{
      // console.log('drawing...');
      this.arcTotal += Math.PI/50;

      ctx.clearRect(0, 0, 100, 100); // clear the canvas
      ctx.strokeStyle = "#007ACC";
      ctx.beginPath();
      ctx.arc(50, 50, 45, 0, this.arcTotal);
      ctx.stroke();

      // more than 10 seconds to stop automatically...
      if(this.arcTotal>2*Math.PI){
        this.finishRecord();
        console.warn('record finished!');
      }
      
    }, 100);

    //  recording sound...
    this._record();
  }

  finishRecord() {
    this.setState({pressed: false});

    clearInterval(this.drawingInterval);
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 100, 100); // clear the canvas
    
    // stop record!
    this._stop();

    // more than one second to create file...
    if(this.arcTotal > Math.PI/5) {
      // COPY temp file to permanent file
      RecordHelper.copyFile(this.state.tempAudioPath, this.getAudioFilePath());
      // SAVE to state!
      this.state({aac: this.getAudioFilePath()});
    }

    // this place the last...
    this.arcTotal = 0;
  }

  playingSound() {
    this.setState({playing: true});
    // TODO, if end of soud revert the playing to false...
    // setTimeout(()=> this.setState({playing: false}), 3000);
    if(this.state.aac) this._play();
    if(!this.state.aac) console.warn('NO aac file for this card!');
  }
  
  // ---------------- core function -------------------------
  async _record() {
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {

    try {
      const filePath = await AudioRecorder.stopRecording();
      console.warn(`record file: ${filePath}`);
      
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play() {
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
              color="#FFF"
            />
          </View>
          <View style={styles.btnBackgroundGray}>
            <Button
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
              title="取 消"
              color="#666"
            />
          </View>
        </View>
      </Modal>
    );

  }
}
