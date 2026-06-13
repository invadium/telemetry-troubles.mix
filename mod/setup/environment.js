function environment() {
    for(let p in env.config) {
        if (p.startsWith('debug')
                || p.startsWith('trace')
                || p.startsWith('show')
                || p.startsWith('hide')
                || p.startsWith('enable')
                || p.startsWith('disable')) {
            env[p] = env.config[p]
        }
    }

    // pin status info in envs
    $.env.statusInfo = mod.mc.env.statusInfo = {}

    const console = $.mod.console
    if (console) {
        // trip debug console if present
        console.env.pauseRootLab = true

        console.trap.on('open', () => {
            mod.mc.pauseLab()
        })
        console.trap.on('close', () => {
            mod.mc.resumeLab()
        })
    }
}
environment.Z = 1
