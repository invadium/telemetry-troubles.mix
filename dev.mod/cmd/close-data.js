function command(args) {
    const probe = pub.probe
    if (args.length < 2) {
        this.print(`a target data line or "all" is expected!`)
        probe._ls.forEach(pod => {
            if (pod.type === 'pod') {
                this.print(`#${pod.line}: ${pod.name}`)
            }
        })
        return
    }
    const target = args[1]
    const number = parseInt( target )

    if ( isNumber(number) ) {
        if ( number > probe.lastDataLine() ) {
            this.print(`telemetry data lines available: [0..${probe.lastDataLine()}]`)
            return
        }
        probe.closeDataLine( number )

    } else if (target.toLowerCase() === 'all') {
        const N = probe.lastDataLine()
        for (let i = 0; i <= N; i++) {
            probe.closeDataLine(i)
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
            probe.closeDataLine( pod )
        } else {
            this.print('a line number, valid pod name or "all" is expected')
        }
    }
}
command.args = '<line-number> | all'
command.info = 'close a telemetry data line'

module.exports = command
