class DustyButton {

    constructor(st) {
        augment(this, {
            x: 0,
            y: 0,
            w: 60,
            h: 16,

            _centered: false,
        }, dna.hud.trait.buttonToolkit, st)

        this.cval  = env.palette.button
        this.color = env.palette.dustyButton
        this.font = env.style.font.dustyButton
    }

    draw() {
        const _ = this
        const { x, y, w, h, cval, color } = this

        save()
        translate(x + .5, y + .5)

        // fill the background
        const bc = cval.base
        _.renderBase(bc)

        const vc  = cval.bevel,
              c0  = hsl( vc.h, vc.s, vc.l - vc.dl ),
              c1  = hsl( vc.h, vc.s, vc.l         ),
              rc  = cval.rim,
              c00 = hsl( rc.h, rc.s - rc.ds, rc.l - rc.dl ),
              c01 = hsl( rc.h, rc.s, rc.l         )

        // TODO remap the rest of the colors from color -> cval
        // TODO introduce multiple styles - gray-disabled, red-active
        //      (maybe blinking red for the upload process?)
        const LW = 2
        ctx.lineCap = 'square'
        _.bevel(0, 0, w, h, LW, c00, c01)

        let tsh = 0
        if (_._hover) {
            // more highlight and shadow
            _.cap(3, 3, w-6, h-6, 2, c1)
            _.shadow(2, 2, w-4, h-4, 1, c0)
            tsh = -1 // shift text a little
        }
        if (this.toggled) {
            _.bevel(1, 1, w-2, h-2, LW, c00, c01)
            _.cap(2, 2, w-3, h-3, 1, c00)
            tsh = 0
        } else {
            _.bevel(1, 1, w-2, h-2, LW, c01, c00)
        }

        baseMiddle()
        alignCenter()
        fill( color.text )
        font( this.font.head )
        text(this.label, .5 * w + tsh, .5 * h + tsh)

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
        // this.onClick()
        this.toggled = false
    }
}

