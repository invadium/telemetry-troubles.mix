function padLeft(str, len, c) {
    if (str.length >= len) return str
    const ch = c || ' '

    const prefix = []
    for (let i = len - str.length; i > 0; i--) {
        prefix.push(ch)
    }

    return prefix.join('') + str
}

function toString(time) {
    const day  = (time | 0) + 1,
          hour = floor((time % 1) * env.tune.dayHours),
          HOUR = (hour < 10)? '0' + hour : '' + hour

    return `${day}.${HOUR}`
}

function toFixedString(time, len) {
    const day  = (time | 0) + 1,
          hour = floor((time % 1) * env.tune.dayHours),
          HOUR = (hour < 10)? '0' + hour : '' + hour

    return padLeft(`${day}.${HOUR}`, len, '0')
}
