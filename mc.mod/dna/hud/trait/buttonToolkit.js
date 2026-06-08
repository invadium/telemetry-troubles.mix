const buttonToolkit = {

    init() {
        delete this.name
        delete this.init
    },

    bevel(x, y, w, h, lw, c1, c2) {
        lineWidth(lw)
        stroke(c1)
        line(x, y,       x + w, y    )
        line(x, y + lw,  x,     y + h)

        stroke(c2)
        line(x + lw, y + h,   x + w, y + h     )
        line(x + w,  y + lw,  x + w, y + h - lw)
    },

    shadow(x, y, w, h, lw, c) {
        stroke(c)
        lineWidth(lw)
        line(x + lw, y + h,   x + w, y + h     )
        line(x + w,  y + lw,  x + w, y + h - lw)
    },

    cap(x, y, w, h, lw, c) {
        lineWidth(lw)
        stroke(c)
        line(x, y,       x + w, y    )
        line(x, y + lw,  x,     y + h)
    },

    renderBase(bc, level) {
        const { w, h } = this

        // fill the background base
        fill( hsl( bc.h, bc.s, bc.l ) )
        rect( 0, 0, w, h )

        // fill the corner shades
        const base = w < h? w : h
        const lsh = .2 * level

        // right lower corner
        let sh = (.9 + lsh) * base
        fill( hsl( bc.h, bc.s, bc.l - bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        sh = (.7 + lsh) * base
        fill( hsl( bc.h, bc.s, bc.l - 2*bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        sh = (.5 + lsh) * base
        fill( hsl( bc.h, bc.s, bc.l - 3*bc.dl ) )
        triangle(w, h, w-sh, h, w, h-sh)

        // top-left corner
        sh = (.5 + lsh) * base
        fill( hsl( bc.h, bc.s, bc.l + 2*bc.dl ) )
        triangle(0, 0, 0, sh, sh, 0)
    },
        
}
