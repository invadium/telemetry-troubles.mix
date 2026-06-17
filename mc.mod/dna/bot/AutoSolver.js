class AutoSolver {

    constructor(st) {
        augment(this, {
            name: 'autoSolver',

            tasks: [],

            mask: {
                dispatch:           (e, _) => {
                    // in a few seconds after accepting, the email has to be read
                    _.report(`reading email "${e.subject}" from "${e.from}"`)
                    lab.locate('&inbox').markRead(e)
                },
                read:               (e, _) => {
                    // post-reading routines
                    // dir(e)
                    // _.report(`done reading`)
                },
                newExperiment:      (e, _) => {
                    _.report(`experimentos ${e.code}`)
                    // solve solution heere!
                    pub.missionControl.loadSolution( e.solution )
                },
                experimentComplete: (e, _) => {
                },
                flush:              (e, _) => {
                    _.report(`flushed the solution already!`)
                    lab.locate('&coreMonitor').walk()
                },
            },
        }, st)
    }

    init() {
        trap.subtraps.push(this)
    }

    evo(dt) {
        const tasks = this.tasks,
              now   = env.missionStatus.time

        for (let i = tasks.length - 1; i >= 0; i--) {
            const task = tasks[i]
            if (!task.done) {
                if (task.at <= now) {
                    task.fn()
                    task.done = true
                }
            }
        }
    }

    schedule(fn, timeout) {
        const MS = env.missionStatus

        this.tasks.push({
            at:   MS.time + timeout * MS.timeFactor,
            fn:   fn,
            done: false,
        })
    }

    default(st, signal) {
        const _ = this
        this.report(`signal: [${signal}]`)

        const handler = this.mask[signal]
        if (handler) {
            this.schedule(() => {
                handler(st, _)
            }, 2 + 3*rnd())
        } else {
            log.warn(`[autosolver] no handlers for [${signal}]`)
        }
    }

    report(msg) {
        const stime = lib.time.toString( env.missionStatus.time )
        log(`[${stime}][autosolver] ${msg}`)
    }

}
