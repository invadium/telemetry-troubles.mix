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
        startBalance: 2500,
        burnRate:     100,
    },

    HQ: {
        baseRequestDelay:      2,
        varRequestDelay:       3,
    },
    missionControl: {
        maxTries:              5,
        maxActiveExperiments:  5,
        experimentTimeoutDays: 5,
    },
}
tune.hourSeconds = tune.evoSpeed / tune.dayHours // real seconds in a game hour
tune.hourFactor = 1 / tune.hourSeconds           // adjust any per-hour value to per-real-second

