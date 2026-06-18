// HeadQuarters controller - issue specs and experiments


function locateNextExperiment(prevExp) {
    for (let e of this.experiments) {
        if (!e.issued) return e
    }
}

function requestNewExperiment(prevExp, at) {
    log('requesting a new experiment!')
    const nextExp = this.locateNextExperiment(prevExp)
    if (!nextExp) {
        log.warn('unable to find a new experiment')
        return
    }

    log('found next experiment:')
    nextExp.issued    = true
    nextExp.completed = false
    dir(nextExp)

    const msg = {
        at:       at,
        from:    `HQ`,
        subject: `Request ${nextExp.code}`,
        content: `Series ${nextExp.series}, Experiment ${nextExp.experiment}\n\n`
                    + nextExp.task
                    + `\nReward: $${nextExp.reward}`,

        experiment: nextExp,
        onRead:     function() {
            job.control.mission.declareExperiment(nextExp)
        },
    }
    job.control.emailScheduler.schedule( msg )
    // signal('email', msg)
}

function reportCompleteExperiment(exp) {
    this.requestNewExperiment(exp)
}

function evo(dt) {
}


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
        }
    }
}

function setupExperiments() {
    this.experiments   = []
    this.experimentDir = {}

    this.scanExperiments(__$.exp)
}

function setup() {
    pin.link(this)
    $.HQ = this
}
