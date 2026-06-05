const Pod = require('/mod/mc/dna/ops/pod/Pod')

class TapeRecorder extends Pod {

    constructor(st) {
        super( augment({
            name: 'tapeRecorder',

            x: 50,
            y: 50,
            w: 40,
            h: 25,
        }, st) )
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

    draw() {
        const { x, y, w, h } = this

        save()
        translate(x, y)

        lineWidth(.35)
        stroke(pal.main)

        // outline
        block( 0, 0, w, h )

        const R = .29*h
        const PADDING = .25*R

        const x1 = -.5*w + PADDING + R,
              x2 =  .5*w - PADDING - R,
              y1 = -.5*h + PADDING + R
        this.drawReel( x1, y1, R, env.time )
        this.drawReel( x2, y1, R, env.time * 1.4 )

        // TODO unify coordinate naming!
        const R2 = .2*R,
              x3 = x1 + PADDING,
              x4 = x2 - PADDING,
              y2 = .5*h - PADDING - R2,
              y3 = y2 - R2,
              y4 = y1 + .5*R,
              X5L = x3-R2,
              X5R = x4+R2,
              X6L = x3+.8*R2,
              X6R = x4-.8*R2
              


        // the tape
        line( x1-.86*R, y4, X5L, y2 )
        line( x2+.86*R, y4, X5R, y2 )

        line( X6L, y2+.4*R2, -2, y3 - .75 )
        line( X6R, y2+.4*R2,  2, y3 - .75 )

        // guide rollers
        circle( x3, y2, R2 )
        circle( x4, y2, R2 )

        // magnetic head
        block( 0, y3, 4, 1.5 )

        restore()
    }

}
