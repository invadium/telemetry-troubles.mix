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
}
environment.Z = 1
