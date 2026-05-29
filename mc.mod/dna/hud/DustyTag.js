class DustyButton {

    constructor(st) {
        augment(this, {
            x: 0,
            y: 0,
            w: 60,
            h: 16,

            color: {
                bevel0: '#989800FF',
                bevel1: '#F8F830FF',
                base:   '#f0e040',

                hi0:    '#f8e850',
                low0:   '#f8a810',
                low1:   '#f8c800',

                hi:     '#ffdd7d',
                low:    '#ebb51c',
                fence:  '#fcee4e',

                text:   '#000000',
            },
            font: '20px pixel-operator-bold',

            _centered: false,
        }, st)
    }

    draw() {
        const { x, y, w, h, color } = this

        save()
        translate(x + .5, y + .5)

        function bevel(x, y, w, h, lw, c1, c2) {
            lineWidth(lw)
            stroke(c1)
            line(x, y,       x + w, y    )
            line(x, y + lw,  x,     y + h)

            stroke(c2)
            line(x + lw, y + h,   x + w, y + h     )
            line(x + w,  y + lw,  x + w, y + h - lw)
        }

        function cap(x, y, w, h, lw, c) {
            lineWidth(lw)
            stroke(c)
            line(x, y,       x + w, y    )
            line(x, y + lw,  x,     y + h)
        }

        // fill the background
        fill(color.base)
        rect( 0, 0, w, h )

        // fill the corner shades
        const base = w < h? w : h
        fill(color.low1)
        triangle(w, h, w-base, h, w, 0)

        const sh = .5 * base
        fill(color.low0)
        triangle(w, h, w-sh, h, w, h-sh)

        fill(color.hi0)
        triangle(0, 0, 0, 7, 7, 0)

        const LW = 2
        ctx.lineCap = 'square'
        bevel(0, 0, w, h, LW, color.bevel0, color.bevel1)

        if (this.toggled) {
            bevel(1, 1, w-2, h-2, LW, color.bevel1, color.bevel1)
            cap(2, 2, w-3, h-3, 1, color.bevel0)
        } else {
            bevel(1, 1, w-2, h-2, LW, color.bevel1, color.bevel0)
        }

        baseMiddle()
        alignCenter()
        fill( color.text )
        font( this.font )
        text(this.label, .5 * w, .5 * h)

        restore()
    }

    onClick(e) {
    }

    onMouseMove() {}

    onMouseDrag() {}

    onMouseDown(e) {
        this.toggled = true
    }

    onMouseUp(e) {
        this.onClick()
        this.toggled = false
    }
}

