import {
    processText,
    toggleExpandWord,
    toggleWordFilter,
    loadTranslationForWord,
    expandAll
} from '../actions';
import React from 'react';
import {Helmet} from "react-helmet";


import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';

import FiltersView from './FiltersView'
import Word from './Word'

const Whatever = ({ children }) => <span>{children}</span>;



class App extends React.Component {
    updateDesc = (ev) => {
        let text = ev.target.value;
        this.props.processText(text)
    }

    renderAnnotation = () => {
        let annotation = [];
        let text = this.props.text;
        let words = this.props.words;
        
        let bufstart = 0;

        words.map((word, i) => {
            if(!/[a-zA-Z0-9]+/.test(word.word)) return null;

            let buf = text.substring(bufstart, text.length);
            let wordstart = buf.indexOf(word.word)

            let punctuationNShit = buf.substring(0, wordstart)

            annotation = annotation.concat([
                <Whatever key={i + punctuationNShit}>{punctuationNShit}</Whatever>,
                <Word key={i + word} onClick={() => this.props.toggleExpandWord(i, word)} {...word} />
            ])

            bufstart += wordstart + word.word.length;
        })
        
        let lastPunc = text.substring(bufstart, text.length);
        annotation = annotation.concat([
            <Whatever key={words.length+1 + lastPunc}>{lastPunc}</Whatever>,
        ])

        return annotation
    }

    render() {
        return <div>
            <Helmet>
                <meta charset="utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Helmet>
            
            <div className='container'>
                <header>
                    <h2>Hurdy-Gurdy (Dutch) Translate</h2>
                    <textarea className="form-control" onChange={this.updateDesc} rows="3" cols="120" placeholder="Type some Dutch..."></textarea>

                    <button type="button" className="translateAllBtn btn btn-secondary btn-sm" onClick={() => this.props.expandAllTheWords(this.props.words)}>
                        Translate all
                    </button>
                </header>

                <div className='controls'>
                    <FiltersView/>
                </div>
        
                <div className='words'>
                    <header>
                        <h3 className='translationTitle'>Translation</h3>
                        <small className="seeAllBtn" onClick={() => this.props.expandAllTheWords(this.props.words)}>
                            ({ this.props.expandAllToggle === true ? 'hide' : 'see' } all)
                        </small>
                    </header>
                    

                    { this.props.words 
                    ? this.renderAnnotation()
                    : null }
                </div>


                {/* { descs.map((typ, i) => <div style={{ 
                    backgroundColor: colour(i),
                    color: "white"}}>
                    {typ}
                </div>) } */}
            </div>
        </div>
    }
}



import { connect } from 'react-redux';
const mapStateToProps = state => {
    return {
        ...state.processedText,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        processText: text => dispatch(processText(text)),
        toggleExpandWord: (wordIdx, word) => {
            dispatch(toggleExpandWord(wordIdx))
            if(!word.translation)
                dispatch(loadTranslationForWord(wordIdx, word))
        },
        loadTranslationForWord: (i, word) => dispatch(loadTranslationForWord(i, word)),

        expandAllTheWords: (words) => {
            dispatch(expandAll())
            words.map((word, i) => {
                if(!word.translation) dispatch(loadTranslationForWord(i, word))
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

