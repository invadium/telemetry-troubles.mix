// TODO provide base color palette structure

// TODO introduce main palette

// TODO include basic colors and extend main palette
//      can be extended with other palettes

const direct = {
    //base:    hsl(.45, .1, .1),
    base: '#32313b',
    //baseLow: '#4593a5',
    baseLow: '#00ff00',
    // baseHi:  '#4593a5',
    //baseHi:  '#365257',
    //baseHi:  '#2a3b42',
    baseHi:  '#43527d',

    'default': '#5efdf7',
    'alert':   '#5efdf7',
    'pick':    '#5efdf7',
    'focus':   '#f5daa7',
    'title':   '#f5daa7',
    //
    //  focus:  '#ffd080', // ^^ too similar???
    // 'focus':   '#f3a787',
    apply: '#ff9e7d',


    // 'alert':   hsl(.1,  .5, .7),
    // 'focus':   hsl(.24, .5, .7),
    // 'apply':   hsl(.05, .5, .5),
    dark: '101010',
}

// indexed colors
const ls = [
    '#000000',        // text mode border color
    hsl(.20, .2, .3), // #1 - default color???
]

// color name -> palette index map
const index = {}

// get color index by name
function cidx(color) {
    const i = index[color]
    return i || 0
}

function init() {
    Object.keys(direct).forEach(k => {
        const v = direct[k]
        ls.push(v)
        index[k] = ls.length - 1
    })

    lib.cidx = cidx
}
