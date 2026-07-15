const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Antenna extends Pod {

    constructor(st) {
        super( augment({
            name: 'antenna',

            x: 25,
            y: -15,
            w: 30,
            h: 20,
        }, st) )
    }

    init() {
        const gauge = this.gauge = this.__.spawn(dna.ops.pod.VGauge, {
            target: this,
            x:      this.x - .5 * this.w - 8,
            y:      this.y + .5 * this.h,
            h:      this.h,
        })
        this.companions = [
            gauge,
        ]
    }

    wave() {
        const SPEED = .5
        const TIME = (env.time - this.poweredAt)
        const STEPS = 8
        const DY = 3
        const DT = (env.time * SPEED) % 1
        const BY = DY * DT

        for (let i = 0; i < STEPS; i++) {
            const factor = (i + DT)/STEPS // 0..1 factor
            const dy = BY + i*DY
            const r = .5 * dy
            const da = .001 * dy
            alpha(1 - factor)
            arc( 0, -dy, r, (1.2 + da) * PI, (1.8-da) * PI )
        }
    }

    draw() {
        const { x, y, w, h } = this

        save()
        translate(x, y)

        lineWidth(.5)
        stroke(pal.main)

        arc( 0, 0, w, .25 * PI, .75 * PI )

        const DY1 = 15
        translate( 0, DY1 )
        arc( 0, 0, 3, .2 * PI, .8 * PI )

        save()
            line( 0, 3, 0, w-DY1)
            rotate(-.15 * PI)
            line( 0, 3, 0, w-DY1 + 1)
            rotate(.3 * PI)
            line( 0, 3, 0, w-DY1 + 1)
        restore()

        translate( 0, 4 )
        if (this.power) this.wave()

        restore()
    }

}
