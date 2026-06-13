function match(pattern) {
    const ms = env.missionStatus

    switch(pattern) {
        case 'day':         return ms.day;
        case 'experiments': return ms.experiments;
        case 'burned':      return ms.burned;
    }
}
