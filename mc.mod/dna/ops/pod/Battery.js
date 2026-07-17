const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Battery extends Pod {

    constructor(st) {
        super( augment({
            name: 'battery',

            x:     75,
            y:     100,
            w:     40,
            h:     4,

            level:    0,
            output:   0,
            readAt:   0,
            recent:   0,

            CAPACITY: 4000,

            padding:  1,
        }, st) )
        this.powerOn()

        this.CAPACITY_FACTOR = 1 / this.CAPACITY
    }

    init() {
        const gauge = this.gauge = this.__.spawn(dna.ops.pod.HGauge, {
            target: this,
            x:      this.x - .5 * this.w,
            y:      this.y - 4,
            w:      this.w,
        })
        this.companions = [
            gauge,
        ]

        this.RTG = this.__.RTG
    }

    charge(dt) {
        const energy = this.RTG.charge(this, dt)
        this.level = min(this.level + energy * this.CAPACITY_FACTOR, 1)
        // this.level = .5 * (sin( env.time * .4 ) + 1)


    }

    consume(power, dt) {
        const energy = power * env.tune.hourFactor * dt
        const deltaLevel = energy * this.CAPACITY_FACTOR

        if (deltaLevel > this.level) return 0

        this.level -= deltaLevel

        if (env.time >= this.readAt + 1) {
            this.output = this.recent
            log(`output: ` + this.output)
            this.gauge.level = clamp(this.output * .1, 0, 1)
            this.recent = 0
            this.readAt = env.time
        }
        this.recent += energy

        return energy
    }

    evo(dt) {
        this.charge(dt)
    }

    // TODO refactor out the level code into separate pods - HLevel and VLevel
    //      and just extend Battery from HLevel
    draw() {
        const { x, y, w, h, level } = this

        save()
        translate(x, y)

        const X1 = -.5 * w,
              Y1 = -.5 * h,
              PD = this.padding,
              X2 = X1 + PD,
              Y2 = Y1 + PD,
              W2 = level * (w - 2*PD),
              H2 = h - 2*PD

        stroke(env.palette.main)
        rect( X1, Y1, w, h )

        fill(env.palette.main)
        rect( X2, Y2, W2, H2 )

        restore()
    }

    startTelemetry() {
        this.telemetry = true
    }

    stopTelemetry() {
        this.telemetry = false
    }

    isTelemetric() {
        return true
    }

    powerOn() {
        this.power = true
        this.poweredAt = env.time
    }

    powerOff() {
        // this.power = false
    }

    isPowerControlled() {
        return false
    }

}
