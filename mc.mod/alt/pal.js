// TODO provide base color palette structure

// TODO introduce main palette

// TODO include basic colors and extend main palette
//      can be extended with other palettes

const direct = {
    base:    hsl(.45, .1, .1),
    baseHi:  hsl(.45, .2, .2),
    baseLow: hsl(.45, .15, .15),
    text:    hsl(.45, .5, .6),
    'alert': hsl(.1,  .5, .7),

    'pick':   hsl(.15, .5, .7),
    'focus':  hsl(.24, .5, .7),
    'apply':  hsl(.05, .5, .5),

    dark: '101010',
}

// indexed colors
const ls = [
    '#151515',        // text mode border color
    hsl(.40, .2, .3), // default color???
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
