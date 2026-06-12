const Pod = require('/mod/mc/dna/ops/pod/Pod')

class TapeRecorder extends Pod {

    constructor(st) {
        super( augment({
            name: 'tapeRecorder',

            x:     76,
            y:     15,
            w:     40,
            h:     25,

            time:  0,
        }, st) )
    }

    evo(dt) {
        if (this.power) this.time += dt
    }

    drawReel(x, y, r, a) {
        save()
        translate( x, y )

        circle( 0, 0, r )
        circle( 0, 0, .2*r )
        circle( 0, 0, .3*r )

        rotate(-a)
        line( 0, .4*r, 0, .8*r )
        rotate( .333 * TAU )
        line( 0, .4*r, 0, .8*r )
        rotate( .333 * TAU )
        line( 0, .4*r, 0, .8*r )

        restore()
    }

    drawGuideRoller(x, y, r, a) {
        save()
        translate(x, y)

        circle( 0, 0, r )

        rotate(-a)
        const R = .5*r
        line( 0, R,  0, -R )
        line( R, 0, -R,  0 )

        restore()
    }

    draw() {
        const { x, y, w, h, time } = this

        save()
        translate(x, y)

        stroke(pal.main)

        // outline
        block( 0, 0, w, h )

        const R1R = .29*h    // reel radius
        const PAD  = .25*R1R

        const X1L = -.5*w + PAD + R1R,   // left  reel x
              X1R =  .5*w - PAD - R1R,   // right reel x
              Y1R  = -.5*h + PAD + R1R
        this.drawReel( X1L, Y1R, R1R, time *.7   )
        this.drawReel( X1R, Y1R, R1R, time * 1.6 )

        const R2GR  = .2*R1R,            // guide rollers radius
              X2LGR = X1L + PAD,         // left guide roller x
              X2RGR = X1R - PAD,         // right guide roller x
              Y2GR  = .5*h - PAD - R2GR, // guide rollers y pos
              Y3MH  = Y2GR - R2GR,       // magnetic head y pos
              WMH   = 4,                 // magnetic head width
              HMH   = 1.5,               // magnetic head height
              Y4T   = Y1R + .5*R1R,      // top tap y pos
              Y5T   = Y2GR + .5*R2GR,
              Y6T   = Y2GR + .2*R2GR,
              X3LT  = X2LGR-R2GR,
              X3RT  = X2RGR+R2GR,
              X4LT  = X2LGR+.8*R2GR,
              X4RT  = X2RGR-.8*R2GR

        // the tape movement shifts
        const sh1 = .3 * (sin(time * 1.1) + 1)
        const sh2 = .3 * (sin(time * 1.3) + 1)
        // the tape - reels to guides
        line( X1L-.86*R1R, Y4T, X3LT, Y5T - sh1 )
        line( X1R+.86*R1R, Y4T, X3RT, Y5T - sh2 )

        // the tape - guides to the magnetic head
        line( X4LT, Y6T + sh1, -.5*WMH, Y3MH - .5*HMH )
        line( X4RT, Y6T + sh2,  .5*WMH, Y3MH - .5*HMH )

        // guide rollers
        this.drawGuideRoller( X2LGR, Y2GR, R2GR, time )
        this.drawGuideRoller( X2RGR, Y2GR, R2GR, time )

        // magnetic head
        block( 0, Y3MH, WMH, HMH )

        restore()
    }

}
