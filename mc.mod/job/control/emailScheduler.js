const schedule = []

function init() {
    this.register( 2, {
        from: 'Author',
        subject: 'The Game',
        content: 'The game started',
    })
    this.register( 4, {
        from: 'HQ',
        subject: 'New Mission!',
        content: 'Something to do...',
    })
}

function register(time, msg) {
    schedule.push({ time, msg })
}

function evo(dt) {
    schedule.forEach(e => {
        if (env.missionStatus.time >= e.time && !e.sent) {
            e.sent = true
            signal('email', e.msg)
            defer(() => remove(e))
        }
    })
}

function remove(e) {
    const i = schedule.indexOf(e)
    if (i >= 0) schedule.splice(i, 1)
}
