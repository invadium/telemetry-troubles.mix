function command(args) {
    const probe = pub.probe
    if (args.length < 2) {
        this.print(`a target power line or "all" is expected!`)
        probe._ls.forEach(pod => {
            if (pod.type === 'pod') {
                this.print(`#${pod.line}: ${pod.name}`)
            }
        })
        return
    }
    const target = args[1].toUpperCase()
    const number = parseInt( target )

    if ( isNumber(number) ) {
        if ( number > probe.lastPowerLine() ) {
            this.print(`power lines available: [0..${probe.lastPowerLine()}]`)
            return
        }
        probe.closePowerLine( number )

    } else if (target.toLowerCase() === 'all') {
        const N = probe.lastPowerLine()
        for (let i = 0; i <= N; i++) {
            probe.closePowerLine(i)
        }

    } else {
        const name = target.toLowerCase()

        let pod
        for (let e of probe._ls) {
            if (e.type === 'pod' && e.name.toLowerCase().startsWith(name)) {
                pod = e
            }
        }

        if (pod && pod.type === 'pod') {
            probe.closePowerLine( pod )
        } else {
            this.print('a line number, valid pod name or "all" is expected')
        }
    }
}
command.args = '<line-number> | <device-name> | all'
command.info = 'close a power line'

module.exports = command
