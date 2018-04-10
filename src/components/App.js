import {
    processText,
    toggleExpandWord,
    toggleWordFilter,
    loadTranslationForWord,
    expandAll
} from '../actions';
import React from 'react';

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
            <div className='container'>


                <textarea className="form-control" onChange={this.updateDesc} rows="3" cols="120" placeholder="Type some Dutch..."></textarea>

                <br/>

                <FiltersView/>

                <button type="button" style={{ marginTop: '0.5em' }} className="btn btn-secondary btn-sm" onClick={() => {
                    this.props.expandAll()
                    this.props.words.map((word, i) => {
                        if(!word.translation) this.props.loadTranslationForWord(i, word)
                    })
                }}>
                    Translate all
                </button>


                    

                <br/>
        
                <div className='words'>
                    <h3>Translation</h3>

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
        expandAll: () => dispatch(expandAll())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

