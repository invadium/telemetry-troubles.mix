const schedule = []

function setup() {
    for (const msg of res.msg) {
        this.register(msg)
    }
}

// register the message prototype
function register(msg) {
    msg.sent = false
    schedule.push(msg)
}

function evo(dt) {
    schedule.forEach(msg => {
        if (env.missionStatus.time >= msg.at && !msg.sent) {
            msg.sent = true
            signal('email', msg)
            defer(() => remove(msg))
        }
    })
}

function remove(msg) {
    const i = schedule.indexOf(msg)
    if (i >= 0) schedule.splice(i, 1)
}
