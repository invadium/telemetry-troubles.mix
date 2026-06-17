function clear() {
    const toKill = lab.filter(e => !e.transient)
    toKill.forEach(e => kill(e))
    lab.locate('&blueprint').clear()
}

function launchProbe() {
    const probe = this.probe = $.probe = lab.spawn('Probe', {
        blueprint: lab.locate('&blueprint'),
    })
    $.dusty = probe.dusty
    probe.dusty.monitors.push(this)
    pin.link(probe)
    pub.link(probe)
    pin.link(probe.dusty)
    pub.link(probe.dusty)
    lab.locate('&coreMonitor').bind( probe.dusty )

    job.control.HQ.setupExperiments()
}

function start() {
    this.clear()
    this.launchProbe()

    this.activeExperiments = []
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

function earn(amount) {
    const ms = env.missionStatus

    ms.balance += amount
    this.checkStatus()
}

function burn(amount) {
    const ms = env.missionStatus

    let change = 0
    if (amount <= ms.balance) {
        ms.balance -= amount
        ms.burned += amount
    } else {
        change = amount - ms.balance
        const realBurn = amount - change
        ms.balance = 0
        ms.burned += realBurn
    }
    this.checkStatus()
    return change
}

function dailyBurn() {
    const ms = env.missionStatus

    return this.burn(ms.burnRate)
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

function declareExperiment(exp) {
    this.activeExperiments.push(exp)
    log(`declaring experiment:`)
    dir(exp)
    signal('newExperiment', exp)
}

function completeExperiment(exp) {
    const _  = this
    const MS = _.status
    if (!exp) return false
    const i = _.activeExperiments.indexOf(exp)
    if (i < 0) return false
    if (exp.completed) return false

    exp.completed = true
    _.earn(exp.reward)
    MS.experiments ++
    signal('email', {
        from: 'HQ',
        subject: `${exp.shortName} Complete`,
        content: `${exp.name} is complete!\n`
                 + `Reward: $${exp.reward}`, 
    })
    defer(() => _.activeExperiments.splice(i, 1))
    job.control.HQ.reportCompleteExperiment(exp)
    signal('experimentComplete', exp)

    return true
}

function loadSolution(code) {
    if (code) {
        return false
    } else {
        const aE = this.activeExperiments
        if (aE.length === 0) return false

        const exp = aE[ aE.length - 1 ]
        if (exp && isStr(exp.solution)) {
            this.probe.dusty.flush(exp.solution)
            return true
        } else {
            return false
        }
    }
}

function verifyExperiments() {
    const _     = this,
          probe = this.probe

    _.activeExperiments.forEach(exp => {
        if (exp.verify(probe, _)) _.completeExperiment(exp)
    })
}

function onHalt() {
    log('checking experiment results...')
    this.verifyExperiments()
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
    $.missionControl = this
    pub.link(this, 'missionControl')
}
