function newGame() {
    log('starting new game...')

    env.missionStatus = {
        timer:      0,
        day:        0,
        timeFactor: 1 / env.tune.evoSpeed,
        burnRate:   env.tune.opt.burnRate,
        balance:    env.tune.opt.startBalance,
        over:       false,
    }
}
