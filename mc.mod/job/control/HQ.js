// HeadQuarters controller - issue specs and experiments


function locateNextExperiment(prevExp) {
    for (let e of this.experiments) {
        if (!e.issued) return e
    }
}

function requestNewExperiment(prevExp, at) {
    const probe = this.probe
    const suffix = prevExp? ` after [${prevExp.code}]` : ''
    log(`requesting a new experiment${suffix}`)
    const nextExp = this.locateNextExperiment(prevExp)
    if (!nextExp) {
        log.warn('unable to find a new experiment')
        return
    }

    log('found next experiment:')
    nextExp.issued    = true
    nextExp.completed = false
    nextExp.issuedAt  = env.missionStatus.time
    dir(nextExp)

    // check prerequisites
    if ( isFun(nextExp.prerequisites) ) {
        job.control.taskScheduler.schedule({
            owner:  this,
            title: `[HQ][${nextExp.code}] checking prerequisites`,
            fn:    () => {
                nextExp.prerequisites(probe)
            },
        }, at)
    }

    const hold  = nextExp.hold ?? 0

    const msg = {
        at:       at,
        hold:     hold,
        from:    `HQ`,
        subject: `Request ${nextExp.code}`,
        content: `Series ${nextExp.series}, Experiment ${nextExp.experiment}\n\n`
                    + nextExp.task
                    + `\nReward: $${nextExp.reward}`
                    + `\n\n![Request a Hint|>hint:${nextExp.code}]`,

        experiment: nextExp,
        onRead:     function() {
            job.control.mission.declareExperiment(nextExp)
        },
    }
    job.control.emailScheduler.schedule( msg )
    // signal('email', msg)
}

function reportCompleteExperiment(exp) {
    const mS = env.missionStatus
    const timeout = exp.embargo? exp.embargo
            : (env.tune.HQ.baseRequestDelay + env.tune.HQ.varRequestDelay * rnd())
    const at = mS.time + timeout * mS.timeFactor

    this.requestNewExperiment(exp, at)
}

function evo() {}


function scanExperiments(frame) {
    if (!frame || !isFrame(frame)) return

    const experiments = this.experiments
    const experimentDir = this.experimentDir
    const codeHi = frame.name.toUpperCase()
    const seriesN = parseInt(codeHi.substring(1))

    for (let name in frame._dir) {
        const e = frame._dir[name]
        const codeLow = name.split('-')[0]
        const expN = parseInt(codeLow.substring(1))

        if ( isFrame(e) ) {
            this.scanExperiments(e)
        } else {
            const exp = extend({
                id:         experiments.length + 1,
                code:       codeHi + codeLow.toUpperCase(),
                series:     seriesN,
                experiment: expN,
            }, e)

            experiments.push(exp)
            experimentDir[exp.code] = exp
            log(`  ${exp.id}. [${exp.code}] ${exp.title}`)
        }
    }
}

function setupExperiments() {
    this.experiments   = []
    this.experimentDir = {}
    log('=== Experiments Scanner ===')
    this.scanExperiments(__$.exp)
}

function setup() {
    pin.link(this)
    $.HQ = this
}

function setProbe(probe) {
    this.probe = probe
}
