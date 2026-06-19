const tune = {
    bufferScale: 1,

    evoSpeed:    60, // seconds/day
    dayHours:    30,
    displayNW:  .44,

    slowFactor:   .25,
    fastFactor:    12,
    slowDownStep: .5,
    speedUpStep:   2,

    selectorNumbers:  48,

    opt: {
        startBalance: 1000,
        burnRate:     100,
    },

    HQ: {
        baseRequestDelay: 2,
        varRequestDelay:  3,
    },
}
