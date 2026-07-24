function sysop(args) {
    const probe = pub.probe

    for (let i = 0; i <= probe.lastLine(); i++) {
        probe.openDataLine(i)
        probe.openPowerLine(i)
    }

    const codeSelector = $.locate('&codeSelector')
    pub.dusty.ops.forEach(ops => {
        codeSelector.unlock(ops.name)
    })
}
