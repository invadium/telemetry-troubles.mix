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
}
environment.Z = 1
