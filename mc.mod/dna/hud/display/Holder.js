class Holder {

    constructor(st) {
        augment(this, {
            name: 'holder',

            x:     0,
            y:     0,
            w:     20,
            h:     0,

            _centered: false,
        }, st)
    }

    adjust() {
        const __ = this.__
        this.h = .5 * __.h
        this.x = 0
        this.y = .5*__.h - .5*this.h
    }

    draw() {
        const { x, y, w, h } = this

        fill('#6f5f7a')
        rect( x, y, w, h )

        lineWidth(1)
        stroke('#000000')

        const edge = 24,
              step = 5,
              N    = floor(w / (step - 1))

        for (let lx = step; lx < w; lx += step) {
            line(x + lx, y + edge, x + lx, y + h - edge)
        }


        rect( x, y, w, h )
    }

    onClick(x, y, e) {
    }

}
