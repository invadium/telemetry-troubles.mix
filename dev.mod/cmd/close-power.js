function command(args) {
    if (args.length < 2) {
        this.print(`a target power line or "all" is expected!`)
        return
    }
    const target = args[1].toUpperCase()

    const probe = pub.probe

    if (target === 'ALL') {
        const N = probe.lastPowerLine()
        for (let i = 0; i <= N; i++) {
            probe.closePowerLine(i)
        }
    } else {
        const n = parseInt( target )
        if ( isNumber(n) ) {
            if ( n > probe.lastPowerLine() ) {
                this.print(`power lines available: [0..${probe.lastPowerLine()}]`)
                return
            }
            probe.closePowerLine(n)
        } else {
            this.print('a line number or "all" is expected')
            return
        }
    }
}
command.args = '<line-number> | all'
command.info = 'close a power line'

module.exports = command
