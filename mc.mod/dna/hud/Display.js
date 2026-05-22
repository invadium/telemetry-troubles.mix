class Header extends sys.LabFrame {

    constructor() {
        super( augment({
            name:   'header',

            h:      24,
            font:   '20px pixel-operator-bold',
            title:  'Test Window',
            color: {
                base:   '#f2be1f',
            },
            textShift: 10,
            hedge:     8,
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
    }

    draw() {
        const { __, h, hedge, textShift } = this

        save()
        translate( __.w, 0 )
        rotate( HALF_PI )

        // estimate the title width
        baseMiddle()
        alignLeft()
        font(this.font)
        const tw = textWidth(this.title),
              W  = textShift + tw

        fill( this.color.base )
        ctx.lineJoin = 'round'
        polygon(
             hedge, 0,
             0,     hedge,
             0,     h,
             W,     h,
             W + hedge, h - hedge,
             W + hedge, 0,
        )
        // rect( 0, 0, __.w, h )

        fill('#404040')
        text(this.title, textShift, .5 * h)

        restore()

        super.draw()

        /*
        // border
        lineWidth(1)
        stroke(.25, .5, .5)
        rect( 0, 0, __.w, h )
        */
    }
}

class Holder {

    constructor(st) {
        augment(this, {
            name: 'holder',
            x:     0,
            y:     0,
            w:     0,
            h:     32,
        }, st)
    }

    adjust() {
        const __ = this.__
        this.w = .5 * __.h
        this.x = 0
        this.y = .5*__.h - .5*this.w
        // this.y = 0
    }

    draw() {
        const { x, y, w, h } = this

        fill('#6f5f7a')
        rect( x, y, h, w )

        lineWidth(1)
        stroke('#000000')
        rect( x, y, h, w )
    }

}

class ContentPane extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name: 'content',
            x:     0,
            y:     0,
            w:     0,
            h:     0,

            background: '#32313b',
        }, st) )
    }

    adjust() {
        const _      = this,
              __     = _.__,
              header = __.header,
              holder = __.holder

        _.x = holder.h + __.bevel
        _.y = __.bevel
        _.w = __.w - 2*__.bevel - holder.h - header.h
        _.h = __.h - _.y - __.bevel
    }

    drawBackground() {
        const { x, y, w, h, background } = this
        if (!background) return

        fill(background)
        rect( x, y, w, h )
    }

    drawForeground() {
        const { x, y, w, h } = this

        lineWidth(2)
        stroke('#a0fe20')
        rect( x, y, w, h )
    }

    draw() {
        const { x, y, w, h } = this

        this.drawBackground()
        // content
        super.draw()
        // this.drawForeground()
    }
}

class Display extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name: 'display' + id('display'),

            x: 0,
            y: 0,
            w: 0,
            h: 0,

            bevel: 7,
        }, st) )
        const holder = this.attach( new Holder() )
        const header = this.attach( new Header() )
        if (st.title) header.title = st.title
        this.attach( new ContentPane() )
    }

    adjust() {
        const constraints = this.constraints
        if (constraints) {
            const N = constraints.length
            for (let i = 0; i < N; i++) {
                constraints[i](this)
            }
        }

        const ls = this._ls
        for (let i = 0; i < ls.length; i++) {
            const component = ls[i]
            if (component.adjust) component.adjust()
        }
    }

    drawForeground() {
        const { x, y, w, h, bevel, holder, header } = this

        const b  = bevel,
              b2 = .5 * b,
              W  = w - holder.h - header.h,
              bx = holder.h

        lineWidth(b)
        stroke('#6f5f7a')
        rect( bx + b2, b2, W - b, h - b)

        lineWidth(1)
        stroke('#000000')
        rect( bx, 0, W, h )
        rect( bx + b, b, W - 2*b, h - 2*b)

    }

    draw() {
        const { x, y, w, h } = this

        save()
        translate( x, y )

        // content
        super.draw()

        this.drawForeground()

        restore()
    }

}
