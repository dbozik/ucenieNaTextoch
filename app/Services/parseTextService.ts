    export class parseTextService {
        constructor() { }

        // class text

// properties:
// text
// language
// parsed text
// word list
// sentences list

/////////////////////////////////////////////////////////
// method to split the text
// arguments are none

// get sentence separators
// 
// get word separators from the language settings
// split the text by the visible and hidden separators
// save the result of words and symbols to parsed text

//////////////////////////////////////////////////////////
// method to get vocabulary returns a list of word objects
// arguments are the text, the language and settings

//  take the parsed text
//  get the distinct, lowercase words
//  for every word
    // find the word object in database (word, languageId, userId)
    // add the word object to translated words array

//////////////////////////////////////////////////////////////
// method to translate parsed text

// for every element in parsed text
    // if it is a symbol, skip
    // if it is a word
        // find in vocabulary list
        // if it exists
            // fill in parsed text its id
        // if it does not exist
            // create a new word object
            // set word
            // translation = void
            // level = unknown
            // sentence = get sentence
            // add the word object to vocabulary list

///////////////////////////////////////////////////////////
// method to parse text
// arguments are the text, the language, the settings

// initialize the class properties
// call the split the text function
// call the vocabulary function
// call the translate parsed text function


// class settings
// properties:
// user
// list of languages
    // dictionary
    // word separators
    // hidden word separators
    // sentence separators
    }