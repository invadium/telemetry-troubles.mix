function clear() {
    const toKill = lab.filter(e => !e.transient)
    toKill.forEach(e => kill(e))
    lab.locate('&blueprint').clear()
}

function launchProbe() {
    const probe = $.probe = lab.spawn('Probe', {
        blueprint: lab.locate('&blueprint'),
    })
    pin.link(probe)
}

function start() {
    this.clear()
    this.launchProbe()

    this.status = env.missionStatus = {
        timer:      0,
        day:        1,
        timeFactor: 1 / env.tune.evoSpeed,
        burnRate:   env.tune.opt.burnRate,
        balance:    env.tune.opt.startBalance,
        over:       false,
    }
}

function burn() {
    const ms = env.missionStatus

    ms.balance = max(floor(ms.balance - ms.burnRate), 0)
    this.checkStatus()
}

function checkStatus() {
    const ms = env.missionStatus
    if (ms.over) return

    if (ms.balance <= 0) {
        signal('mission/over')
    }
}

function evo(dt) {
    const ms = env.missionStatus
    if (ms.over) return

    ms.timer += dt * ms.timeFactor

    if (ms.timer + 1 - ms.day > 1) {
        ms.day ++
        signal('mission/nextDay', ms.day)
    }
}

function getDay() {
    return (this.status.timer | 0) + 1
}

function getHour() {
    return floor((this.status.timer % 1) * env.tune.dayHours)
}

function getHourString() {
    const hour = this.getHour()
    return (hour < 10)? '0' + hour : '' + hour
}

function getTimeString() {
    return lib.time.toString(this.status.timer)
}

function setup() {
    $.mission = this
}
