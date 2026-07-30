const Pod = require('/mod/mc/dna/ops/pod/Pod')

class StackInspector extends Pod {

    constructor(st) {
        super( augment({
            name: 'stackInspector',

            x:     0,
            y:     85,
            w:     12,
            h:     30,

            dusty:   null,
            stack:   null,

            padding: 1,
        }, st) )
    }

    init() {
        const probe = this.__
        const vmState = probe.dusty.spy.state()
        this.stack = vmState.dstack
    }

    draw() {
        const { x, y, w, h, stack } = this
        const PD = this.padding
        const DSP = this.__.dusty.spy.DSP()
        const yStep = 4
        const ITEMS = DSP

        save()
        translate(x - .5*w, y - .5*h)

        stroke(env.palette.main)
        rect( 0, 0, w, h )
        clip( 0, 0, w, h )

        baseTop()
        alignLeft()
        font( env.style.font.telemetry.head )
        fill( env.palette.main )

        let bx = PD
        let by = h - PD - ITEMS * yStep
        if (by < PD) by = PD
        for (let i = DSP - 1; i >= 0 && by < h; i--, by += yStep) {
            const val = stack[i]
            const hex = lib.format.toHexString(val, 4, '.')
            if ( isNum(val) ) text(`${hex}`, bx, by)
        }

        restore()
    }

}
