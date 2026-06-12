const Pod = require('/mod/mc/dna/ops/pod/Pod')

class Battery extends Pod {

    constructor(st) {
        super( augment({
            name: 'battery',

            x:     75,
            y:     100,
            w:     40,
            h:     4,
            level: .25,

            padding: 1,
        }, st) )
        this.powerOn()
    }

    evo(dt) {
        this.level = .5 * (sin( env.time * .4 ) + 1)
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

}
