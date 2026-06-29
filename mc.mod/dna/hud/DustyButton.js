class DustyButton {

    constructor(st) {
        augment(this, {
            x:     0,
            y:     0,
            w:     60,
            h:     16,
            suit:  0,

            _centered: false,
        }, dna.hud.trait.buttonToolkit, st)

        this.cval  = env.palette.button
        this.color = env.palette.dustyButton
        this.font = env.style.font.dustyButton
    }

    draw() {
        const _ = this
        const { x, y, w, h, cval, suit, color } = this

        // fix the color palette
        let bc, vc, rc
        switch(suit) {
            case 0:
                bc = cval.base
                vc = cval.bevel
                rc = cval.rim
                break
            case 1:
                bc = cval.base1
                vc = cval.bevel1
                rc = cval.rim1
                break
            case 2:
                bc = cval.base2
                vc = cval.bevel2
                rc = cval.rim2
                break
        }
        const level = _.toggled? -1 : (_.hover? 1 : 0)
        

        save()
        translate(x + .5, y + .5)

        // fill the background
        _.renderBase(bc, level)

        const c0  = hsl( vc.h, vc.s, vc.l - vc.dl ),
              c1  = hsl( vc.h, vc.s, vc.l         ),
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
        if (_.toggled) {
            _.bevel(1, 1, w-2, h-2, LW, c00, c01)
            _.cap(2, 2, w-3, h-3, 1, c00)
            tsh = 0
        } else {
            _.bevel(1, 1, w-2, h-2, LW, c01, c00)
        }

        if (this.icon) {
            sprite(this.icon, .5 * w + tsh, .5 * h + tsh, 16, 16)
        } else if (this.label) {
            baseMiddle()
            alignCenter()
            fill( color.text )
            font( this.font.head )
            text(this.label, .5 * w + tsh, .5 * h + tsh)
        }

        restore()
    }

    onClick(e) {}

    onMouseMove() {}

    onMouseDrag() {}

    onMouseDown(e) {
        this.toggled = true
        sfx('button-click')
    }

    onMouseUp(e) {
        this.toggled = false
        // sfx('up')
    }

    onMouseEnter(e) {
        sfx('button-hover')
    }

    onMouseExit(e) {
        // sfx('out')
    }
}

