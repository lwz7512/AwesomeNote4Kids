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
  TextInput,
  StatusBar,
  Button
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import styles, { colors } from './styles/index.style';
import entrystyles, { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import SliderEntry from './components/SliderEntry';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      text: 'Welcome!', 
      entries: ENTRIES1,
      slider1ActiveSlide: 0
    };
    // change context pass current to function
    this.onPressAdd = this.onPressAdd.bind(this);
  }

  _renderItem ({item, index}) {
    return (
        <View style={entrystyles.slideInnerContainer}>
            <Text style={entrystyles.title}>{ item.title }</Text>
        </View>
    );
  }

  _renderIMGCard ({item, index}) {
      return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
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

  onPressAdd () {
    let big = this.state.text;
    // alert(`You've input: '${text}'`);

    let origEntries = this.state.entries;
    let mrgeEntries = [...ENTRIES1, ...ENTRIES2];
    let randomImg = mrgeEntries[Math.floor(Math.random()*mrgeEntries.length)].illustration;
    // reset all the list
    this.setState({entries: [{
        title: 'Favourites landscapes 1',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: randomImg,
        big: big
    }, ...origEntries]});
    // reset active index
    this.setState({slider1ActiveSlide: 0});
    // move to first
    this._slider1Ref.snapToItem(0);
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
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({text})}
            placeholder='Input here'
          />
          <View style={styles.btnContainer}>
            <Button
              onPress={this.onPressAdd}
              title="Add"
              color="#FFF"
            />
          </View>
          
        </View>
        
      </View>
    );
  }
}
