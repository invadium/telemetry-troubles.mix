function command(args) {
    if (args.length < 2) {
        this.print(`a target data line or "all" is expected!`)
        return
    }
    const target = args[1].toUpperCase()

    const probe = pub.probe

    if (target === 'ALL') {
        const N = probe.lastDataLine()
        for (let i = 0; i <= N; i++) {
            probe.closeDataLine(i)
        }
    } else {
        const n = parseInt( target )
        if ( isNumber(n) ) {
            probe.closeDataLine(n)
        } else {
            this.print('a line number or "all" is expected')
            return
        }
    }
}
command.args = '<line-number> | all'
command.info = 'close a telemetry data line'

module.exports = command
