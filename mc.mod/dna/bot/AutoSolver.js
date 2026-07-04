class AutoSolver {

    constructor(st) {
        augment(this, {
            name:    'autoSolver',

            solved:   0,
            limit:    0,
            stopper:  null,

            paused:   false,
            disabled: false,

            mask: {
                dispatch:           (e, _) => {
                    // timely reaction to accepted email
                    if (env.config.keepTiming) {
                        // estimate reading time
                        e.words = e.content.split(/\s+/)
                        const delay = round(.5 * e.words.length) // estimating 120 words/minute
                        _.report(`reading email "${e.subject}" from "${e.from}" with ${e.words.length} words in ${delay}s`)
                        job.control.taskScheduler.doAfter({
                            owner:  _,
                            title: `[autosolver] marking email read`,
                            fn: () => {
                                lab.locate('&inbox').markRead(e)
                                sfx('email-read')
                            },
                        }, delay)
                    } else {
                        // read immediately
                        _.report(`reading email "${e.subject}" from "${e.from}"`)
                        lab.locate('&inbox').markRead(e)
                        sfx('email-read')
                    }
                },
                read:               (e, _) => {
                    // post-reading routines
                    // dir(e)
                    // _.report(`done reading`)
                },
                newExperiment:      (e, _) => {
                    _.report(`solving experiment [${e.code}]`)
                    this.lastExperiment = e
                    // solve solution heere!
                    pub.missionControl.loadSolution( e.solution )
                    sfx('flush-solution')
                },
                experimentComplete: (e, _) => {
                    _.report(`experiment complete: [${e.code}]`)

                    _.solved ++
                    if ((_.limit && _.solved >= _.limit) || (_.stopper && _.stopper === e.code)) {
                        log('=== STOP AUTOSOLVER ===')
                        _.stop()
                    }
                },
                flush:              (e, _) => {
                    let estimate = 0.1
                    if (env.config.keepTiming) {
                        estimate = this.lastExperiment.estimate || 1
                    }
                    _.report(`walk the solution in ${floor(estimate * 10)/10} days`)
                    job.control.taskScheduler.doInDays(() => {
                        lab.locate('&coreMonitor').walk()
                    }, estimate)
                },
                halt:               (e, _) => {
                    const lastExp = _.lastExperiment
                    if (!lastExp) return

                    job.control.taskScheduler.doAfter({
                        owner:  _,
                        title: `[autosolver][${lastExp.code}] checking status`,
                        fn: () => {
                            const stime = lib.time.toString( env.missionStatus.time )
                            if (!lastExp.completed) {
                                // the experiment should be solved by now!
                                log.warn(`[${stime}][autosolver] failed to solve the experiment [${lastExp.code}]`)
                                dir(lastExp)
                            } else {
                                log(`[${stime}][autosolver] the solution for [${lastExp.code}] - OK!`)
                            }
                        },
                    }, 5)
                },
            },
        }, st)

        this.mask.newExperiment.reactionBase = 0
        this.mask.newExperiment.reactionTime = 0
    }

    init() {
        trap.subtraps.push(this)
    }

    schedule(st) {
        // const MS = env.missionStatus
        // job.control.taskScheduler.schedule(st)
        /*
        // add signal handler to the task list
        job.control.taskScheduler.schedule({
            // this.tasks.push({
            title:  
            at:     MS.time + st.timeout * MS.timeFactor,
            signal: st.signal,
            fn:     st.fn,
        })
        */
    }

    // default subtrap signal handler
    default(st, signal) {
        const _ = this
        // this.report(`signal: [${signal}]`)

        const handler = this.mask[signal]
        if (handler) {
            const base = handler.reactionBase ?? 2
            const time = handler.reactionTime ?? 3
            job.control.taskScheduler.schedule({
                title:  `[autosolver] handling signal [${signal}]`,
                signal:  signal,
                hold:    base + time*rnd(),
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

    stop() {
        this.paused   = true
        this.disabled = true
    }

    resume() {
        this.paused   = false
        this.disabled = false
    }
}
