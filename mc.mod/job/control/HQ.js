// HeadQuarters controller - issue specs and experiments

function locateNextExperiment(prevExp) {
    for (let e of this.experiments) {
        if (!e.issued) return e
    }
}

function requestNewExperiment(prevExp) {
    log('requesting a new experiment!')
    const nextExp = this.locateNextExperiment(prevExp)
    if (!nextExp) {
        log.warn('unable to find a new experiment')
        return
    }

    log('this is the one to launch:')
    nextExp.issued    = true
    nextExp.completed = false
    dir(nextExp)

    const msg = {
        from:    `HQ`,
        subject: `Experiment ${nextExp.code}`,
        content:  nextExp.task
                    + `\nReward: $${nextExp.reward}`,

        onRead: function() {
            job.control.mission.declareExperiment(nextExp)
        },
    }
    signal('email', msg)
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

    for (let name in frame._dir) {
        const e = frame._dir[name]
        const codeLow = name.split('-')[0]

        if ( isFrame(e) ) {
            this.scanExperiments(e)
        } else {
            const exp = extend({
                id:   experiments.length + 1,
                code: codeHi + codeLow.toUpperCase()
            }, e)

            experiments.push(exp)
            experimentDir[exp.code] = exp
        }
    }
}

function setupExperiments() {
    this.experiments   = []
    this.experimentDir = {}

    this.scanExperiments(res.exp)
}

function setup() {
    pin.link(this)
    $.HQ = this
}
