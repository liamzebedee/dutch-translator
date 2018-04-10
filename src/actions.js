import fetchJsonp from 'fetch-jsonp';
const Tag = require("en-pos").Tag;
const _ = require("underscore");

function receiveProcessedText(text, words) {
    return {
        type: 'RECEIVE_PROCESSED_TEXT',
        text,
        words,
    }
}

export function expandAll() {
    return {
        type: "TOGGLE_EXPAND_ALL",
    }
}

export function toggleExpandWord(idx) {
    return {
        type: "TOGGLE_EXPAND_WORD",
        idx,
    }
}

let en2nlCodeMapping = {};
// Dutch codes:
// 'ADJ BW LET LID N SPEC TSW TW VG VNW VZ WW'
// 'Adjective Adverb Punctuation Determiner Noun Names-and-unknown Interjection Numerator Conjunction Pronoun Preposition Verb'
`
ADJ = JJR JJS
BW = RBR RBS WRB
LID = DT PDT WDT
N = NNS NNP PRP PRP$ WP
SPEC = FW
TSW = UH
WW = VB VBP VBZ VBG VBD VBN MD RB RBR RBS
VZ = IN TO
VNW = PRP PRP$ WP
VG = CC
`.split('\n')
.filter(line => line != '')
.map(line => {
    let [dutchCode, enCodes] = line.split(' = ')
    enCodes.split(' ').map(code => {
        en2nlCodeMapping[code] = dutchCode
    })
})

export function loadTranslationForWord(idx, word) {
    return (dispatch) => {

        let lookup = word.word;
        if(word.typ == 'WW') {
            lookup = word.infinitive;
        }

        lookup = lookup.toLowerCase()

        fetchJsonp(`https://glosbe.com/gapi/translate?from=nl&dest=eng&format=json&phrase=${lookup}`)
        .then(res => res.json())
        .then(data => {
            if(data.result == 'ok') {
                let meanings = data.tuc
                .map((tuc, i) => {
                    let phrase = tuc.phrase;
                    let meaning = tuc.meaning;
                    if(phrase && phrase.language == 'en') return phrase.text;
                })
                .filter(Boolean)
                .splice(0, 7)

                // Do POS tagging on the English words to get better accuracy
                meanings = meanings
                .map(enWord => {
                    let tags = new Tag([enWord]).initial().tags;
                    let score = 0;

                    tags.map((enTag, i) => {
                        let nlcode = en2nlCodeMapping[enTag]
                        if(word.typ == nlcode) {
                            score++;
                        }
                    })

                    return {
                        word: enWord,
                        score,
                    }
                })

                meanings = _.sortBy(meanings, x => -x.score).map(x => x.word)
                
                return Promise.resolve(meanings)
            } else {
                return Promise.reject("no translation")
            }
        })
        .then((translations) => {
            if(translations.length < 1) return;

            dispatch({
                type: "LOADED_TRANSLATION_FOR_WORD",
                idx,
                translations,
            })
        })
    }
}

export function processText(text) {
    return (dispatch) => {
        fetch('/backend', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
            })
        })
        .then(res => res.json())
        .then(data => {
            dispatch(receiveProcessedText(text, data.filter(word => word[0] != null)))
        })
    }
}

export function toggleWordFilter(filterName) {
    return {
        type: "TOGGLE_WORD_FILTER",
        filterName,
    }
}
