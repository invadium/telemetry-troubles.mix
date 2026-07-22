const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Antenna extends Pod {

    constructor(st) {
        super( augment({
            name: 'antenna',

            buffer: 0,
            packet: null,
            stats: {
                power:     5,
                bandwidth: 1,
            },

            x: 25,
            y: -15,
            w: 30,
            h: 20,

            telemetryFeed: null,
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
        this.__.registerFeed(this)
    }

    registerFeed(pod) {
        this.telemetryFeed = pod
    }

    transmitTelemetry(packet) {
        if (!isObject(packet)) throw new Error('packet is expected!')

        if (!this.power) {
            // pass over - we are powered off and not accepting packets
            return this.telemetryFeed.transmitTelemetry(packet)
        } else if (this.packet) {
            // buffer overflow - reject the packet
            // log(`antenna - rejecting packet [${packet.title}]`)
            return this.telemetryFeed.transmitTelemetry(packet)
        } else {
            // accept and send the packet
            this.packet = packet
            this.buffer = packet.size
            return true
        }
    }

    evo(dt) {
        super.evo(dt)

        if (this.packet) {
            this.buffer -= this.stats.bandwidth * dt
            if (this.buffer <= 0) {
                this.packet.sent = true
                this.__.missionControl.receiveTelemetry(this.packet)

                this.buffer = 0
                this.packet = null
            }
        }
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
