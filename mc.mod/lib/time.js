function toString(time) {
    const day  = (time | 0) + 1,
          hour = floor((time % 1) * env.tune.dayHours),
          HOUR = (hour < 10)? '0' + hour : '' + hour

    return `${day}.${HOUR}`
}

