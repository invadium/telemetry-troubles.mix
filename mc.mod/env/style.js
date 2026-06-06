const style = {

    font: {
        main: {
            family: 'pixel-operator-mono8',
            size:   14,
        },
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

        tab: {
            family: 'pixel-operator-bold',
            size:    20
        },
        dustyButton: {
            family: 'pixel-operator-bold',
            size:    20,
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

    blueprint: {
        lineWidth: .35,
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

