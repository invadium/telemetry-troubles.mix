class Tab extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            x:  0,
            y:  0,
            w:  0,
            h:  0,
            tw: 0,

            title: '',

            color: {
                active:  '#f2be1f',
                base:    '#8090A0',
                text:    '#404040',
                outline: '#000000',
            },
            /*
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
            */
            font: '20px pixel-operator-bold',

            padding: {
                E: 10,
                W: 8,
            },
            hedge1:    8,

            keepZ:       true,
            transparent: true,
            _centered:   false,
            _displayed:  false,
        }, st) )
    }

    // show the components/data associated with the tag
    display() {
        if (this._displayed) return

        if (isFun(this.action)) this.action()
        this.onDisplay()
        this._displayed = true
    }

    // hide the components/data associated with the tag
    conceal() {
        if (!this._displayed) return

        this._displayed = false
        this.onConceal()
    }

    drawContent() {
        const ls = this._ls
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (e.draw && !e.hidden) e.draw()
        }
    }

    draw() {
        const { x, y, w, h, padding, hedge1, dive, color, _displayed } = this

        save()
        translate(x, y)
        /*
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
        */

        // estimate the title width
        baseMiddle()
        alignLeft()
        font(this.font)
        const tw = this.tw = textWidth(this.title),
              WW = this.w
              // W  = padding.E + tw,
              //WW = W + hedge1 + 16
              // this.w = WW

        fill( _displayed? this.color.active : this.color.base, color.outline )
        ctx.lineJoin = 'round'
        polygon(
             0,      0,
             0,      h-hedge1,
             hedge1, h,
             WW,     h,
             WW,     0,
        )
        // rect( 0, 0, __.w, w )

        // fill('#404040')
        // text(this.title, padding.E, .5 * w)

        baseMiddle()
        alignLeft()
        fill( color.text )
        font( this.font )
        text(this.title, padding.E, .5 * h + 2)

        this.drawContent()

        restore()
    }

    onMouseMove(x, y, e) {
        super.onMouseMove(x, y, e)
    }

    onMouseDrag() {}

    onMouseDown(x, y, b, e) {
        const pending = super.onMouseDown(x, y, b, e)

        if (!pending) {
            this._toggled = true
        }
    }

    onMouseUp(x, y, b, e) {
        super.onMouseUp(x, y, b, e)

        if (this._toggled) {
            this._toggled = false
            this.display()
        }
    }

    onDisplay() {}

    onConceal() {}

    isDisplayed() {
        return this._displayed
    }
}

