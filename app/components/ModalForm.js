import React, { Component } from 'react';
import {  
  View, Text, Modal, 
  TouchableHighlight, StyleSheet, Button 
} from 'react-native';

// var t = require('tcomb-form-native');
import t from 'tcomb-form-native';

const Form = t.form.Form;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 22
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  btnBackground: {
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  btnBackgroundGray: {
    backgroundColor: '#F0F0F0',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  }
});


export default class ModalForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      value: null
    };
    this.saveFormData = this.saveFormData.bind(this);
  }

  componentDidMount() {
    // console.log(t);
  }

  componentDidUpdate() {
    // console.log(this.state);
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

  saveFormData() {
    var value = this.refs.form.getValue();
    // if (value) console.log(value);
    if(value) this.props.onFormSaved(value);

    this.setState({modalVisible: false});
    // clear content from all textbox
    this.setState({ value: null });
  }

  render() {
    // here we are: define your domain model
    var Card = t.struct({
      big: t.String,              // a required string
      title: t.maybe(t.String),  // an optional string
      subtitle: t.maybe(t.String),  // an optional string
      // age: t.Number,               // a required number
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
        }
      }
    }; // optional rendering options (see documentation)

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
          />
          
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
