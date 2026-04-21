const superGlitchy = {
    short: {
        bias:       .1,
        threshold: .6,
    },
    long: {
        bias:       10,
        threshold: .48,
    },
    shift: {
        fq:        .7,
        // short:      0,
        // long:       0,
    },
    screen: {
        width:  320,
        height: 200,
        backgroundColor: [.2, .2, .1, 1],
        curvature: {
            x: 3.0,
            y: 3.0,
        },
        scanLineOpacity: {
            x: .025,
            y: .2,
        },
        vignette: {
            x: .5,
            y: .5,
            z: 25,
        },
    },
}

const glitchy = {
    short: {
        bias:       .1,
        threshold: .45,
    },
    long: {
        bias:       7,
        threshold: .28,
    },
    shift: {
        fq: .7,
    },
    screen: {
        width:  480,
        height: 320,
        backgroundColor: [.18, .22, .11, 1], // greenish dead screen tint
        curvature: {
            x: 4.0,
            y: 4.0,
        },
        scanLineOpacity: {
            x: .025,
            y: .2,
        },
        vignette: {
            x: .5,
            y: .5,
            z: 25,
        },
        hBending: {
            r:  .5,
            g:   0,
            b: -.5,
        },
    },
}

function init() {
    extend(this, glitchy)
}

function evo(dt) {
    const { short, long, shift } = this

    const v = .5 * (lib.ken.pnoise(env.time * shift.fq, 0, 1) + 1)
    shift.val0 = v
    shift.shortLevel = clamp(v - (1 - short.threshold), 0, 1) * short.bias
    shift.longLevel  = clamp(v - (1 - long.threshold), 0, 1)  * long.bias
}
