// index colors used in text mode
const indexed = {
    fallback: '#ffff00',
    //base:    hsl(.45, .1, .1),
    base: '#32313b',
    //baseLow: '#4593a5',
    // baseHi:  '#4593a5',
    //baseHi:  '#365257',
    //baseHi:  '#2a3b42',
    baseLow: '#00ff00',
    //baseHi:  '#43527d',
    baseHi:  '#394040',

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

function indexColors() {
    const _ = this
    Object.keys(indexed).forEach(colorName => {
        const xRGB = indexed[colorName]
        _[colorName] = xRGB
        pal[colorName] = xRGB
        pal.direct[colorName] = xRGB

        pal._ls.push(xRGB)
        const textColorIndex = pal._ls.length - 1

        cidx[colorName] = textColorIndex
        cidx._dir[colorName] = textColorIndex
        cidx._ls[textColorIndex] = colorName
    })
    // lib.cidx = pal.cidx
}

function setup() {
    this.indexColors()
}

const palette = {
    setup,
    indexColors,
}
