const Pod = require('/mod/mc/dna/ops/pod/Pod')

class HGauge extends Pod {

    constructor(st) {
        super( extend({
            type:  'gauge',
            level:  0,
            psize:  2,
            pdy:    1,
            dir:   -1,
        }, st) )
    }

    draw() {
        const { x, y, w, h, level } = this

        save()
        translate(x, y)

        line(0, 0, w, 0)

        const R  = this.psize,
              R2 = R * this.dir,
              DY = this.pdy * this.dir,
              X1 = level * w

        fill(env.palette.main)
        triangle( X1, DY, X1-R, DY+R2, X1+R, DY+R2 )

        restore()
    }

}
