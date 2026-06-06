// default palette
const palette = {
    // core blueprint colors
    hi:   '#8cfffb',
    main: '#5efdf7',
    low:  '#4593a5',

    title:   '#fa8620', // the titlebar text color
    outline: '#000000', // the titlebar text outline
    //stroke(.4, .5, .6) // alt

    status: {
        front:  hsl(.9, .4, .5),
        back:  '#000000C0',
    },
    tab: {
        active:  '#f2be1f',
        base:    '#8090A0',
        text:    '#404040',
        outline: '#000000',
    },
    button: {
        base: {
            h: .125,
            s: .9,
            l: .65,
            dl: .1,
        },
        bevel: {
            h:  .169,
            s:   1,
            l:  .8,
            dl: .6
        },

        base0: {
            h: .58,
            s: .2,
            l: .65,
            dl: .1,
        },
        bevel0: {
            h:  .58,
            s:  .1,
            l:  .8,
            dl: .6
        },

        // dusty button outer rim outline
        rim: {
            h: .148,
            s:  1,
            l: .5,
           dl: .3,
           ds: .5,
        },
    },

    dustyButton: {
        text: '#404040',
    },

    // define retro-screen background gradients
    background: {
        gradients: [,
            { stop:  0,  color: '#40bfbf' },
            { stop: .15, color: '#186060' },
            { stop: .7,  color: '#124240' },
            { stop:  1,  color: '#0d1e1e' },
        ]
    },

    // text-mode indexed colors
    indexed: {
        fallback:   '#ffff00',
        background: '#32313b',

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
    },

    // index colors used in text mode
    indexColors: function() {
        const _ = this
        Object.keys(_.indexed).forEach(colorName => {
            const xRGB = _.indexed[colorName]
            pal[colorName] = xRGB
            pal._direct[colorName] = xRGB

            pal._ls.push(xRGB)
            const textColorIndex = pal._ls.length - 1

            cidx[colorName] = textColorIndex
            cidx._dir[colorName] = textColorIndex
            cidx._ls[textColorIndex] = colorName
        })
    },

    // copy defined colors to /alt/pal
    copyColors: function() {
        for (const prop in this) {
            const val = this[prop]
            if (!isFun(val) && !['background', 'indexed'].includes(prop)) {
                pal[prop] = val
            }
        }
    },

    setup: function() {
        this.copyColors()
        this.indexColors()
    },
}
