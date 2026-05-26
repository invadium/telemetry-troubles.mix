class Tag extends sys.LabFrame {

    constructor() {
        super( augment({
            name:   'tag',

            x:         0,
            y:         0,
            h:         0,
            w:         24,
            _centered: false,

            font:   '20px pixel-operator-bold',
            title:  'Test Window',
            color: {
                active: '#f2be1f',
                base:   '#8090A0',
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

        fill( active? this.color.active : this.color.base, '#000000' )
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

        fill('#404040')
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
        if (this.lock) {
            this.lock = false
        } else {
            this.__.switch()
        }
    }

    onMouseMove() {}

    onMouseDown() {
        this._pressed = true
    }

    onMouseUp() {
        this._pressed = false
    }

    onMouseDrag() {}
}

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

class ContentPane extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'content',
            x:     0,
            y:     0,
            w:     0,
            h:     0,

            _centered: false,

            background: '#32313b',
        }, st) )
    }

    adjust() {
        const _      = this,
              __     = _.__,
              tag = __.tag,
              holder = __.holder

        _.x = holder.w + __.bevel
        _.y = __.bevel
        _.w = __.w - 2*__.bevel - holder.w - tag.w
        _.h = __.h - _.y - __.bevel

        super.adjust()
    }

    drawBackground() {
        const { x, y, w, h, background } = this
        if (!background) return

        fill(background)
        rect( 0, 0, w, h )
    }

    drawForeground() {
        const { x, y, w, h } = this

        lineWidth(2)
        stroke('#a0fe20')
        rect( 0, 0, w, h )
    }

    draw() {
        const { x, y, w, h } = this

        save()
        translate( x, y )

        this.drawBackground()
        this.drawContent()
        // this.drawForeground()

        restore()
    }

    onClick(x, y, e) {
    }
}

class Display extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'display' + id('display'),

            x: 0,
            y: 0,
            w: 0,
            h: 0,

            stretch: 1, // 0..1 display extension value
            bevel:   7,
        }, st) )
        const holder = this.attach( new Holder() )
        const tag = this.attach( new Tag() )
        if (st.title) tag.title = st.title
        this.attach( new ContentPane() )
    }

    adjust() {
        this.detracted = (this.stretch === 0)

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

    switch() {
        if (this.stretch < 1 && this.stretch > 0) return // in transit

        const target = this
        if (this.stretch === 0) {
            job.kinetix.tween( (v, t) => {
                target.stretch = v
            }, $.dna.kinetix.easingNG.bounce.out)
                .time(2)
        } else if (this.stretch === 1) {
            job.kinetix.tween( (v, t) => {
                target.stretch = 1 - v
            }, $.dna.kinetix.easingNG.bounce.out)
                .time(2)
        }
    }

    drawBackground() {}

    drawForeground() {
        const { x, y, w, h, bevel, holder, tag } = this

        const b  = bevel,
              b2 = .5 * b,
              W  = w - holder.w - tag.w,
              bx = holder.w

        lineWidth(b)
        stroke('#6f5f7a')
        rect( bx + b2, b2, W - b, h - b)

        lineWidth(1)
        stroke('#000000')
        rect( bx, 0, W, h )
        rect( bx + b, b, W - 2*b, h - 2*b)

    }

    drawContent() {
        const ls = this._ls
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (e.draw && !e.hidden) e.draw()
        }
    }

    draw() {
        const { x, y, w, h } = this

        save()
        translate( x, y )

        // content - MUST draw manually, since hud.Container is binded to a wrong context now!
        this.drawContent()
        this.drawForeground()

        restore()
    }

    isActive() {
        return (this.focus && !this.detracted)
    }

    onFocus() {
        if (!this.detracted) this.tag.lock = true
    }

    onUnfocus() {
        // log(`${this.name}: lost focus`)
    }

    // onClick(x, y, e) {
    //    super.onClick(x, y, e)
    //}

    onKeyDown(e) {
        // TODO handle focus and keyboard events fo tx components the same way we handle Hud
    }

}
