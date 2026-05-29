class ContentPane extends $.dna.hud.Container {

    constructor(st) {
        super( augment({
            name: 'content',
            x:     0,
            y:     0,
            w:     0,
            h:     0,

            clip:      true,
            keepZ:     true,
            _centered: false,

            background: '#32313b',
        }, st) )
    }

    adjust() {
        const _      = this,
              __     = _.__,
              tag = __.tag,
              holder = __.holder,
              bevel  = __.bevel,
              pd     = bevel.padding

        _.x = bevel.x + pd.E
        _.y = bevel.y + pd.N
        _.w = bevel.w - pd.E - pd.W
        _.h = __.h - _.y - pd.S

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

        if (this.clip) {
            ctx.beginPath()
            ctx.rect( 0, 0, w, h )
            ctx.clip()
        }

        this.drawBackground()
        this.drawContent()
        // this.drawForeground()

        restore()
    }

    onClick(x, y, e) {
        log('content click!')
    }

    onMouseDown(x, y, b, e) {
        super.onMouseDown(x, y, b, e)
    }
}

