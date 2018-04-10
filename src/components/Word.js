import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';


import { 
    typeCodeToColour,
    typeToColour,
    typeToName,
} from './colours'

import _ from 'underscore';

function colorWordForFilter(filters, typ) {
    let enabledTyps = 
        _.values(filters)
        .filter(filter => filter.shown)
        .reduce((acc, filter) => acc.concat(filter.typs), [])
    if(!_.contains(enabledTyps, typ)) return null;

    let colour = typeCodeToColour(typ)
    return {
        backgroundColor: colour,
        color: "white"
    }
}

const Word = ({ filters, word, typ, els, pronounciation, expanded, onClick, translations, infinitive }) => {
    return <CSSTransition
            in={expanded}
            timeout={250}
            classNames="viagra"
            >
            <div className={classNames({ 
                    wordCtn: true, 
                    expanded 
                })}>
        
            <div 
                className={classNames({ 
                    word: true, 
                    expanded,
                })}
                onClick={onClick} 
                style={{ 
                    ...colorWordForFilter(filters, typ),
                }}>
                {word}
            </div>

            
            <Details {...{ translations, typ, els, pronounciation, infinitive }}/>

    </div></CSSTransition>
}

const Details = ({ translations, typ, els, pronounciation, infinitive }) => {
    let isVerb = infinitive != null;

    let translation = translations ? _.first(translations, 3).join(', ') : <Spinner/>;

    return <div className='details'>
        {(() => {
            if(isVerb) {
                return <span>
                    {infinitive} ({translation})
                </span>
            }
            return <span>
                {translation} <span style={{ backgroundColor: typeToColour(typ), color: 'white' }}>{typeToName(typ)}</span>
            </span>
        })()}
    </div>
}

import SpinnerIcon from 'svg-react-loader?name=Spinner!../spinner.svg';

const Spinner = () => {
    return <span className="spinner"><SpinnerIcon/></span>;
}

const mapStateToProps = state => {
    return {
        filters: state.wordFilters
    }
}

export default connect(
    mapStateToProps,
    null,
)(Word)