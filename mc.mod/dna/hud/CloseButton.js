class CloseButton {

    constructor(st) {
        augment(this, {
            x: 0,
            y: 0,
            w: 16,
            h: 16,

            _active:   false,
            _toggled:  false,
            _centered: false,
        }, st)

        this.cval = env.palette.button
    }

    draw() {
        const { x, y, w, h, cval, _active } = this

        save()
        translate(x, y)

        function bevel(x, y, w, h, lw, c1, c2) {
            lineWidth(lw)
            stroke(c1)
            line(x, y,       x + w, y    )
            line(x, y + lw,  x,     y + h)

            stroke(c2)
            line(x + lw, y + h,   x + w, y + h     )
            line(x + w,  y + lw,  x + w, y + h - lw)
        }

        function shadow(x, y, w, h, lw, c) {
            stroke(c)
            lineWidth(lw)
            line(x + lw, y + h,   x + w, y + h     )
            line(x + w,  y + lw,  x + w, y + h - lw)
        }

        function cap(x, y, w, h, lw, c) {
            lineWidth(lw)
            stroke(c)
            line(x, y,       x + w, y    )
            line(x, y + lw,  x,     y + h)
        }

        // fill the background base
        const bc = _active? cval.base : cval.base0
        fill( hsl( bc.h, bc.s, bc.l ) )
        rect( 0, 0, w, h )

        // fill the corner shades
        const base = w < h? w : h

        // right lower corner
        let sh = .9 * base
        fill( hsl( bc.h, bc.s, bc.l - bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        sh = .7 * base
        fill( hsl( bc.h, bc.s, bc.l - 2*bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        sh = .5 * base
        fill( hsl( bc.h, bc.s, bc.l - 3*bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        // top-left corner
        sh = .5 * base
        fill( hsl( bc.h, bc.s, bc.l + 2*bc.dl ) )
        triangle(0, 0, 0, sh, sh, 0)

        const vc = _active? cval.bevel : cval.bevel0,
              c0 = hsl( vc.h, vc.s, vc.l - vc.dl ),
              c1 = hsl( vc.h, vc.s, vc.l         )

        ctx.lineCap = 'square'

        if (this._hover) {
            cap(1, 1, w-2, h-2, 1, c1)
            shadow(1, 1, w-2, h-2, 1, c0)
        }
        if (this._toggled) {
            bevel(0, 0, w, h, 1, c0, c1)
        } else {
            bevel(0, 0, w, h, 1, c1, c0)
        }

        /*
        if (this._toggled) {
            bevel(1, 1, w-2, h-2, 1, c1, c1)
            cap(2, 2, w-3, h-3, 1, c0)
        } else {
            bevel(1, 1, w-2, h-2, 1, c0, c1)
        }
        */

        restore()
    }

    onClick(e) {
    }

    onMouseDown(e) {
        this._toggled = true
    }

    onMouseUp(e) {
        this._toggled = false
    }

    onMouseMove() {}

    onMouseDrag() {}
}

