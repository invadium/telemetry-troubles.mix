let emailSchedule

// schedule or send the message prototype
function schedule(msg, at) {
    const now = env.missionStatus? env.missionStatus.time : 0

    const message = extend({
        at:   (at || msg.at || 0),
        sent: false,
    }, msg)

    if ( isNumber(message.at) && message.at > now ) {
        emailSchedule.push( message )
    } else {
        // dispatch immediately
        signal('email', message)
    }
}

// send the message at specified time
//
// @param {object} msg
// @param {number} timeout - specifies the timeout in seconds for sending the message
function sendAt(msg, at) {
    if (!msg) throw new Error(`a message prototype or a message template name is expected!`)
    if (!isNum(at)) throw new Error(`a timestamp is expected!`)

    if (isStr(msg)) {
        // locate the email prototype in /res/msg by name
        const msgProto = res.msg.locate('&' + msg)
        if (!msgProto) throw new Error(`can't locate message prototype [${msg}]`)
        msg = extend({}, msgProto)
    }
    schedule(msg, at)
}

// send after the timeout in seconds
//
// @param {object | string} msg - a message object or a message prototype name to lookup
// @param {number} timeout - specifies the timeout in seconds for sending the message
function sendAfter(msg, timeout) {
    const MS = env.missionStatus
    const at = MS.time + timeout * MS.timeFactor

    sendAt(msg, at)
}

// send after the timeout in day 
//
// @param {object | string} msg - a message object or a message prototype name to lookup
// @param {number} days - specifies the timeout in days for sending the message
function sendAfter(msg, inDays) {
    const MS = env.missionStatus
    const at = MS.time + inDays

    sendAt(msg, at)
}

function evo(dt) {
    emailSchedule.forEach(msg => {
        if (env.missionStatus.time >= msg.at && !msg.sent) {
            msg.sent = true
            signal('email', msg)
            defer(() => remove(msg))
        }
    })
}

function remove(msg) {
    const i = emailSchedule.indexOf(msg)
    if (i >= 0) emailSchedule.splice(i, 1)
}

function setup() {
    emailSchedule = []

    // schedule email prototypes for dispatch
    for (const msg of res.msg) {
        if (msg.at) schedule( msg )
    }
}
