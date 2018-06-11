import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';


const styles = StyleSheet.create({
    playingBtn: {
    alignItems: 'center',
    // backgroundColor: '#FF0000'
  },
  soundbtn: {
    width: 40,
    height:40,    
  }

});

class PlayingBtn extends Component {

  static propTypes = {
    source: PropTypes.string
  };

  constructor(props){
    super(props);

    this.state = {
      playing: false, // playing recoreded sound
      aac: null // record file
    };
    this.playingSound = this.playingSound.bind(this);
  }


  playingSound() {
    const {source} = this.props;
    console.log('playing....'+source);

    if(!source) return;
    
    this.setState({playing: true, aac: source});

    this._play(()=> this.setState({playing: false}));
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

  render() {
    const {source} = this.props;
    // console.log(source);

    const playicon = this.state.playing?
      (<Icon name="volume-up" size={30} color="#666" />):
      (<Icon name="play-circle" size={30} color="#666" />);


    return (
      <View style={styles.playingBtn}>
        <TouchableOpacity onPress={this.playingSound} style={styles.soundbtn}>
          {source? playicon: false}
        </TouchableOpacity>
      </View>
    );
  }
}

export default PlayingBtn;
