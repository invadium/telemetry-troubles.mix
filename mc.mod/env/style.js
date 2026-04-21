const style = {

    color: {
        main: '#5efdf7',
        hi:   '#8cfffb',
        low:  '#4593a5',

        title: '#fa8620', // the title bar text color
        outline: '#000000',
        //stroke(.4, .5, .6) // alt

        status: {
            front:  hsl(.9, .4, .5),
            back:  '#000000C0',
        },

        background: {
            gradients: [,
                { stop:  0,  color: '#40bfbf' },
                { stop: .15, color: '#186060' },
                { stop: .7,  color: '#124240' },
                { stop:  1,  color: '#0d1e1e' },
            ]
        },
    },

    font: {
        terminal: {
            family:    'pixel-operator-mono8',
            size:       8,
            cellWidth:  8,
            cellHeight: 10,
        },
        title: {
            family: 'pixel-operator-mono8',
            size:   16,
        },
        status: {
            family: 'pixel-operator-mono8',
            size: 16,
        },


        main: {
            family: 'pixel-operator-mono8',
            size:   14,
        },

        menu: {
            family: 'moon',
            size:   32,
        },
        menuHigh: {
            family: 'moon',
            size:   35,
        },
        menuSuperHigh: {
            family: 'moon',
            size:   38,
        },
        menuPressed: {
            family: 'moon',
            size:   30,
        },
        credits: {
            family: 'moon',
            size:   32,
        },

        debug: {
            family: 'pixel-operator',
            size: 24,
        },
    },

    hud: {
        targetWidth: 1000,
    },
}

function classifyFonts() {
    for (let id in style.font) {
        const font = style.font[id]
        font.id = id
        font.head = font.size + 'px ' + font.family
    }
}

(function setupStyles() {
    classifyFonts()
})()

