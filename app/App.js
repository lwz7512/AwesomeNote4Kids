/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @2018/04/22
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles, { colors } from './styles/index.style';
import entrystyles, { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import SliderEntry from './components/SliderEntry';
import ModalForm from './components/ModalForm';
import FooterInput from './components/FooterInput';


const titleForCard    = '解释有时是多余的';
const subtitleForCard = '举个栗子或许更好，戳一下就能修改';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: 0,
      entries: []
    };
    // change context pass current to function
    this.addCardFor = this.addCardFor.bind(this);
    this._renderIMGCard = this._renderIMGCard.bind(this);
    this._slidePressed = this._slidePressed.bind(this);
  }

  componentDidMount() {
    let entries = ENTRIES1;
    entries.forEach(item => {
      item.title = titleForCard,
      item.subtitle = subtitleForCard
    });
    this.setState({entries: entries});
  }
  
  _renderItem ({item, index}) {
    return (
      <View style={entrystyles.slideInnerContainer}>
      <Text style={entrystyles.title}>{ item.title }</Text>
      </View>
    );
  }
  
  _slidePressed () {
    let currentEntry = this.state.entries[this.state.slider1ActiveSlide];
    // this._modalRef.setModalVisible(true);
    this._modalRef.popupForm(currentEntry);
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
    // let big = this.state.text;
    let maxSize = 36;
    // alert(`You've input: '${text}'`);

    let origEntries = this.state.entries;
    let mrgeEntries = [...ENTRIES1, ...ENTRIES2];
    let randomImg = mrgeEntries[Math.floor(Math.random()*mrgeEntries.length)].illustration;
    let merged = [{
        title: titleForCard,
        subtitle: subtitleForCard,
        illustration: randomImg,
        big: big
    }, ...origEntries];

    // reset all the list
    this.setState({entries: merged.length>maxSize?merged.slice(0,maxSize):merged});
    // reset active index
    this.setState({slider1ActiveSlide: 0});
    // move to first
    this._slider1Ref.snapToItem(0);
  }

  // click card -> fill form -> save to carousel
  saveCardFor (item) {
    // console.log(item);
    let origEntries = this.state.entries;
    let currentEntry = origEntries[this.state.slider1ActiveSlide];
    // merge
    currentEntry = Object.assign(currentEntry, item);
    // update current entry
    origEntries[this.state.slider1ActiveSlide] = currentEntry;
    this.setState({entries: origEntries});
  }

  render() {
    return (
      <View style={styles.container}>
      
        <Text style={styles.welcome}>
          Note for Kids!
        </Text>

        <View style={styles.carouselContainer}>
          <Carousel
            ref={c => this._slider1Ref = c}
            data={this.state.entries}
            renderItem={this._renderIMGCard}
            // renderItem={this._renderItemWithParallax}
            firstItem={0}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
          />
          <Pagination
            dotsLength={this.state.entries.length}
            activeDotIndex={this.state.slider1ActiveSlide}
            containerStyle={styles.paginationContainer}
            dotColor={'rgba(55, 155, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={colors.black}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.6}
            carouselRef={this._carousel}
            tappableDots={!!this._carousel}
          />
        </View>
        
        <FooterInput
          addTextHandler={(big) => {this.addCardFor(big)}}
        />
        {/* how to dynamic create? */}
        <ModalForm 
          ref={c => this._modalRef = c}
          onFormSaved={(item) => this.saveCardFor(item)}
        />

      </View>
    );
  }
}
