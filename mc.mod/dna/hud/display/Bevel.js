class Bevel extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'bevel',

            x:    0,
            y:    0,
            w:    0,
            h:    0,
            padding: {
                N:   7,
                E:   7,
                S:   34,
                W:   7,
            },

            transparent: true,

            keepZ:     true,
            _centered: false,
        }, st) )
    }

    adjust() {
        const __ = this.__
        this.x = __.holder.w
        this.y = 0
        this.h = __.h
        this.w = __.w - __.holder.w - __.tag.w

        super.adjust()
    }

    draw() {
        const { __, x, y, w, h } = this
        const tag    = __.tag,
              holder = __.holder,
              pd     = this.padding

        /*
        const b2 = .5 * b,
              bx = holder.w

        lineWidth(b)
        stroke('#6f5f7a')
        rect( bx + b2, b2, w - b, h - b)
        */
        fill('#6f5f7a')
        rect( x, y, w, h )

        super.draw()

        lineWidth(1)
        stroke('#000000')
        rect( x, y, w, h )
        rect( x + pd.E, y + pd.N, w - pd.E - pd.W, h - pd.N - pd.S)
    }

}
