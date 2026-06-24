function environment() {
    $.link(__$, 'mc')
    window._$ = __$
    lib.util.syncViewportSize()

    job.control._attachPolicy = sys.Frame.REPLACE

    env.link($.env.config, 'config')
}
environment.Z = 1
