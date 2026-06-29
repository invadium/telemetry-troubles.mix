const Tag = require('/mod/mc/dna/hud/display/Tag')
const Bevel = require('/mod/mc/dna/hud/display/Bevel')
const Holder = require('/mod/mc/dna/hud/display/Holder')
const ContentPane = require('/mod/mc/dna/hud/display/ContentPane')

class Display extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'display' + id('display'),

            x: 0,
            y: 0,
            w: 0,
            h: 0,

            stretch: 1, // 0..1 display extension value
            // bevel:   7,
        }, st) )
        const holder = this.attach( new Holder() )
        const tag = this.attach( new Tag() )
        const bevel = this.attach( new Bevel() )
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
            sfx('expand')
        } else if (this.stretch === 1) {
            job.kinetix.tween( (v, t) => {
                target.stretch = 1 - v
            }, $.dna.kinetix.easingNG.bounce.out)
                .time(2)
            sfx('detract')
        }
    }

    drawBackground() {}

    /*
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
    */

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
        // this.drawForeground()

        restore()
    }

    isActive() {
        return (this.focus && !this.detracted)
    }

    onAttach(node) {
        node._display = this
    }

    onFocus() {
        sfx('display-select')
    }

    onUnfocus() {
    }

    // onClick(x, y, e) {
    //    super.onClick(x, y, e)
    //}

    onKeyDown(e) {
        // TODO handle focus and keyboard events fo tx components the same way we handle Hud
    }

}
