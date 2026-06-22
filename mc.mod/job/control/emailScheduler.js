let emailSchedule

// locate a message template if needed and create a new email prototype
function messageProto(msg) {
    if (!msg) return

    let msgProto
    if (isStr(msg)) {
        // locate the email template in /res/msg by name
        const msgTemplate = res.msg.locate('&' + msg)
        if (!msgTemplate) throw new Error(`can't locate message prototype [${msg}]`)
        msgProto = msgTemplate
    } else if (isObj(msg)) {
        msgProto = msg
    }

    return msgProto
}

// schedule a message prototype
//
// @param {object | string/template-name} msg 
// @param {number} timeout - specifies the timeout in seconds for sending the message
function schedule(msg, at) {
    const now = env.missionStatus? env.missionStatus.time : 0

    msg = messageProto(msg)
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

// send after the timeout in seconds
//
// @param {object | string} msg - a message object or a message prototype name to lookup
// @param {number} timeout - specifies the timeout in seconds for sending the message
function sendAfter(msg, baseTimeout, varTimeout) {
    const MS = env.missionStatus
    const at = MS.time + (baseTimeout + (varTimeout? varTimeout : 0) * rnd()) * MS.timeFactor

    schedule(msg, at)
}

// send after the timeout in day 
//
// @param {object | string} msg - a message object or a message prototype name to lookup
// @param {number} days - specifies the timeout in days for sending the message
function sendInDays(msg, inDays) {
    const MS = env.missionStatus
    const at = MS.time + inDays

    schedule(msg, at)
}

function evo() {
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
    // clear the schedule
    emailSchedule = []

    function processTemplates(node) {
        // schedule email prototypes for dispatch
        for (const msg of node) {
            if ( isFrame(msg) ) {
                processTemplates(msg)
            } else {
                if (msg.at) schedule( msg )
            }
        }
    }
    processTemplates(res.msg)
}
