function debug() {
    const autosolve = $.env.config.autosolve,
          limiter = isString(autosolve)? parseInt(autosolve) : 0,
          limit = isNumber(limiter)? limiter : 0,
          stopper = limit? null : autosolve

    if (autosolve) {
        job.control.spawn('AutoSolver', {
            limit:   isNumber(limit)? limit : 0,
            stopper: isString(stopper)? stopper.toUpperCase(): null,
        })
    }
}
debug.Z = 999
