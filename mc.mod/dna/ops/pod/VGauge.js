const Pod = require('/mod/mc/dna/ops/pod/Pod')

class VGauge extends Pod {

    constructor(st) {
        super( extend({
            level:  0,
            psize:  2,
            pdx:   -1,
        }, st) )
    }

    draw() {
        const { x, y, w, h, level } = this

        save()
        translate(x, y)

        line(0, 0, 0, h)

        const R  = this.psize,
              DX = this.pdx,
              Y1 = level * h

        fill(env.palette.main)
        triangle( DX, Y1, DX-R, Y1-R, DX-R, Y1+R )

        restore()
    }

}
