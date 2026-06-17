class AutoSolver {

    constructor(st) {
        augment(this, {
            name: 'autoSolver',

            tasks: [],

            mask: {
                dispatch: true,
                read:     true,
                newExperiment:      true,
                experimentComplete: true,
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

    default(st, name) {
        log('default trap handler: ' + name)

        switch(name) {
            case 'dispatch':
                this.schedule(() => {
                    lab.locate('&inbox').markRead(st)
                }, 2 + 3*rnd())
                break
        }
    }

}
