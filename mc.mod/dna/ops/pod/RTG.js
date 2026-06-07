const Pod = require('/mod/mc/dna/ops/pod/Pod')

class RTG extends Pod {

    constructor(st) {
        super( augment({
            name: 'RTG',

            x:     30,
            y:     98,
            w:     40,
            h:     10,

            padding: 3,
            fq:      5,
            efq:     .05,
            sfq:     .2,
            speed:   10,
            ions:    [],

        }, st) )
        this.powerOn()
    }

    powerOff() {
        // can't be powered off - always on!
    }

    emitIon() {
        const ions = this.ions,
              w    = this.w

        let ion
        for (let i = ions.length - 1; i >= 0; i--) {
            const nextIon = ions[i]
            if (nextIon.dead) ion = nextIon
        }
        if (!ion) {
            ion = {
                at:   0,
                x:    0,
                y:    0,
                dx:   0,
                dy:   0,
                esc:  0,
                dead: true,
            }
            ions.push(ion)
        }
        ion.x = .3*w * (2*rnd() - 1)
        ion.y = 0

        const dir   = math.rnda(),
              speed = this.speed
        ion.dx = cos(dir) * speed
        ion.dy = sin(dir) * speed
        ion.at = env.time
        ion.dead = false
        ion.esc  = 0

        return ion
    }

    splitIon(ion) {
        const speed = this.speed,
              dir   = angleTo(ion.dx, ion.dy),
              d2    = dir + .2 * PI,
              d3    = dir - .2 * PI

        ion.dx = cos(d2) * speed
        ion.dy = sin(d2) * speed
        ion.at = env.time
        ion.esc = 1 + 3*rnd()

        const ion2 = this.emitIon()
        ion2.x = ion.x
        ion2.y = ion.y
        ion2.dx = cos(d3) * speed
        ion2.dy = sin(d3) * speed
        ion2.esc = 1 + 3*rnd()
    }

    evo(dt) {
        if (rnd() < this.fq * dt) this.emitIon()

        const ions = this.ions,
              hw   = .5 * this.w,
              hh   = .5 * this.h

        for (let i = ions.length - 1; i >= 0; i--) {
            const ion = ions[i]
            if (!ion.dead) {
                ion.x += ion.dx * dt
                ion.y += ion.dy * dt

                if (ion.esc > 0) {
                    if (env.time > ion.at + ion.esc) {
                        if (rnd() < this.sfq) this.splitIon(ion)
                        else ion.dead = true
                    }
                } else if (ion.x <= -hw || ion.x >= hw || ion.y <= -hh || ion.y >= hh) {
                    if (rnd() < this.efq) {
                        ion.esc = 1 + 3*rnd()
                    } else {
                        ion.dead = true
                    }
                }
            }
        }
    }

    draw() {
        const { x, y, w, h, level } = this

        save()
        translate(x, y)

        const X1 = -.5 * w,
              Y1 = -.5 * h,
              PD = this.padding,
              X2 = X1 + PD,
              Y2 = Y1 + PD,
              W2 = w - 2*PD,
              H2 = h - 2*PD

        stroke(env.palette.main)
        rect( X1, Y1, w, h )

        fill(env.palette.main)
        rect( X2, Y2, W2, H2 )

        const ions = this.ions
        for (let i = ions.length - 1; i >= 0; i--) {
            const ion = ions[i]
            if (!ion.dead) {
                block( ion.x, ion.y, .5, .5 )
            }
        }



        restore()
    }

}
