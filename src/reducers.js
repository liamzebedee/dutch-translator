import { combineReducers } from 'redux';

const initialState = {
    processedText: {},
    wordFilters: [],
}

function processedText(state = {
    text: "",
    words: null,
    expandAllToggle: true,
}, action) {
    switch(action.type) {
        case 'RECEIVE_PROCESSED_TEXT':
            return Object.assign({}, state, {
                text: action.text,
                words: action.words.map((word) => {
                    let els = word;
                    let typ = els[3].split('(')[0];
                    let pronounciation = els[2];
                    let infinitive = typ == 'WW' ? els[1] : '';

                    return {
                        word: word[0],
                        els,
                        typ,
                        pronounciation,
                        infinitive,

                        expanded: false,
                        translations: null
                    }
                })
            })
        case 'TOGGLE_EXPAND_WORD':
            return Object.assign({}, state, {
                words: state.words.map((word, i) => {
                    if(i === action.idx) 
                        word.expanded = !word.expanded;
                    return word;
                })
            })
        case 'TOGGLE_EXPAND_ALL':
            let expandAllToggle = state.expandAllToggle;
            return Object.assign({}, state, {
                expandAllToggle: !expandAllToggle,
                words: state.words.map((word, i) => {
                    word.expanded = expandAllToggle;
                    return word;
                })
            })
        case 'LOADED_TRANSLATION_FOR_WORD':
            return Object.assign({}, state, {
                words: state.words.map((word, i) => {
                    if(i === action.idx) 
                        word.translations = action.translations
                    return word;
                })
            })
        default:
            return state
    }
}

export const FILTERS = {
    'verbs': {
        shown: false,
        typs: ['WW', 'BW']
    },
    'adjectives': {
        shown: false,
        typs: ['ADJ']
    },
    'nouns': {
        shown: false,
        typs: ['N', 'SPEC']
    },
    'prepositions': {
        shown: false,
        typs: 'VZ TSW TW VG'.split(' ')
    },
    'pronouns': {
        shown: false,
        typs: ['VNW'],
    }
}

function wordFilters(state = FILTERS, action) {
    switch(action.type) {
        case 'TOGGLE_WORD_FILTER':
            let filter = state[action.filterName];

            return Object.assign({}, state, {
                [action.filterName]: Object.assign({}, filter, {
                    shown: !filter.shown
                })
            })
        default:
            return state
    }
}

export default combineReducers({
    processedText,
    wordFilters,
})

