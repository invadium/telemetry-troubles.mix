function hint(args) {
    let code = args[1]
    if (!code) {
        code = pub.missionControl.lastExperimentCode()
    }

    // TODO send directly and not through the trap
    $.mod.mc.enable()
    const sent = pub.missionControl.requestHint(code)
    if (sent) {
        this.print(`sent hint email for [${code}]`)
    } else {
        const suffix = code? ` for [${code}]` : ''
        this.print(`no hint to send${suffix}`)
    }
}
hint.args = '(experiment-code)'
hint.info = 'request a hint for the latest or a specified experiment'

