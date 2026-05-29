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
              holder = __.holder

        _.x = holder.w + __.bevel.b
        _.y = __.bevel.b
        _.w = __.w - 2*__.bevel.b - holder.w - tag.w
        _.h = __.h - _.y - __.bevel.b

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

