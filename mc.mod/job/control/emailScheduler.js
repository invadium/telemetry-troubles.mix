const schedule = []

function setup() {
    // schedule email prototypes for dispatch
    for (const msg of res.msg) {
        if (msg.at) this.register(msg)
    }
}

// register the message prototype
function register(msg) {
    msg.sent = false
    schedule.push(msg)
}

function sendAfter(msg, timeout) {
    const ms = env.missionStatus
    if (isStr(msg)) {
        // locate the email prototype in /res/msg by name
        msg = res.msg.locate('&' + msg)
    }
    msg.at = ms.time + timeout * ms.timeFactor
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
