import { applyMiddleware, combineReducers, createStore } from 'redux';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { ENTRIES1, ENTRIES2 } from './static/entries';

const titleForCard    = '解释有时是多余的';
const subtitleForCard = '举个栗子或许更好，戳一下就能修改';

const persistConfig = {
    key: 'note',
    storage,
}

// Initial state of the store
const initialState = () => {
  let entries = ENTRIES1;
  entries.forEach(item => {
    item.title = titleForCard,
    item.subtitle = subtitleForCard
  });
        
  return {
    notes: entries,
    index: 0
  };
}
  
// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
    add: (big) => {
      return {type: 'ADD', payload: big}
    },
    update: (item) => {
      return {type: 'UPDATE', payload: item}
    },
    switch: (index) => {
      return {type: 'SWITCH', payload: index}
    },
    remove: (index) => {
      return {type: 'REMOVE', payload: index}
    }
}
  
// reducers.js, produce new state based on action
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
const _reducer = (state = initialState(), action) => {
    // console.log(state);

    const {notes, index} = state;
    const {type, payload} = action; // from actionCreators
    const maxSize = 36;

    switch (action.type) {
        case 'ADD':
        
        let mrgeEntries = [...ENTRIES1, ...ENTRIES2];
        let randomImg = mrgeEntries[Math.floor(Math.random()*mrgeEntries.length)].illustration;
        let merged = [{
          big: payload, // add a new word
          title: titleForCard,
          subtitle: subtitleForCard,
          illustration: randomImg,
        }, ...notes];

        // reset all the list
        let limitedNotes = merged.length>maxSize?merged.slice(0,maxSize):merged;
        
        return {
          notes: limitedNotes,
          index: 0
        }

        case 'UPDATE':
        let currentNote = notes[index];
        // merge
        notes[index] = Object.assign(currentNote, payload);
        return {
          notes: [...notes], // return new notes
          index: index
        }

        case 'SWITCH':
        return {
          notes: notes,
          index: payload // new position
        }

        case 'REMOVE':
        return {
          notes: notes.filter((note, i) => i !== payload),
        }

        default:
        // return default value while app start
        return state;
    }
};


// store.js
// with persistence support
export default function configureStore() {

    const persistedReducer = persistReducer(persistConfig, _reducer)
    
    const store = createStore(persistedReducer);
    let persistor = persistStore(store)
    
    return { store, persistor }
}
