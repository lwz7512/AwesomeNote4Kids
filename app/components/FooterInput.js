import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput,
  StatusBar,
  Button,
} from 'react-native';

const styles = StyleSheet.create({
    inputRow: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#F5F5F5'
    },
    input: {
        width: '80%', height: 40, 
        // borderColor: 'gray', borderWidth: 1,
        backgroundColor: '#FFFFFF',
        paddingLeft: 10
    },
    btnContainer: {
        flex: 1,
        backgroundColor: '#666666',
        justifyContent: 'center'
    },
})

export default class FooterInput extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '', 
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { addTextHandler } = this.props;
    const {text} = this.state;

    if (!text) return;

    addTextHandler(text);
    this.setState({text: ''})
  }

  render() {

    return (
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={this.state.text}
          onChangeText={(text) => this.setState({text})}
          placeholder='这里写...'
        />
        <View style={styles.btnContainer}>
          <Button
            // onPress={this.onPressAdd}
            onPress={this.onSubmit}
            title="添加"
            color="#FFF"
          />
        </View>
      </View>
    );
  }
}
