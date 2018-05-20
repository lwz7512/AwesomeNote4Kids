import { applyMiddleware, combineReducers, createStore } from 'redux';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { ENTRIES1, ENTRIES2 } from './static/entries';

const maxSize = 36;
const titleForCard    = '有时是多余的';
const subtitleForCard = '举个栗子或许更好，戳一下就能修改';

const persistConfig = {
    key: 'note',
    storage,
}

const types = {
  ADD_ITEM: 'ADD',
  UPDATE_ITEM: 'UPDATE',
  SWITCH_ITEM: 'SWITCH',
  REMOVE_ITEM: 'REMOVE',
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
    return {type: types.ADD_ITEM, payload: big}
  },
  update: (item) => {
    return {type: types.UPDATE_ITEM, payload: item}
  },
  switch: (index) => {
    return {type: types.SWITCH_ITEM, payload: index}
  },
  remove: (index) => {
    return {type: types.REMOVE_ITEM, payload: index}
  }
}

const hander_ADD = (state, action) => {
  const {notes, index} = state;
  const {type, payload} = action; // from actionCreators

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
}

const hander_UPDATE = (state, action) => {
  const {notes, index} = state;
  const {type, payload} = action; // from actionCreators

  let currentNote = notes[index];
  // merge
  notes[index] = Object.assign(currentNote, payload);
  return {
    notes: [...notes], // return new notes
    index: index
  }
}

const hander_SWITCH = (state, action) => {
  const {notes, index} = state;
  const {type, payload} = action; // from actionCreators

  return {
    notes: notes,
    index: payload // new position
  }
}

const hander_REMOVE = (state, action) => {
  const {notes, index} = state;
  const {type, payload} = action; // from actionCreators

  return {
    notes: notes.filter((note, i) => i !== payload),
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
  let at = action.type;
  let handlers = {
    [types.ADD_ITEM]:    hander_ADD,
    [types.UPDATE_ITEM]: hander_UPDATE,
    [types.SWITCH_ITEM]: hander_SWITCH,
    [types.REMOVE_ITEM]: hander_REMOVE
  };

  if(handlers[at]) return handlers[at](state, action);

  return state;
};


// store.js
// with persistence support
export default function configureStore() {

    const persistedReducer = persistReducer(persistConfig, _reducer)
    
    const store = createStore(persistedReducer);
    let persistor = persistStore(store)
    
    return { store, persistor }
}
