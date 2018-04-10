import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import { FILTERS } from '../reducers';




var colour = scaleOrdinal(schemeCategory10);
const types = 'ADJ BW LET LID N SPEC TSW TW VG VNW VZ WW'.split(' ')
const descs = 'Adjective Adverb Punctuation Determiner Noun Names-and-unknown Interjection Numerator Conjunction Pronoun Preposition Verb'.split(' ')


export function typeToColour(type) {
    return colour(types.indexOf(type))
}

export function typeToName(type) {
    let i = types.indexOf(type)
    return descs[i];
}




let code2col = {};

let filterClasses = Object.keys(FILTERS);
filterClasses.map((klass, i) => {
    FILTERS[klass].typs.map(typ => {
        code2col[typ] = colour(i);
    })
})

export function typeCodeToColour(code) {
    return code2col[code]
}

export function getFilterColour(i) {
    return colour(i)
}

