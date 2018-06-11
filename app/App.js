/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @2018/04/22 started, 
 * @2018/05/04 complete first version,
 * @2018/05/05 add redux persist support.
 * 
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, Keyboard,
  Text, View, 
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles, { colors } from './styles/index.style';
import entrystyles, { sliderWidth, itemWidth } from './styles/SliderEntry.style';

import SliderEntry from './components/SliderEntry';
import ModalForm from './components/ModalForm';
import FooterInput from './components/FooterInput';
import PlayingBtn from './components/PlayingBtn';

// include connect for App
import { connect } from 'react-redux'
import { actionCreators } from './Redux'
import RecordHelper from './Helper';

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      miniMode: false // default show pagination dots and play button
    }
    
    // change context pass current to function
    this.addCardFor = this.addCardFor.bind(this);
    this._renderIMGCard = this._renderIMGCard.bind(this);
    this._slidePressed = this._slidePressed.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    RecordHelper.setup().then(results => {
      console.log(results);
      this.setState({permission: results[2]});// record the android permission
    });
  }
  
  _renderItem ({item, index}) {
    return (
      <View style={entrystyles.slideInnerContainer}>
      <Text style={entrystyles.title}>{ item.title }</Text>
      </View>
    );
  }
  
  _slidePressed () {
    const {notes, index} = this.props;
    // this._modalRef.popupForm(notes[index]);
    this._modalRef.popupFormWithPermission(notes[index], this.state.permission);
  }

  _renderIMGCard ({item, index}) {
    // console.log(this);
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} slidePressed={this._slidePressed}/>;
  }

  _renderItemWithParallax ({item, index}, parallaxProps) {
    return (
        <SliderEntry
          data={item}
          even={(index + 1) % 2 === 0}
          parallax={true}
          parallaxProps={parallaxProps}
        />
    );
  }

  addCardFor (big) {
    this.props.dispatch(actionCreators.add(big));
    // move to first
    this._slider1Ref.snapToItem(0);
  }

  // click card -> fill form -> save to carousel
  updateCardFor (item) {
    this.props.dispatch(actionCreators.update(item));
  }

  _keyboardDidShow () {
    this.setState({miniMode: true});
  }

  _keyboardDidHide () {
    this.setState({miniMode: false});
  }



  render() {
    // injected by redux
    const {notes, index} = this.props;
    const aac = notes[index].hasOwnProperty('aac')?notes[index].aac:null;

    return (
      <View style={styles.container}>
      
        {!this.state.miniMode?(<Text style={styles.welcome}>
          Note for Kids!
        </Text>):false}

        <View style={styles.carouselContainer}>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={notes}
            renderItem={this._renderIMGCard}
            firstItem={0}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            onSnapToItem={(index) => this.props.dispatch(actionCreators.switch(index)) }
          />

          {!this.state.miniMode?(<PlayingBtn source={aac}/>):false}

          {!this.state.miniMode?(<Pagination
            dotsLength={notes.length}
            activeDotIndex={index}
            containerStyle={styles.paginationContainer}
            dotColor={'rgba(55, 155, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={colors.black}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.6}
            carouselRef={this._carousel}
            tappableDots={!!this._carousel}
          />):false}
        </View>
        
        <FooterInput
          addTextHandler={(big) => {this.addCardFor(big)}}
        />
        {/* how to dynamic create? */}
        <ModalForm 
          ref={c => this._modalRef = c}
          onFormSaved={(item) => this.updateCardFor(item)}
        />

      </View>
    );
  }
}

// inject app state from redux
const mapStateToProps = (state, ownProps) => ({
  notes: state.notes,
  index: state.index
});

// Wrap App component with Connect component, 
// and create interaction channel(props) for it.
const AppContainer = connect(
  mapStateToProps
)(App);

export default AppContainer;