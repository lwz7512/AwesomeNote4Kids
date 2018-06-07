import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 22
  },
  title: {
    fontSize: 30,
    // alignSelf: 'center',
    // marginBottom: 30
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
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10
  },
  btnBackgroundGray: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 10,
  },
  fullWidthRow: {
    // backgroundColor: '#D5E4F3',
    height: 100,
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  oneThirdColumn: {
    flex: 1,
    // borderColor: '#CCCCCC',
    // borderWidth: 1
  },
  centerChild: { // this size definition is a must to center
    // backgroundColor: '#D5E4F3',
    width: 100,
    height: 100,
  },
  cnvsWrapper: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  floatImg: {
    position: 'absolute',
    top: 20,
    left:20,
    width: 60,
    height:60,
  },
  floatCanvas: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  }

});