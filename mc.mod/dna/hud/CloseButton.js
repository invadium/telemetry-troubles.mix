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
        }, dna.hud.trait.buttonToolkit, st)

        this.cval = env.palette.button
    }

    draw() {
        const _ = this
        const { x, y, w, h, cval, _active } = this
        const level = _.toggled? -1 : (_.hover? 1 : 0)

        save()
        translate(x, y)

        const bc = _active? cval.base : cval.base1
        _.renderBase(bc, level)

        const vc = _active? cval.bevel : cval.bevel1,
              c0 = hsl( vc.h, vc.s, vc.l - vc.dl ),
              c1 = hsl( vc.h, vc.s, vc.l         )

        ctx.lineCap = 'square'

        if (_._hover) {
            // more highlight and shadow
            _.cap(1, 1, w-2, h-2, 1, c1)
            _.shadow(1, 1, w-2, h-2, 1, c0)
        }
        if (_._toggled) {
            _.bevel(0, 0, w, h, 1, c0, c1)
        } else {
            _.bevel(0, 0, w, h, 1, c1, c0)
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

