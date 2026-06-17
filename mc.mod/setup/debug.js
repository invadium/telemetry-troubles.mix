function debug() {
    if ($.env.config.autosolve) {
        job.control.spawn('AutoSolver')
    }
}
debug.Z = 999
