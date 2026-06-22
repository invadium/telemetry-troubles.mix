class AutoSolver {

    constructor(st) {
        augment(this, {
            name:    'autoSolver',

            solved:   0,
            limit:    0,
            stopper:  null,

            paused:   false,
            disabled: false,

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
                    _.report(`solving experiment [${e.code}]`)
                    // solve solution heere!
                    pub.missionControl.loadSolution( e.solution )
                },
                experimentComplete: (e, _) => {
                    _.report(`experiment complete: [${e.code}]`)

                    _.solved ++
                    if ((_.limit && _.solved >= _.limit) || (_.stopper && _.stopper === e.code)) {
                        log('=== HALT AUTOSOLVER ===')
                        _.halt()
                    }
                },
                flush:              (e, _) => {
                    _.report(`walk the solution!`)
                    lab.locate('&coreMonitor').walk()
                },
            },
        }, st)

        this.mask.newExperiment.reactionBase = 0
        this.mask.newExperiment.reactionTime = 0
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

    schedule(st) {
        const MS = env.missionStatus

        // add signal handler to the task list
        this.tasks.push({
            at:     MS.time + st.timeout * MS.timeFactor,
            signal: st.signal,
            fn:     st.fn,
            done:   false,
        })
    }

    // default subtrap signal handler
    default(st, signal) {
        const _ = this
        this.report(`signal: [${signal}]`)

        const handler = this.mask[signal]
        if (handler) {
            const base = handler.reactionBase ?? 2
            const time = handler.reactionTime ?? 3
            this.schedule({
                signal:  signal,
                timeout: base + time*rnd(),
                fn: () => {
                    handler(st, _)
                },
            })
        } else {
            log.warn(`[autosolver] no handlers for [${signal}]`)
        }
    }

    report(msg) {
        const stime = lib.time.toString( env.missionStatus.time )
        log(`[${stime}][autosolver] ${msg}`)
    }

    halt() {
        this.paused   = true
        this.disabled = true
    }

    resume() {
        this.paused   = false
        this.disabled = false
    }
}
