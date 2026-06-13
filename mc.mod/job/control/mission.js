function clear() {
    const toKill = lab.filter(e => !e.transient)
    toKill.forEach(e => kill(e))
    lab.locate('&blueprint').clear()
}

function launchProbe() {
    const probe = $.probe = lab.spawn('Probe', {
        blueprint: lab.locate('&blueprint'),
    })
    $.dusty = probe.dusty
    pin.link(probe)
    pub.link(probe)
    pin.link(probe.dusty)
    pub.link(probe.dusty)
    lab.locate('&coreMonitor').bind( probe.dusty )
}

function start() {
    this.clear()
    this.launchProbe()

    this.status = $.env.missionStatus = env.missionStatus = {
        time:        1,
        day:         1,
        timeFactor:  1 / env.tune.evoSpeed,
        burnRate:    env.tune.opt.burnRate,
        balance:     env.tune.opt.startBalance,
        burned:      0,
        experiments: 0,
        over:        false,
    }
}

function checkStatus() {
    const ms = env.missionStatus
    if (ms.over) return

    if (ms.balance <= 0) {
        signal('mission/over')
    }
}

function burn() {
    const ms = env.missionStatus

    ms.balance = max(floor(ms.balance - ms.burnRate), 0)
    this.checkStatus()
}

function setBalance(amount) {
    const ms = env.missionStatus

    ms.balance = amount
    this.checkStatus()
}

function evo(dt) {
    const ms = env.missionStatus
    ms.time += dt * ms.timeFactor
    if (ms.over) return

    if (ms.time - ms.day > 1) {
        ms.day ++
        signal('mission/nextDay', ms.day)
    }
    this.checkStatus()
}

function getDay() {
    return (this.status.time | 0)
}

function getHour() {
    return floor((this.status.time % 1) * env.tune.dayHours)
}

function getHourString() {
    const hour = this.getHour()
    return (hour < 10)? '0' + hour : '' + hour
}

function getTimeString() {
    return lib.time.toString(this.status.time)
}

function setup() {
    $.mission = this
}
