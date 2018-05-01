import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

export default StyleSheet.create({
    container: {
        flex: 1, // full screen
        // justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F5FCFF',
        // paddingVertical: 30
    },
    welcome: {
        fontSize: 24,
        textAlign: 'center',
        margin: 30,
        fontFamily: 'SentyMARUKO',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 20,
        fontSize: 80
    },
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
// --------------------------    
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    carouselContainer: {
        paddingVertical: 30,
        flex: 1
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        flexWrap: 'wrap',
        // paddingVertical: 0,
        width: '100%',
        flex: 1
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginVertical: 8,
        // marginHorizontal: 8
    }
});
