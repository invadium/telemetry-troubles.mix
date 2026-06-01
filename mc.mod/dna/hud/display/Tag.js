// display header tag
class Tag extends sys.LabFrame {

    constructor() {
        super( augment({
            name:   'tag',

            x:         0,
            y:         0,
            h:         0,
            w:         24,
            _centered: false,
            displayed: false,

            font:   '20px pixel-operator-bold',
            title:  'Test Window',
            color: {
                active:  '#f2be1f',
                base:    '#8090A0',
                text:    '#404040',
                outline: '#000000',
            },
            textShift: 10,
            hedge1:    8,
            hedge2:    10,
            dive:      4,

            clip:      false,
        }) )

        /*
        this.spawn( dna.hud.HaikuButton, {
            x: 7,
            y: 7,
            w: 18,
            h: 18,
        })
        */
    }

    adjust() {
        this.x = this.__.w - this.w
    }

    draw() {
        const { __, w, hedge1, hedge2, dive, textShift } = this
        const active = __.isActive()

        const dx = (__.focus || __.detracted)? (this._pressed? -2 : (this._hover? 4 : 0)) : 0

        save()
        translate( __.w + dx, 0 )
        rotate( HALF_PI )

        // estimate the title width
        baseMiddle()
        alignLeft()
        font(this.font)
        const tw = textWidth(this.title),
              W  = textShift + tw,
              WW = W + hedge2

        fill( active? this.color.active : this.color.base, this.color.outline )
        ctx.lineJoin = 'round'
        polygon(
             hedge1,  0,
             0,      hedge1,
             0,      w + dive,
             W,      w + dive,
             WW,     w - hedge2,
             WW,     0,
        )
        this.h = WW
        // rect( 0, 0, __.w, w )

        fill( this.color.text )
        text(this.title, textShift, .5 * w)

        restore()

        super.draw()

        /*
        // border
        lineWidth(1)
        stroke(.25, .5, .5)
        rect( 0, 0, __.w, h )
        */
    }

    onClick(x, y, e) {
    }

    onMouseMove() {}

    onMouseDown() {
        this._pressed = true
    }

    onMouseUp(x, y, b, e) {
        if (!e._captured) return // ignore the "mouse hover" up event and wait for the captured one

        if (this.lock) {
            this.lock = false
        } else {
            this.__.switch()
        }
        this._pressed = false
    }

    onMouseDrag() {}
}
