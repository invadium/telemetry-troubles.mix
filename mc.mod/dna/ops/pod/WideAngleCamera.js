const Pod = require('/mod/mc/dna/ops/pod/Pod')

class WideAngleCamera extends Pod {

    constructor(st) {
        super( augment({
            name:    'wideAngleCamera',
            time:     0,
            snapAt:   0,
            aperture: 0,

            stats: {
                power:       4,
                science:     4,
                engineering: 0,
                SNAP_TIME:   4,
            },

            x: 15,
            y: 85,
            w: 10,
            h: 10,

        }, st) )
    }

    powerOff() {
        this.power = false
        this.time  = 0
    }

    evo(dt) {
        super.evo(dt)

        if (this.power) {
            this.time += dt
            this.aperture = abs((sin(this.time * .25)))

            if (this.time >= this.snapAt + this.stats.SNAP_TIME) {
                log(`env:${floor(env.time)} -- ${floor(this.snapAt)} + ${floor(this.stats.SNAP_TIME)} <= ${floor(this.time)}`)
                this.__.sendTelemetryPacket({
                    type:  'wa-camera',
                    source: this,
                    size:   this.stats.science,
                })
                this.snapAt = this.time
            }
        } else {
            if (this.aperture > 0) {
                this.aperture -= dt
                this.time = 0
            }
        }
    }

    draw() {
        const { x, y, w, h, aperture } = this

        save()
        translate(x, y)

        lineWidth(.35)
        stroke(env.palette.main)
        block( 0, 0, w, h )

        const R        = .35 * h,
              SEGMENTS = 6,
              STEP     = TAU / SEGMENTS

        lineWidth(.6)
        circle( 0, 0, R )

        ctx.beginPath();
        ctx.arc( 0, 0, R, 0, TAU)
        ctx.clip()

        const R2 = .2*R + .8*R*aperture

        const p = []
        
        let ba = .25*PI * aperture
        for (let i = 0; i < SEGMENTS*4; i+=4) {
            p[i  ] = cos(ba) * -R2
            p[i+1] = sin(ba) * -R2
            p[i+2] = 1.1*R * cos(ba + .25*PI + .25*PI*aperture)
            p[i+3] = 1.1*R * sin(ba + .25*PI + .25*PI*aperture)

            ba += STEP
        }
        p.push(p[0])
        p.push(p[1])
        p.push(p[2])
        p.push(p[3])

        lineWidth(.5)
        fill(env.palette.low, env.palette.hi)
        for (let i = 0; i < SEGMENTS; i++) {
            const bi = i * 4
            triangle(
                p[bi  ], p[bi+1],
                p[bi+2], p[bi+3],
                p[bi+6], p[bi+7],
            )
        }

        restore()
    }

}
