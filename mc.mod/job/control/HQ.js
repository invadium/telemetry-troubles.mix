// HeadQuarters controller - issue specs and experiments

function locateNextExperiment(prevExp) {
    let ls = this.experiments
    if ($.env.config.check) ls = this.checks

    for (let e of ls) {
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

    const type = nextExp.check? 'Check' : 'Request'
    const kind = nextExp.check? 'Check' : 'Experiment'

    const msg = {
        at:       at,
        hold:     hold,
        from:    `HQ`,
        subject: `${type} ${nextExp.code}`,
        content: `Series ${nextExp.series}, ${kind} ${nextExp.experiment}\n\n`
                    + nextExp.task
                    + (nextExp.reward? `\nReward: $${nextExp.reward}` : ``)
                    + (nextExp.hint? `\n\n![Request a Hint|>hint:${nextExp.code}]` : ``),

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


function scanExperiments(frame, ls, dir) {
    if (!frame || !isFrame(frame)) return

    const codeHi = frame.name.split('-')[0].toUpperCase()
    const seriesN = parseInt(codeHi.substring(1))

    for (let name in frame._dir) {
        const e = frame._dir[name]
        const codeLow = name.split('-')[0]
        const expN = parseInt(codeLow.substring(1))

        if ( isFrame(e) ) {
            this.scanExperiments(e, ls, dir)
        } else {
            const exp = extend({
                id:         ls.length + 1,
                code:       codeHi + codeLow.toUpperCase(),
                series:     seriesN,
                experiment: expN,
            }, e)

            ls.push(exp)
            dir[exp.code] = exp
            log(`  ${exp.id}. [${exp.code}] ${exp.title}`)
        }
    }
}

function setupExperiments() {
    log('=== Checks Scanner ===')
    this.checks = []
    this.checkDir = {}
    this.scanExperiments(__$.check, this.checks, this.checkDir)

    log('=== Experiments Scanner ===')
    this.experiments   = []
    this.experimentDir = {}
    this.scanExperiments(__$.exp, this.experiments, this.experimentDir)
}

function setup() {
    pin.link(this)
    $.HQ = this
}

function setProbe(probe) {
    this.probe = probe
}
