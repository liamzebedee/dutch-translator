learndutch
==========

Tool for learning Dutch.

![Demo](https://i.imgur.com/BrTaJtg.gifv)

Stack:
 - ES6
 - Webpack
 - React
 - Redux
 - D3 (for colours)
 - [Frog](http://languagemachines.github.io/frog/) for Dutch NLP
 - Flask microserver for interfacing to the above
 - Glosbe Web API for dutch-to-english word translations
 - [en-pos](https://github.com/finnlp/en-pos) for improving translation accuracy based on matching the English/Dutch POS tags

## Install
 1. `pip install Flask pynlpl`
 2. `yarn install`
 3. `yarn frog` (start Frog Docker container)
 4. `yarn flask` (start Python proxy to Frog API)
 2. `yarn web` (start Webpack) 
 2. Open [localhost:3000](http://localhost:3000)