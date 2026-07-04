function clear() {
    const toKill = lab.filter(e => !e.transient)
    toKill.forEach(e => kill(e))
    lab.locate('&blueprint').clear()
}

function launchProbe() {
    const probe = this.probe = $.probe = lab.spawn('Probe', {
        missionControl: this,
        blueprint:      lab.locate('&blueprint'),
    })
    $.dusty = probe.dusty
    probe.dusty.monitors.push(this)
    pin.link(probe)
    pub.link(probe)
    pin.link(probe.dusty)
    pub.link(probe.dusty)
    lab.locate('&coreMonitor').bind( probe.dusty )

    job.control.HQ.setProbe(probe)
    job.control.HQ.setupExperiments()
}

function start() {
    this.clear()
    this.launchProbe()

    this.experimentLog = []
    this.activeExperiments = []
    this.status = $.env.missionStatus = env.missionStatus = {
        time:        1,
        day:         1,
        hour:        0,
        timeFactor:  1 / env.tune.evoSpeed,
        hourTime:    env.tune.evoSpeed / env.tune.dayHours,
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

    if (ms.time - ms.day - ms.hour * ms.hourTime * ms.timeFactor >= ms.hourTime * ms.timeFactor) {
        ms.hour ++
        // log('hour: ' + ms.hour + ' time: ' + ms.time + ' => ' + this.getTimeString())
        this.checkStatus()
        this.reviewActiveExperiments()
        signal('mission/nextHour', ms.hour)
    }

    if (ms.time - ms.day > 1) {
        ms.day ++
        ms.hour = 0
        this.checkStatus()
        signal('mission/nextDay', ms.day)
    }
}

function declareExperiment(exp) {
    this.experimentLog.push(exp)
    this.activeExperiments.push(exp)
    exp.acceptedAt = this.status.time
    log(`declaring experiment:`)
    dir(exp)
    signal('newExperiment', exp)
}

function completeExperiment(exp) {
    const _     = this,
          MS    = _.status,
          probe = _.probe

    if (!exp) return false
    const i = _.activeExperiments.indexOf(exp)
    if (i < 0) return false
    if (exp.completed) return false

    exp.completed = true
    MS.experiments ++

    job.control.taskScheduler.doAfter({
        owner:  _,
        title: `[mission-control] send experiment complete email`,
        fn: () => {
            _.earn(exp.reward)
            signal('email', {
                from: 'HQ',
                subject: `${exp.code} Complete`,
                content: `${exp.code}: ${exp.title} is complete!\n\n`
                         + `Reward: $${exp.reward}`, 
            })

            job.control.HQ.reportCompleteExperiment(exp)
            signal('experimentComplete', exp)
        },
    }, 3)

    if ( isFun(exp.next) ) {
        exp.next(probe)
    }
    defer(() => _.activeExperiments.splice(i, 1))
    sfx('experiment-complete')

    return true
}

function lastExperimentCode() {
    const aE = this.activeExperiments
    if (aE.length === 0) return ''

    return aE[ aE.length - 1 ].code
}

// request for the last or provided experiment
// @param exp { object/experiment | string/code | undefined } - optional experiment object or code
function requestHint(exp) {
    if (!exp) {
        const aE = this.activeExperiments
        if (aE.length === 0) return false

        exp = aE[ aE.length - 1 ]
    } else if ( isStr(exp) ) {
        const code = exp.toUpperCase()
        const ls = this.experimentLog.filter(e => e.code === code)
        if (ls.length === 0) return
        exp = ls[0]
    }
    if ( !isObj(exp) ) return false
    if ( !isStr(exp.hint) ) return false

    signal('email', {
        from: 'Tech Sup',
        subject: `${exp.code} Hint`,
        content: exp.hint,
    })
    return true
}

// TODO refactor on null/id/expObject model like the hint!
function loadSolution(solution, unlocked) {
    if (solution) {
        this.probe.dusty.flush(solution, 0, unlocked)
        return true
    } else {
        const aE = this.activeExperiments
        if (aE.length === 0) return false

        const exp = aE[ aE.length - 1 ]
        if (exp && isStr(exp.solution)) {
            this.probe.dusty.flush(exp.solution, 0, unlocked)
            return true
        } else {
            return false
        }
    }
}

function reviewActiveExperiments() {
    if (this.activeExperiments.length >= env.tune.missionControl.maxActiveExperiments) return
    const mS = this.status

    let requestNew = false
    this.activeExperiments.forEach( exp => {
        if (!exp.essential && !exp.followed && (mS.time - exp.acceptedAt) > env.tune.missionControl.experimentTimeoutDays) {
            log(`Unsolved ${exp.code}: requesting a new experiment!`)
            requestNew = true
            exp.followed = true
        }
    })

    if (requestNew) {
        job.control.HQ.requestNewExperiment()
    }
}

function registerTry(exp) {
    if (!exp) return

    exp.tries = exp.tries? exp.tries + 1 : 1
    if (!exp.essential
            && !exp.followed
            && exp.tries >= env.tune.missionControl.maxTries
            && this.activeExperiments.length < env.tune.missionControl.maxActiveExperiments) {
        // maximum number of tries reached, issue the next experiment
        exp.followed = true
        job.control.HQ.requestNewExperiment()
    }
}

function verifyExperiments(tried) {
    const _     = this,
          probe = this.probe

    let tryRegistered = false
    _.activeExperiments.forEach( exp => {
        if (exp.verify(probe)) _.completeExperiment(exp)

        if (tried && !tryRegistered && !exp.completed && !exp.followed) {
            this.registerTry( exp )
            tryRegistered = true
        }
    })
}

function onHalt() {
    log('checking experiment results...')
    this.verifyExperiments(true)
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

function slow() {
    env._evoSpeed = env.tune.slowFactor
}

function normal() {
    env._evoSpeed = 1
}

function fast() {
    env._evoSpeed = env.tune.fastFactor
}

function speedUp() {
    env._evoSpeed *= env.tune.speedUpStep
}

function slowDown() {
    env._evoSpeed *= env.tune.slowDownStep
}

function setup() {
    $.missionControl = this
    pub.link(this, 'missionControl')
}
