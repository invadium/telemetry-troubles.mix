let tasks

function perform(task) {
    task.fn()
    task.done = true

    const stime = lib.time.toString( env.missionStatus.time )
    const suffix = task.title? task.title : ''
    log(`[${stime}][task-${task.id}]${suffix}`)
}

// schedule a task
//
// @param {function | object} tsk - task function or prototype object with .fn property
// @param {number} at - specifies the exact time in game days for performing the task
function schedule(tsk, at) {
    const now = env.missionStatus? env.missionStatus.time : 0

    const proto = isObj(tsk)? tsk : {
        fn: tsk,
    }
    const task = extend({
        id:   id('task'),
        at:   (at || tsk.at || 0),
        done: false,
    }, proto)

    // adjust for possible hold
    if ( isNumber(task.hold) && task.hold > 0 ) {
        if (task.at > 0) {
            task.at += task.hold * env.missionStatus.timeFactor
        } else {
            task.at = now + task.hold * env.missionStatus.timeFactor
        }
    }

    if ( isNumber(task.at) && task.at > now ) {
        tasks.push( task )
    } else {
        // do immediately
        perform( task )
    }
}

// send after the timeout in seconds
//
// @param {function | object} tsk - task function or prototype object with .fn property
// @param {number} baseTimeout - specifies the timeout in seconds
// @param {number} varTimeout - specifies the variable timeout in seconds
function doAfter(tsk, baseTimeout, varTimeout) {
    const MS = env.missionStatus
    const at = MS.time + (baseTimeout + (varTimeout? varTimeout : 0) * rnd()) * MS.timeFactor

    schedule(tsk, at)
}

// send after the timeout in day 
//
// @param {function | object} tsk - task function or prototype object with .fn property
// @param {number} days - specifies the timeout in days for the task
function doInDays(tsk, inDays) {
    const MS = env.missionStatus
    const at = MS.time + inDays

    schedule(tsk, at)
}

function evo() {
    tasks.forEach(task => {
        if (env.missionStatus.time >= task.at && !task.done) {
            perform(task)
            defer(() => remove(task))
        }
    })
}

function remove(task) {
    const i = tasks.indexOf(task)
    if (i >= 0) tasks.splice(i, 1)
}

function setup() {
    tasks = []
}

function getTasks() {
    return tasks
}
