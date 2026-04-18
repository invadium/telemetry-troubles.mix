const style = {

    color: {
        main:  '#6b1fb1',
        title: '#6b1fb1',

        sky: '#1f123a',
        grid: '#9e0abf',

        powerStation: '#110f14',

        menu: {
            title: '#6b1fb1',
        },
        credits: {
            title: '#6b1fb1',
            front: '#62aadd',
            back:  '#3a1e7e',
        },

        status: {
            front:  hsl(.14, .4, .5),
            back:  '#000000C0',
        },

        neon: {
            red:     '#ff0000',
            green:   '#00ff00',
            blue:    '#00c0ff',
            cyan:    '#00ffff',
            yellow:  '#ffff00',
            purple:  '#8060ff',
            white:   '#ffffff',
        },
    },
    
    font: {
        main: {
            family: 'moon',
            size:   24,
        },
        titleBar: {
            family: 'moon',
            size:   32,
        },
        messageBar: {
            family: 'moon',
            size:   48,
        },
        subMessageBar: {
            family: 'moon',
            size:   38,
        },
        title: {
            family: 'moon',
            size:   64,
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
            family: 'moon',
            size: 24,
        },
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

