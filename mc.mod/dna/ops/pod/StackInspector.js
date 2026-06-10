const Pod = require('/mod/mc/dna/ops/pod/Pod')

class StackInspector extends Pod {

    constructor(st) {
        super( augment({
            name: 'stackInspector',

            x:     90,
            y:     65,
            w:     12,
            h:     50,

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

        save()
        translate(x - .5*w, y - .5*h)

        stroke(env.palette.main)
        rect( 0, 0, w, h )
        clip( 0, 0, w, h )

        baseTop()
        alignLeft()
        font( env.style.font.telemetry.head )
        fill( env.palette.main )

        let bx = PD, by = PD
        for (let i = DSP - 1; i >= 0 && by < h; i--, by += 4) {
            const val = stack[i]
            if (val) text(`${val}`, bx, by)
        }

        restore()
    }

}
