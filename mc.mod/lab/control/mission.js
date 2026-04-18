function burn() {
    const ms = env.missionStatus

    ms.balance = max(floor(ms.balance - ms.burnRate), 0)
    this.checkStatus()
}

function checkStatus() {
    const ms = env.missionStatus
    if (ms.over) return

    if (ms.balance <= 0) {
        signal('missionOver')
    }
}

function evo(dt) {
    const ms = env.missionStatus
    if (ms.over) return

    ms.timer += dt * ms.timeFactor

    if (ms.timer - ms.day > 1) {
        ms.day ++
        signal('nextDay', ms.day)
    }
}
