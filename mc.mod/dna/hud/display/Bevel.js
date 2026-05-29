class Bevel extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'bevel',

            x:    0,
            y:    0,
            w:    0,
            h:    0,
            b:    7,

            keepZ:     true,
            _centered: false,
        }, st) )
    }

    adjust() {
        const __ = this.__
        this.x = 0
        this.y = 0
        this.h = __.h
        this.w = __.w - __.holder.w - __.tag.w

        super.adjust()
    }

    draw() {
        const { __, x, y, w, h, b } = this
        const tag    = __.tag,
              holder = __.holder

        const b2 = .5 * b,
              bx = holder.w

        lineWidth(b)
        stroke('#6f5f7a')
        rect( bx + b2, b2, w - b, h - b)

        lineWidth(1)
        stroke('#000000')
        rect( bx, 0, w, h )
        rect( bx + b, b, w - 2*b, h - 2*b)
    }

}
