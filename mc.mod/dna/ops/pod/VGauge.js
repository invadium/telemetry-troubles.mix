const Pod = require('/mod/mc/dna/ops/pod/Pod')

class VGauge extends Pod {

    constructor(st) {
        super( extend({
            type:  'gauge',
            level:  0,
            psize:  2,
            pdx:   -1,
            dir:    1,
        }, st) )
    }

    draw() {
        const { x, y, w, h, level } = this

        save()
        translate(x, y)

        line(0, 0, 0, h)

        const R  = this.psize,
              R2 = R * this.dir,
              DX = this.pdx,
              Y1 = (1-level) * h

        fill(env.palette.main)
        triangle( DX, Y1, DX-R2, Y1-R, DX-R2, Y1+R )

        restore()
    }

}
