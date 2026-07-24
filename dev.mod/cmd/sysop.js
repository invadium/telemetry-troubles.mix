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
sysop.info = 'enable all data and power lines and unlock all instructions'

